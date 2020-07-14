const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cookieSession = require('cookie-session');
const compression = require('compression');
const csurf = require('csurf');
const cryptoRandomString = require('crypto-random-string');
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');

const db = require('./db');
const ses = require('./ses');
const { hash, compare } = require('./bc');



//////////////----uploading image----///////////////
const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

//////////////////////////////////////////////////////////////////
// MIDDLEWARE
//////////////////////////////////////////////////////////////////

app.use(compression());

const cookieSessionMiddleware = cookieSession({
    secret: "I'm always hungry",
    maxAge: 1000 * 60 * 60 * 24 * 14
});
app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());
app.use(function (req, res, next) {
    //req.csrfToken generate token
    res.cookie('mytoken', req.csrfToken());
    //console.log('req.csrfToken', req.csrfToken())
    next();
});

app.use(express.json());

app.use(express.static('public'));
app.use(express.static("./uploads"));

//////////////////////////////////////////////////////////////////

if (process.env.NODE_ENV != 'production') {
    app.use(
        '/bundle.js',
        require('http-proxy-middleware')({
            target: 'http://localhost:8081/'
        })
    );
} else {
    app.use('/bundle.js', (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

//---------------------------------------------------------------
//-----------------WELCOME STUFF
//---------------------------------------------------------------
app.post('/register', (req, res) => {
    console.log('/register req.body: ', req.body);
    //create a database 
    let first = req.body.first;
    let last = req.body.last;
    let email = req.body.email;
    let pass = req.body.password;
    //console.log('req.session.userId :', req.session.userId)
    //res.json({ success: true });
    hash(pass).then(hashedPass => {
        db.addUser(first, last, email, hashedPass).then(results => {
            req.session.userId = results.rows[0].id;
            console.log('cookie after register addUser: ', req.session.userId);
            //console.log('hashedPass: ', hashedPass);
            results.rows[0].success = true;
            console.log('results: ', results.rows[0]);
            res.json(results.rows[0]);
        }).catch(err => console.log('error in registration', err));
    }).catch(err => console.log('error with password', err));
});

app.post('/login', (req, res) => {
    console.log('req.body in login ', req.body);
    let email = req.body.email;
    let pass = req.body.password;
    db.getPassword(email).then(results => {
        console.log('results.rows: ', results.rows[0]);
        if (typeof results.rows[0] == 'undefined') {
            console.log("did not register");
            //location.replace('/');
        } else {
            if (email === results.rows[0].email) {
                console.log('pass inserted in login: ', pass);
                compare(pass, results.rows[0].password).then(match => {
                    if (match == true) {
                        console.log('pass match', match);
                        //let idInUser = results.rows[0].id;
                        //console.log('user id after login: ', idInUser);
                        results.rows[0].success = true;
                        req.session.userId = results.rows[0].id;
                        res.json(results.rows[0]);

                    } else {
                        console.log('pass did not match', match);
                        results.rows[0].success = false;
                        res.json(results.rows[0]);

                    }
                }).catch(err => {
                    console.log('error comparing password', err);
                });

            } else {
                console.log('email not found');
                location.replace('/');
            }
        }

    }).catch(err => {
        console.log('error passing email', err);
    });

});

app.post('/reset/start', (req, res) => {
    console.log('/reset/start req.body', req.body);
    let email = req.body.email;
    db.getPassword(email).then(results => {
        console.log('results from get email in /reset: ', results.rows[0]);
        if (typeof results.rows[0] == "undefined") {
            console.log("in /reset--> email not found");
            res.json(false);
        } else {
            if (email === results.rows[0].email) {
                const secretCode = cryptoRandomString({
                    length: 6
                });
                console.log('secretCode:', secretCode);
                db.addCode(email, secretCode).then(results => {
                    console.log('results from secretCode: ', results.rows[0]);
                    //console.log('email', email)
                    //console.log('secretCode: ', secretCode)
                    const message = `Your code: ${secretCode}`;
                    const subject = `Change your password`;
                    ses.sendEmail(email, message, subject).then(results => {
                        console.log('email sent');
                        res.json();

                    }).catch(err => {
                        console.log('error sending email:', err);
                    });
                    console.log('results from addCode: ');
                    console.log(results.rows[0]);

                    res.json(true);


                }).catch(err => console.log('error inserting secretCode', err));

            }
        }

    }).catch(err => console.log('error getting email', err));

});

app.post('/reset/verify', (req, res) => {
    console.log('req.body in /reset/verify ', req.body);
    let email = req.body.email;
    db.getCode(email).then(results => {
        console.log('results from getCode: ', results.rows[0]);
        if (req.body.code === results.rows[0].code) {
            let pass = req.body.password;
            hash(pass).then(hashedPass => {
                db.updatePassword(email, hashedPass).then(results => {
                    console.log('results verify hashed pass: ', results.rows[0]);
                    results.rows[0].success = true;
                    res.json(results.rows[0]);
                }).catch(err => console.log('error in registration', err));
            }).catch(err => console.log('error with password', err));
        } else {
            results.rows[0].success = false;
            res.json(results.rows[0]);
        }
    }).catch(err => {
        console.log('error getting code', err);
    });
});

//---------------------------------------------------------------
//-----------------APP STUFF
//---------------------------------------------------------------

//-------------- APP
app.post('/user', (req, res) => {
    console.log('req.session.userId:: ', req.session.userId);
    let userId = req.session.userId;
    db.getUserInfo(userId).then(results => {
        console.log('/user results from getUserInfo: ', results.rows[0]);
        res.json(results.rows[0]);
    }).catch(err => console.log('error inserting secretCode', err));
});

//-------------- UPLOADER
app.post('/upload', uploader.single('file'), ses.upload, (req, res) => {
    console.log('/upload req.file:', req.file);
    let userId = req.session.userId;
    let filename = req.file.filename;
    let url = `https://imageboardbuck.s3.amazonaws.com/${filename}`;
    if (req.file) {
        db.addImage(userId, url).then(results => {
            console.log('results from addImages: ', results.rows[0]);
            res.json(results.rows[0]);
        }).catch(err => {
            console.log('err: ', err);
        });
    } else {
        res.json({ success: false });
    }
});


//---------------------------------------------------------------
//-----------------WELCOME
//---------------------------------------------------------------
app.get('/welcome', (req, res) => {
    if (req.session.userId) {
        res.redirect('/');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});

//---------------------------------------------------------------
//-----------------LOGOUT
//---------------------------------------------------------------
app.post('/logout', (req, res) => {
    req.session = null;
    res.json(true);
});

//---------------------------------------------------------------
//final route in order...catch everything else
//---------------------------------------------------------------
app.get('*', function (req, res) {
    if (!req.session.userId) {
        res.redirect('/welcome');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});


//---------------------------------------------------------------
//run socket
//---------------------------------------------------------------



//1. insert msg in chat table (Returning something?)
//2.do query to get first, last, img (Join)
//
//emit the msg so that everyone can see it:
//io.socket.emit('addChatMsg', ....)



//---------------------------------------------------------------
//run server
//---------------------------------------------------------------
server.listen(8080, function () {
    console.log("I'm listening.");
});