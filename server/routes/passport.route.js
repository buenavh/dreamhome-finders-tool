/*jslint node: true */
'use strict';

var path = require("path");
var dbCloudant = require('../services/cloudant.service');
var db = dbCloudant.getDevInfo();

// server/routes/login.route.js
module.exports = function (app, passport) {

    // for debugging
    app.get('*', function(req, res, next) {
        console.log(req.session.passport);
        next();
    });

    app.get('/user-access', function (req, res) {
        return res.status(200).json(req.session.passport);
    });

    app.get('/', function (req, res) {
       
       // check if there is any user currently logged in. If yes then redirect to home
        //else, show login page (No restriction required)

       if(typeof(req.session.passport) === 'undefined' || !(req.session.passport.hasOwnProperty('user'))) {
            res.redirect("/login");    
        }
        else {
            res.redirect("/home");
        }

    });

    app.get('/login', function (req, res) {

        // check if there is any user currently logged in. If yes then redirect to home
        //else, show login page (No restriction required)

        if(typeof(req.session.passport) === 'undefined' || !(req.session.passport.hasOwnProperty('user'))) {
            res.sendFile("index.html", {root:path.join(__dirname, "../../public")});    
        }
        else {
            res.redirect("/home");
        }
        
    });

    app.get('/register', function (req, res) {

        //if not logged in, redirect to login
        //else if logged in check ugroup allows
        //else, prompt with not allowed?

        if(typeof(req.session.passport) === 'undefined' || !(req.session.passport.hasOwnProperty('user'))) {
            res.redirect("/login");
        }
        else if (req.session.passport.user.usergroup === '1') {
            res.sendFile("register.html", {root:path.join(__dirname, "../../public")});
        }
        else {
            console.log("insufficient access rights");
            res.redirect("/home");
        } 
        
    });

    app.get('/home', function (req, res) {
        //if not logged in, redirect to login
        if(typeof(req.session.passport) === 'undefined' || !(req.session.passport.hasOwnProperty('user'))) {
            res.redirect("/login");
        }
        else {
            res.sendFile("home.html", {root:path.join(__dirname, "../../public")});            
        }

    });

    app.get('/developer/add', function (req, res) {
        
        //if not logged in, redirect to login
        //else if logged in check ugroup allows
        //else, prompt with not allowed?


        if(typeof(req.session.passport) === 'undefined' || !(req.session.passport.hasOwnProperty('user'))) {
            res.redirect("/login");
        }

        else if (req.session.passport.user.usergroup === '1' || req.session.passport.user.usergroup === '2') {
            res.sendFile("developer.html", {root:path.join(__dirname, "../../public")});
        }

        else {
            console.log("insufficient access rights");
            res.redirect("/home");
        }
        
    });

    app.get('/developer/update', function (req, res) {

        //if not logged in, redirect to login
        //else if logged in check ugroup allows
        //else, prompt with not allowed?

        if(typeof(req.session.passport) === 'undefined' || !(req.session.passport.hasOwnProperty('user'))) {
            res.redirect("/login");
        }

        else if (req.session.passport.user.usergroup === '1' || req.session.passport.user.usergroup === '2') {
            //save query data on session
            res.sendFile("update.html", {root:path.join(__dirname, "../../public")});
        }

        else {
            console.log("insufficient access rights");
            res.redirect("/home");
        }

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

            db.find({selector: {username: user.email}}, function (error, result) {
                if (error) return next(error);

                if(result.docs.length === 0) {
                    console.log("email not registered with this database");
                    return res.redirect("/login");
                }
                else {
                    //construct user obj to use with passport's login feature. Might need to query db for ugroup and 
                    var fbUser = {
                        username        : result.docs[0].username,
                        usergroup       : result.docs[0].usergroup,
                        accountStatus   : result.docs[0].accountStatus,
                        token           : user.token
                    }

                    // call req.login() explicitly to latch user credentials to passport's session.
                    req.logIn(fbUser, function(err) {
                        if (err) return next(err);
                        return res.redirect("/home");
                    });
                }
            });
        })(req, res, next);
     });
    

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/login');
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

            //since this is a custom routing, explicitly req.login to attach passport instance to req object
            req.logIn(user, function(err) {
              if (err) { return next(err); }
                return res.send({ success : true, message : 'login succeeded'});
            })
        })(req, res, next);
    });  
}