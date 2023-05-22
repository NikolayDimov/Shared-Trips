const router = require('express').Router();

const { isUser, isGuest } = require('../middleware/guards');
const { register, login } = require('../services/userService');
const mapErrors = require('../util/mapError');



router.get('/register', isGuest(), (req, res) => {
    // TODO replace with actual view by assignment
    res.render('register',
        // {title: 'Register page'}
    );
});

router.post('/register', isGuest(), async (req, res) => {
    try {
        // if (req.body.username == '' || req.body.password == '') {
        //     throw new Error('All fields are required');
        // }

        // if (req.body.password.trim() == '') {
        if (req.body.password.trim().length < 4) {
            throw new Error('Password must be at least 4 characters long');
        }

        if (req.body.password != req.body.repass) {
            throw new Error('Passwords don\'t match');
        }


        const user = await register(req.body.email, req.body.password, req.body.gender);
        req.session.user = user;
        res.redirect('/');

        // TODO check assignment to see if register creates session
        // res.cookie('token', token);
        // res.redirect('/');     // TODO replace with redirect by assignment

    } catch (err) {
        const errors = mapErrors(err);

        // Radio-buttons Male/Female
        const isMale = req.body.gender == 'male';

        // TODO add error display to actual template from assignment
        res.render('register', {
            // title: 'Register Page',
            data: { email: req.body.email, isMale },
            errors
        });
    }
});


router.get('/login', isGuest(), (req, res) => {
    // TODO replace with actual view by assignment
    res.render('login',
        // {title: 'Login Page'}
    );
});

router.post('/login', isGuest(), async (req, res) => {
    try {
        const user = await login(req.body.email, req.body.password);
        req.session.user = user;
        res.redirect('/');

        // res.cookie('token', token);
        // res.redirect('/');  // TODO replace with redirect by assignment

    } catch (err) {
        console.error(err);
        const errors = mapErrors(err);
        res.render('login', {
            // title: 'Login Page',
            data: { email: req.body.email },
            errors,
        });
    }
});


router.get('/logout', isUser(), (req, res) => {
    delete req.session.user;
    res.redirect('/');
})


module.exports = router;