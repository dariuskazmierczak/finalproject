const express = require('express');
const app = express();
const compression = require('compression');

const cookieSession = require('cookie-session');
const csurf = require('csurf');
const db = require('./db');
const cryptoRandomString = require('crypto-random-string');
const ses = require('./ses');

const { hash, compare } = require('./bc');

const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const { match } = require('assert');

//----- Uploading img----//

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


//---Middleware---//

app.use(compression());

app.use(express.json());

app.use(express.static('public'));

app.use(cookieSession({
    secret: "it might be anything",
    maxAge: 1000 * 60 * 60 * 24 * 14
}));


app.use(csurf());

app.use(function (req, res, next) {
    res.cookie('mytoken', req.csrfToken());
    next();
});


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

//--------Routes---------//


app.post('/register', (req, res) => {
    console.log('req.body:', req.body);
    let { first, last, email, password } = req.body;
    hash(req.body.password)
        .then((hashedPass) => {
            db.addUser(first, last, email, hashedPass).then(results => {
                req.session.userId = results.rows[0].id;
                console.log('cookie: ', req.session.userId);
                //console.log('hashedPass: ', hashedPass);
                results.rows[0].success = true;
                console.log('results: ', results.rows[0]);
                res.json(results.rows[0]);
            }).catch(err => console.log('error_registration', err));
        }).catch(err => console.log('error_password', err));
});

app.post('/login', (req, res) => {
    console.log('req.body:', req.body);
    let { email, password } = req.body;
    db.addUser(req.body.email)
        .then(results => {
            console.log('Registered Adduser row results: ', results.rows);
            if (results.rows == []) {
                console.log("did not register");
                location.replace('/');
            } else {
                if (email === results.rows[0].email) {
                    console.log('pass_ins_login: ', password)
                    compare(req.body.password, results.rows[0].password).then(match => {
                        if (match == true) {
                            console.log('pass_match', match);
                            //let idInUser = results.rows[0].id;
                            //console.log('user id after login: ', idInUser);
                            results.rows[0].success = true;
                            req.session.userId = results.rows[0].id;
                            res.json(results.rows[0]);

                        } else {
                            console.log('pass_did_not_match', match);
                            results.rows[0].success = false;
                            res.json(results.rows[0]);

                        }
                    }).catch(err => {
                        console.log('error_comp_ password', err);
                    });

                } else {
                    //console.log('email not found')
                    location.replace('/');
                }
            }

        }).catch(err => {
            console.log('error_pass_email', err);
        });

})

app.post('/reset/start', (req, res) => {
    console.log('req.body_login ', req.body)
    let email = req.body.email;
    db.getPassword(email).then(results => {
        console.log('results_get_email/reset: ', results.rows[0])
        if (results.rows == []) {
            results.rows[0].success = false;
        } else {
            if (email === results.rows[0].email) {
                const secretCode = cryptoRandomString({
                    length: 6
                });
                db.addCode(email, secretCode).then(results => {
                    console.log('results_secretCode: ', results.rows[0])
                    console.log('email', email)
                    console.log('secretCode: ', secretCode)
                    const message = `Your code: ${secretCode}`
                    const subject = `Change your password`
                    ses.sendEmail(email, message, subject).then(results => {
                        console.log('email sent');
                        res.json();

                    }).catch(err => {
                        console.log('error:', err);
                    });
                    console.log('results_addCode: ')
                    results.rows[0].success = true;

                    res.json(results.rows[0]);


                }).catch(err => console.log('error:', err));

            }
        }

    }).catch(err => console.log('error', err));
})

app.post('/reset/verify', (req, res) => {
    console.log('req.body_/reset/verify ', req.body)
    let email = req.body.email;
    db.getCode(email).then(results => {
        console.log('results_getCode: ', results.rows[0])
        if (req.body.code === results.rows[0].code) {
            let password = req.body.password;
            hash(password).then(hashedPass => {
                db.updatePass(email, hashedPass).then(results => {
                    console.log('results verify hashed pass: ', results.rows[0]);
                    results.rows[0].success = true;
                    res.json(results.rows[0]);
                }).catch(err => console.log('error_registration', err));
            }).catch(err => console.log('error_password', err));
        } else {
            results.rows[0].success = false;
            res.json(results.rows[0]);
        }
    }).catch(err => {
        console.log('error_code', err);
    });
})

app.get('/user', (req, res) => {
    console.log('req.session.userId: ', req.session.userId)
    let userId = req.session.userId;
    db.getUserInfo(userId).then(results => {
        console.log('results_getUserInfo: ', results.rows[0]);
        res.json(results.rows[0]);
    }).catch(err => console.log('err_ins_secretCode', err));
})

app.post('/upload', uploader.single('file'), ses.upload, (req, res) => {
    console.log('axios')
    //console.log('req:', req)
    let userId = req.session.userId;
    let filename = req.file.filename;
    let url = `https://imageboardbuck.s3.amazonaws.com/${filename}`;
    if (req.file) {
        db.addImage(userId, url).then(results => {
            console.log('results from addImages: ', results.rows[0])
            res.json(results.rows[0]);
        }).catch(err => {
            console.log('err: ', err);
        });
    } else {
        res.json({ success: false });
    }
})

app.get('/welcome', (req, res) => {
    if (req.session.userId) {
        res.redirect('/');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});

app.get('*', function (req, res) {
    if (!req.session.userId) {
        res.redirect('/welcome');
    }
    res.sendFile(__dirname + '/index.html');
});

app.listen(8080, function () {
    console.log("I'm listening.");
});