/*jslint node: true */
'use strict';

var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var loginService = require('../service/login.service');

var dbCloudant = require('../service/cloudant.service');
var db = dbCloudant.getDB();

module.exports = function (passport) {
    passport.serializeUser(function (user, cb) {
        cb(null, user);
    });

    passport.deserializeUser(function (obj, cb) {
        cb(null, obj);
    });

    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOOK_CALLBACK,
        enableProof: true,
        profileFields: ['id', 'emails', 'name'] 
    }, function (accessToken, refreshToken, profile, cb) {
        console.log('Access token: ' + accessToken + 'Profile: ' + JSON.stringify(profile));
        var user = {
            'email': profile.emails[0].value,
            'name' : profile.name.givenName + ' ' + profile.name.familyName,
            'id'   : profile.id,
            'token': accessToken
        }
        
        return cb(null, user);
    }));

    // Add users
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    }, function (req, email, password, done) {
        console.log('Request: ' + JSON.stringify(req.body));
        var ugroup = req.body.usergroup;
        var status = "active";
        var passwordEnc = loginService.generateHash(password);
        var validEmail = loginService.validateEmail(email);

        if (validEmail === true) {
            process.nextTick(function () {     
                db.find({selector: {username: email}}, function (err, result) {
                    if (err) {
                        return done(null, err);
                    }

                    console.log(result.docs.length);
                    if (result.docs.length === 0) {
                        db.insert({
                            username: email,
                            password: passwordEnc,
                            usergroup: ugroup,
                            accountStatus: status
                        }, function (err, doc) {
                            if (err) {
                                console.log(err);
                                return done(null, err);
                            } else {
                                return done(null, false, req.flash('signupMessage', 'User ' + email + ' has been added to the DB.'));
                            }
             
                        });
                    } else {                    
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    }
                });       
            });
        } else {
            return done(null, false, req.flash('signupMessage', 'Please enter a valid dhfi.com email.'));
        }

    }));

    // LOGIN
    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true       
    }, function (req, email, password, done) {  // callback with email and password from form
        console.log('Request: ' + JSON.stringify(req.body));
        db.find({selector: {username: email}}, function (err, result) {
            if (err) {
                return done(null, err);
            }

            var hash;
            if (result.docs.length === 0) {
                return done(null, false, req.flash('loginError', 'No user found.'));
            } else {
                result.docs.forEach(function (Record) {
                    hash = Record.password;
                });
                
                var passwordState = loginService.validatePassword(password, hash);
                if (passwordState == true) {
                    console.log('Authenticated user');
                    return done(null, result);
                } else {
                    console.log('Incorrect password entered');
                    //return done(null, false, req.flash('loginError', 'Incorrect password entered.'));
                    return done(null, false, { loginError: 'Incorrect password entered.'});
                }
            }

        });

    }));
};

