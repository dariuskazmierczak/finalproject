const express = require('express');
const app = express();
const compression = require('compression');
const cookieSession = require('cookie-session');
const csurf = require('csurf');
const db = require('./db');
const {
    hash,
    compare
} = require('./bc');


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

app.post('/register', (req, res) => {
    console.log('req.body:', req.body);
    res.json({
        success: true
    });
});

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