/*jslint node: true */
'use strict';

var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var loginService = require('../server/services/login.service');

var dbCloudant = require('../server/services/cloudant.service');
var db = dbCloudant.getDB();

module.exports = function (passport) {

    passport.serializeUser(function (user, cb) {
        console.log("serializing");
        cb(null, user);
    });

    passport.deserializeUser(function (user, cb) {
        console.log("deserializing");
        cb(null, user);
    });

    // FACEBOOK LOGIN
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

    // REGISTER USER
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    }, function (req, email, password, done) {
        console.log('Request: ' + JSON.stringify(req.body));
        var ugroup = req.body.ugroup;
        var status = req.body.account_status;
        if (typeof password !== 'undefined') {
            var passwordEnc = loginService.generateHash(password); // encrypt password before saving to db
        } 
            
        var validEmail;
        if (ugroup === '1' || ugroup === '2') {
            validEmail = loginService.validateEmail(email);    // check if UGROUP 1 and UGROUP 2 email pattern is valid 
        } else {
            validEmail = true;
        }        

        if (validEmail === true) {
            console.log('email: ' + email);
            process.nextTick(function () {
                db.find({selector: {username: email}}, function (err, result) {
                    if (err) {
                        return done(null, err);
                    }

                    console.log('Returnded data: ' + result.docs.length);
                    if (result.docs.length === 0) {
                        db.insert({
                            username        : email,
                            password        : passwordEnc,
                            usergroup       : ugroup,
                            accountStatus   : status
                        }, function (err, doc) {
                            if (err) {
                                console.log(err);
                                return done(null, err);
                            } else {
                                console.log(result);
                                return done(null, result, req.flash('signupMessage', 'User ' + email + ' has been added to the DB.'));
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
                    return done(null, result.docs[0]);
                    //return done(null, result);
                } else {
                    console.log('Incorrect password entered');
                    //return done(null, false, req.flash('loginError', 'Incorrect password entered.'));
                    return done(null, false, { loginError: 'Incorrect password entered.'});
                }
            }

        });

    }));
};