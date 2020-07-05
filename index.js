const ses = require('./ses');
const express = require('express');
const app = express();
const compression = require('compression');
const server = require('http').Server(app);
//const io = require('socket.io')(server, { origins: 'localhost:8080' });
const db = require('./db');
const cookieSession = require('cookie-session');
const csurf = require('csurf');
const cryptoRandomString = require('crypto-random-string');




const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');

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

const { hash, compare } = require('./bc');

app.use(compression());

app.use(cookieSession({
    secret: "Secret_cookies",
    maxAge: 1000 * 60 * 60 * 24 * 14
}));

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie('mytoken', req.csrfToken())
    console.log('req.csrfToken', req.csrfToken())
    next();
})

app.use(express.json());

app.use(express.static('public'));
app.use(express.static("./uploads"));


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

app.post('/register', (req, res) => {
    console.log('req.body: ', req.body);
    let first = req.body.first;
    let last = req.body.last;
    let email = req.body.email;
    let pass = req.body.password;
    hash(pass).then(hashedPass => {
        db.addUser(first, last, email, hashedPass).then(results => {
            req.session.userId = results.rows[0].id;
            console.log('cookie____addUser: ', req.session.userId);
            results.rows[0].success = true;
            console.log('results: ', results.rows[0]);
            res.json(results.rows[0]);
        }).catch(err => console.log('err_registration', err));
    }).catch(err => console.log('err_password', err));
});

app.post('/login', (req, res) => {
    console.log('req.body_login ', req.body)
    let email = req.body.email;
    let pass = req.body.password;
    db.getPassword(email).then(results => {
        console.log('results.rows: ', results.rows[0])
        if (results.rows == []) {
            console.log("no_register");
            location.replace('/');
        } else {
            if (email === results.rows[0].email) {
                console.log('pass_log: ', pass)
                compare(pass, results.rows[0].password).then(match => {
                    if (match == true) {
                        console.log('pass_match', match);
                        results.rows[0].success = true;
                        req.session.userId = results.rows[0].id;
                        res.json(results.rows[0]);

                    } else {
                        console.log('pass_didnt match', match);
                        results.rows[0].success = false;
                        res.json(results.rows[0]);

                    }
                }).catch(err => {
                    console.log('error_comp_password', err);
                });

            } else {
                console.log('email not found')
                location.replace('/');
            }
        }

    }).catch(err => {
        console.log('erremail', err);
    });

})

app.post('/reset/start', (req, res) => {
    let email = req.body.email;
    db.getPassword(email).then(results => {
        console.log('results_reset_getemail: ', results.rows[0])
        if (typeof results.rows[0] == "undefined") {
            res.json(false);
        } else {
            if (email === results.rows[0].email) {
                const secretCode = cryptoRandomString({
                    length: 6
                });
                console.log('secretCode:', secretCode)
                db.addCode(email, secretCode).then(results => {
                    console.log('results_secretCode: ', results.rows[0])
                    const message = `Your code is: ${secretCode}`
                    const subject = `Change your password`
                    ses.sendEmail(email, message, subject).then(results => {
                        console.log('res_email');
                        res.json();

                    }).catch(err => {
                        console.log('err_email:', err);
                    });
                    console.log('results_addCode: ')
                    console.log(results.rows[0]);

                    res.json(true);


                }).catch(err => console.log('err_secretCode', err));

            }
        }

    }).catch(err => console.log('err_email', err));

})

app.post('/reset/verify', (req, res) => {
    console.log('req.body_reset ', req.body)
    let email = req.body.email;
    db.getCode(email).then(results => {
        console.log('results_getCode: ', results.rows[0])
        if (req.body.code === results.rows[0].code) {
            let pass = req.body.password;
            hash(pass).then(hashedPass => {
                db.updatePassword(email, hashedPass).then(results => {
                    console.log('results_ver_hashpass: ', results.rows[0]);
                    results.rows[0].success = true;
                    res.json(results.rows[0]);
                }).catch(err => console.log('err_registration', err));
            }).catch(err => console.log('err_password', err));
        } else {
            results.rows[0].success = false;
            res.json(results.rows[0]);
        }
    }).catch(err => {
        console.log('err_getcode', err);
    });
})

app.get('/user', (req, res) => {
    console.log('req.session.userId: ', req.session.userId)
    let userId = req.session.userId;
    db.getUserInfo(userId).then(results => {
        console.log('results_getUserInfo: ', results.rows[0]);
        res.json(results.rows[0]);
    }).catch(err => console.log('err_secretCode', err));
})

app.post('/upload', uploader.single('file'), ses.upload, (req, res) => {
    console.log('axios')
    console.log('req:', req.file)
    let userId = req.session.userId;
    let filename = req.file.filename;
    let url = `https://imageboardbuck.s3.amazonaws.com/${filename}`;
    if (req.file) {
        db.addImage(userId, url).then(results => {
            console.log('results_addImages: ', results.rows[0])
            res.json(results.rows[0]);
        }).catch(err => {
            console.log('err_addimg: ', err);
        });
    } else {
        res.json({ success: false });
    }
})

app.post('/bioediting', (req, res) => {
    let userId = req.session.userId;
    let text = req.body.biotext;
    db.setBio(userId, text).then(results => {
        console.log('results_setBio: ', results.rows[0]);
        res.json(results.rows[0]);
    }).catch(err => console.log('err_bioediting', err));


})

app.post('/otherUser', (req, res) => {
    console.log('/otherUser req.id_url:::::::::::::', req.body);
    //let userId = req.session.userId;
    //let text = req.body.biotext;
    //console.log('in bioediting::', text, userId)
    db.getUserInfo(req.body.id).then(results => {
        if (req.session.userId == results.rows[0].id) {
            console.log("!!!!!!!!!!!!!if happend")
            results.rows[0].currentUser = true;
        }
        console.log('/otherUser results from getUserInfo: ', results.rows[0]);
        res.json(results.rows[0]);
    }).catch(err => console.log('error getUserInfo', err));
})


//app.get('/isBio', (req, res) => {
//    ('axios getting bio')
//})

app.get('/welcome', (req, res) => {
    if (req.session.userId) {
        res.redirect('/');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
})


app.get('/logout', (req, res) => {
    req.session = null;
    res.json(true);
});


app.get('*', function (req, res) {
    if (!req.session.userId) {
        res.redirect('/welcome');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});

//io.on('connection', socket => {

//console.log(`Socket with id ${socket.id} just CONNECTED`);

// socket.on('disconnect', () => {
//      console.log(`Socket with id ${socket.id} just DISCONNECTED`);
//   });
//});

server.listen(8080, function () {
    console.log("I'm listening.");
});