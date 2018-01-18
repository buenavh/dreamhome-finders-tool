/*jslint node: true */
'use strict';

// server/routes/login.route.js
module.exports = function (app, passport) {

    app.get('/', function (req, res) {
        res.render('index');        
    });

    /*
    app.get('/login', function (req, res) {
        res.render('login');
    });
    */

    app.get('/signup', function (req, res) {
        res.render('signup', {message: req.flash('signupMessage')});
    });

    app.get('/profile', require('connect-ensure-login').ensureLoggedIn(), function (req, res) {
        res.render('profile', {user: req.user});
    });

    
    app.get('/auth/facebook', passport.authenticate('facebook', { 
        scope: ['public_profile', 'email']
    }));

    app.get('/auth/facebook/return', passport.authenticate('facebook', { 
        failureRedirect: '/login' }), function (req, res) { 
        res.redirect('/');
    });
    

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/developer',
        failureRedirect: '/signup',   
        failureFlash: true
    }));

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/developer',
        failureRedirect: '/login',
        failureFlash: true
    }));
    
    
    /*
    // AngularJS: Facebook authorization routes (Not working)
    app.get('/auth/facebook', function authenticateFacebook (req, res, next) {
        req.session.returnTo = '/#' + req.query.returnTo; 
        next ();
     },
    passport.authenticate ('facebook'));
    
    app.get('/auth/facebook/callback', function (req, res, next) {
        var authenticator = passport.authenticate ('facebook', {
            successRedirect: req.session.returnTo,
            failureRedirect: '/'
        });
    
        delete req.session.returnTo;
        authenticator (req, res, next);
    })
    */
    
}