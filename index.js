const express = require('express');
const app = express();
const compression = require('compression');
const cookieSession = require('cookie-session');
const csurf = require('csurf');
const cryptoRandomString = require('crypto-random-string');
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
//const cors = require('cors');
const ses = require('./ses');
const { hash, compare } = require('./bc');
const db = require('./db');

const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const fs = require('fs');

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

const memStorage = multer.memoryStorage();
const buffMulter = multer({ storage: memStorage });

//////////////////////////////////////////////////////////////////
// MIDDLEWARE
//////////////////////////////////////////////////////////////////
app.use(compression());

app.use(cookieSession({
    secret: "I'm always angry",
    maxAge: 1000 * 60 * 60 * 24 * 14,
    SameSite: 'Strict'
}));


app.use(csurf());
app.use(function (req, res, next) {
    //req.csrfToken generate token
    res.cookie('mytoken', req.csrfToken())
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

//---------------- REGISTER
app.post('/register', (req, res) => {
    console.log('/register req.body::: ', req.body);

    let email = req.body.email;
    let pass = req.body.password;
    hash(pass)
        .then((hashedPass) => {
            //console.log('po hash ', req.body);
            db.addUser(email, hashedPass)
                .then((results) => {
                    //set cookies = log user
                    req.session.userId = results.rows[0].id;
                    console.log('User have log in. ID: ', req.session.userId);
                    return req.session.userId;
                })
                .then((aa) => {
                    console.log('ostatni promise ', aa);
                    res.json({ success: true });
                })
                .catch(err => {
                    console.log('error in db.addUser', err);
                    res.json({ success: false });
                });
        })
        .catch(err => {
            console.log('error with hash(pass)', err)
            res.json({ success: false });
        });
});

//---------------- LOGIN
app.post('/login', (req, res) => {
    console.log('/login req.body::: ', req.body);

    let email = req.body.email;
    let pass = req.body.password;
    db.getPassword(email).then(results => {
        //console.log('Login results: ', results);
        if (results.rows.length == 0) {
            res.json({ success: false });
        }
        else {
            compare(pass, results.rows[0].password).then(match => {
                if (match == true) {
                    //set cookies = log user
                    req.session.userId = results.rows[0].id;
                    console.log('User have log in. ID: ', req.session.userId);
                    return true;
                }
                else {
                    console.log('pass did not match', match);
                    return false;
                }
            }).then((suc) => {
                console.log('suc:', suc);
                res.json({ success: suc });
            }).catch(err => {
                console.log('error comparing password', err);
                res.json({ success: false });
            });
        }
    }).catch(err => {
        console.log('error passing email', err);
        res.json({ success: false });
    });
});

//---------------- RESET
app.post('/reset/start', (req, res) => {
    console.log('/reset/start req.body:::', req.body);

    let email = req.body.email;
    db.getPassword(email).then(results => {
        console.log('results from get email in /reset: ', results.rows[0]);
        if (results.rows.length == 0) {
            console.log("in /reset/start --> email not found");
            res.json({ success: false });
        } else {
            const secretCode = cryptoRandomString({ length: 6 });
            console.log('secretCode:', secretCode);
            db.addCode(email, secretCode).then(results => {
                const message = `Your code: ${secretCode}`;
                const subject = `Change password in Uresumer`;
                ses.sendEmail(email, message, subject).then(results => {
                    console.log('email sent');
                    res.json({ success: true });
                }).catch(err => {
                    console.log('error sending email:', err);
                    res.json({ success: false });
                });

                console.log('results from addCode: ');
                console.log(results.rows[0]);
                res.json(true);

            }).catch(err => {
                console.log('error inserting secretCode', err)
                res.json({ success: false });
            });
        }
    }).catch(err => {
        console.log('error getting email', err)
        res.json({ success: false });
    });
});

app.post('/reset/verify', (req, res) => {
    console.log('/reset/verify req.body::: ', req.body);

    let email = req.body.email;
    let code = req.body.code;
    db.getCode(email).then(results => {
        if (results.rows.length == 0) {
            console.log("in /reset/verify--> email not found");
            res.json({ success: false });
        } else {
            console.log('results from getCode: ', results.rows[0]);
            if (code === results.rows[0].code) {
                let pass = req.body.password;
                hash(pass).then(hashedPass => {
                    db.updatePassword(email, hashedPass).then(results => {
                        console.log('SUCCESS updating password, results: ', results.rows[0]);
                        res.json({ success: false });
                    }).catch(err => {
                        console.log('error db.updatePassword', err);
                        res.json({ success: false });
                    });
                }).catch(err => {
                    console.log('error creating hash password', err);
                    res.json({ success: false });
                });
            } else {
                console.log('missmatch code');
                res.json({ success: false });
            }
        }
    }).catch(err => {
        console.log('error getting code', err);
        res.json({ success: false });
    });
});

//---------------------------------------------------------------
//-----------------GET LOGIN DATA
//---------------------------------------------------------------
app.post('/user', (req, res) => {
    console.log('/user req.session.userId::: ', req.session.userId)
    let userId = req.session.userId;
    db.getUserInfo(userId).then(results => {
        console.log('/user results from getUserInfo: ', results.rows[0]);
        res.json(results.rows[0]);
    }).catch(err => console.log('error getUserInfo', err));
})

//---------------------------------------------------------------
//-----------------PERSONAL
//---------------------------------------------------------------

//-----get
app.post('/personal_get', (req, res) => {
    //console.log('/personal get req.body :::', req.body);
    db.getPersonal(req.session.userId).then(results => {
        console.log('personal results from getPersonal: ', results.rows);
        res.json(results.rows[0]);
    }).catch(err => console.log('error fetching personal data', err));
});

//-----set
app.post('/personal_set', (req, res) => {
    console.log('/personal set req.body :::', req.body);
    db.addPersonal(req.session.userId, req.body.first, req.body.last, req.body.email, req.body.phone, req.body.location, req.body.jobcategory).then(results => {
        console.log('personal results from addPersonal: ', results.rows[0]);
        res.json(results.rows[0]);
    }).catch(err => console.log('error inserting personal data', err));
});

//-----update
app.post('/personal_update', (req, res) => {
    console.log('/personal update req.body :::', req.body);
    db.updatePersonal(req.session.userId, req.body.first, req.body.last, req.body.email, req.body.phone, req.body.location, req.body.jobcategory).then(results => {
        console.log('personal results from updatePersonal: ', results.rows[0]);
        res.json(results.rows[0]);
    }).catch(err => console.log('error updating personal data', err));
});



//---------------------------------------------------------------
//-----------------EDUCATION
//---------------------------------------------------------------

app.post('/education', (req, res) => {
    console.log('/education req.body :::', req.body);
    db.addEducation(req.session.userId, req.body.school_name, req.body.school_location, req.body.degree, req.body.start_date, req.body.end_date).then(results => {
        console.log('personal results from addPersonal: ', results.rows[0]);
        res.json(results.rows[0]);
    }).catch(err => console.log('error inserting education data', err));
});


//---------------------------------------------------------------
//docx templater
//---------------------------------------------------------------

// The error object contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
function replaceErrors(key, value) {
    if (value instanceof Error) {
        return Object.getOwnPropertyNames(value).reduce(function (error, key) {
            error[key] = value[key];
            return error;
        }, {});
    }
    return value;
}

function errorHandler(error) {
    console.log(JSON.stringify({ error: error }, replaceErrors));

    if (error.properties && error.properties.errors instanceof Array) {
        const errorMessages = error.properties.errors.map(function (error) {
            return error.properties.explanation;
        }).join("\n");
        console.log('errorMessages', errorMessages);
        // errorMessages is a humanly readable message looking like this :
        // 'The tag beginning with "foobar" is unopened'
    }
    throw error;
}


app.post('/generate', (req, res) => {

    //Load the docx file as a binary
    var content = fs
        .readFileSync(path.resolve(__dirname + '/templates', 'template1.docx'), 'binary');

    var zip = new PizZip(content);
    var doc;
    try {
        doc = new Docxtemplater(zip);
    } catch (error) {
        // Catch compilation errors (errors caused by the compilation of the template : misplaced tags)
        errorHandler(error);
    }

    //set the templateVariables
    console.log("/generate req:", req.body);
    doc.setData(req.body);

    try {
        // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
        doc.render()
    }
    catch (error) {
        // Catch rendering errors (errors relating to the rendering of the template : angularParser throws an error)
        errorHandler(error);
    }

    var buf = doc.getZip()
        .generate({ type: 'nodebuffer' });

    // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
    fs.writeFileSync(path.resolve(__dirname + '/download', 'output2.docx'), buf);
    var file = path.resolve(__dirname + '/download', 'output2.docx');

    //console.log("file:", file);
    // File options
    /* const options = {
       headers: {
           'x-timestamp': Date.now(),
           'x-sent': true,
           'content-disposition': "attachment; filename=" + 'resume.docx', // gets ignored
           'content-type': "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
       }
   } */

    //res.download(file, 'resume.docx', options, function (err) {
    res.download(file, 'resume.docx', function (err) {
        if (err) {
            console.log("err:", err);
        } else {
            console.log("NO ERROR");
        }
    })
});

//---------------------------------------------------------------
//-----------------WELCOME
//---------------------------------------------------------------
app.get('/welcome', (req, res) => {
    console.log('/welcome userId::: ', req.session.userId);

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
    console.log('get(*) userId::: ', req.session.userId);

    if (!req.session.userId) {
        res.redirect('/welcome');
    } else {
        res.sendFile(__dirname + '/index.html');
    }
});


//---------------------------------------------------------------
//run server
//---------------------------------------------------------------

app.listen(8080, function () {
    console.log("I'm listening.");
});