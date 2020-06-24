const express = require('express');
const app = express();
const compression = require('compression');
const cookieSession = require('cookie-session');
const csurf = require('csurf');
const {
    addUser,
    getUserByEmail
} = require('./db');
const {
    hash,
    compare
} = require('./bc');

//---middleware---//

app.use(compression());

app.use(express.json());

app.use(express.static('public'));

app.use(cookieSession({
    secret: "it might be anything",
    maxAge: 1000 * 60 * 60 * 24 * 14
}));

//---csurf---//

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

app.post('/registration', (req, res) => {
    console.log('req.body:', req.body);
    let { first, last, email } = req.body;
    hash(req.body.password)
        .then((hashedPw) => {
            db.addUser(req.body.first, req.body.last, req.body.email, hashedPw)
                .then(results => {
                    console.log('Registered Adduser row results: ', results.rows);
                    req.session.userId = results.rows[0].id;
                    req.session.name = results.rows[0].first;
                    req.session.last = results.rows[0].last;
                    req.session.email = results.rows[0].email;
                    req.session.userData = {
                        first: results.rows[0].first,
                        last: results.rows[0].last,
                        email: results.rows[0].email,
                    };
                }).then(() => {
                    res.json({
                        success: true
                    });
                }).catch(err => {
                    console.log('error quering addUser in register post: ', err);
                    res.json({
                        success: true
                    });

                });
        });
});
app.post('/login', requireLoggedOutUser, requireNoSignature, (req, res) => {
    console.log('results row w login: ', results.rows);
    db.getUserByEmail(req.body.email).then(results => {
        console.log('results row w login: ', results.rows);

        if (!results.rows[0]) {
            res.render('login', {
                title: 'No email address in database',
                errormessage: `There is no user with email: ${req.body.email}`,
                register_link: "If You have no account You may <a href='registration'> register now </a>",
                layout: 'main',
                login_name: `(${req.session.name} ${req.session.surname})`
            });
        } else {

            compare(req.body.password, results.rows[0].password).then(compareMatchValue => {
                if (!compareMatchValue) {
                    res.render('login', {
                        title: 'Wrong password for given email',
                        errormessage: `Wrong password for email: ${req.body.email}`,
                        register_link: `If You have no account You may <a href='register'> register now </a>`,
                        layout: 'main'
                    });
                } else {

                    req.session.userData = {
                        name: results.rows[0].first,
                        surname: results.rows[0].last,
                        email: results.rows[0].email,
                    }
                } else {
                    res.redirect('/registration');
                }
            }
            });
}



   /* }).then(() => {
    res.json({
        success: true
    });
}).catch(err => {
    console.log('error quering addUser in register post: ', err);
    res.json({
        success: true
    });

});
});
});*/

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