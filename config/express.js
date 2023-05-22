const express = require('express');
const handlebars = require('express-handlebars');
const session = require('express-session');
// const cookieParser = require('cookie-parser');
// const session = require('../middlewares/session');
const trimBody = require('../middleware/trimBody');
const userSession = require('../middleware/userSession');



module.exports = (app) => {
    const hbs = handlebars.create({
        extname: '.hbs'
    });

    app.engine('.hbs', hbs.engine);
    app.set('view engine', '.hbs');

    app.use('/static', express.static('static'));
    // app.use(cookieParser());
    app.use(session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: 'auto' }
    }));
    app.use(express.urlencoded({ extended: true }));
    
    // if you don't want to trim password
    app.use(trimBody('password'));
    app.use(userSession());

};