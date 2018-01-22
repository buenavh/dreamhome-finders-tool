/*jslint node: true */
'use strict';

var path = require("path");

// server/routes/login.route.js
module.exports = function (app, passport) {

    app.get('/', function (req, res) {
        res.sendFile("index.html", {root:path.join(__dirname, "../../public")});
    });

    app.get('/login', function (req, res) {
        res.sendFile("index.html", {root:path.join(__dirname, "../../public")});
    });

    app.get('/register', function (req, res) {
        res.sendFile("register.html", {root:path.join(__dirname, "../../public")});
    });

    app.get('/home', function (req, res) {
        res.sendFile("home.html", {root:path.join(__dirname, "../../public")});
    });

    app.get('/developer/add', function (req, res) {
        res.sendFile("developer.html", {root:path.join(__dirname, "../../public")});
    });

    /*
    app.get('/developer', function (req, res) {
        res.sendFile("developer.html", {root:path.join(__dirname, "../../public")});
    });
    */

    app.get('/profile', require('connect-ensure-login').ensureLoggedIn(), function (req, res) {
        res.render('profile', {user: req.user});
    });

    
    app.get('/auth/facebook', passport.authenticate('facebook', { 
        scope: ['public_profile', 'email']
    }));

     app.get('/auth/facebook/return', function (req, res, next) {
        passport.authenticate('facebook', function (err, user, info) {
            //BUG ALERT -->> appends #_=_ to url :(

            if (err) {
              return next(err); // will generate a 500 error
            }

            // Generate a JSON response reflecting signup
            if (!user) {
                return res.redirect("/login");
            }

            return res.redirect("/home");
        })(req, res, next);
     });
    

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/register', function (req, res, next) {
        passport.authenticate('local-signup', function (err, user, info) {
            if (err) {
              return next(err); // will generate a 500 error
            }

            // Generate a JSON response reflecting signup
            if (!user) {
              return res.send({ success : false, message : 'register failed' });
            }

            return res.send({ success : true, message : 'register succeeded' });
        })(req, res, next);
    });

    app.post('/login', function (req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
            if (err) {
              return next(err); // will generate a 500 error
            }

            // Generate a JSON response reflecting signup
            if (!user) {
              return res.send({ success : false, message : 'login failed'});
            }

            console.log(user);
            return res.redirect("/home");
            //return res.send({ success : true, message : 'login succeeded', role: user.docs[0].usergroup});
        })(req, res, next);
    });

    // app.post('/register', passport.authenticate('local-signup', {
    //     successRedirect: '/home',
    //     failureRedirect: '/register',   
    //     failureFlash: true
    // }));

    // app.post('/login', passport.authenticate('local-login', {
    //     successRedirect: '/register',
    //     failureRedirect: '/login',
    //     failureFlash: true
    // }));
    
    
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