/*jslint node: true */
'use strict';

var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var loginService = require('../server/services/login.service');

var dbCloudant = require('../server/services/cloudant.service');
var db = dbCloudant.getDB();

module.exports = function (passport) {

    passport.checkEmail = function (email) {
        db.find({selector: {username: email}}, function (err, result) {
            if (err) return (err);

            if (result.docs.length === 0) {
                console.log('no matching email found!');
                return ({loginError :'facebook login failed'});
                //return done(null, false, {loginError: 'Facebook login failed.'});
            }
            else {
                console.log('email found!');
                return result.docs[0];
                //return done(null, result.docs[0]);
            }
        });
    }


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
        //if(passport.checkEmail(profile.emails[0].value)) {
            console.log('Access token: ' + accessToken + 'Profile: ' + JSON.stringify(profile));
            var user = {
                'email': profile.emails[0].value,
                'name' : profile.name.givenName + ' ' + profile.name.familyName,
                'id'   : profile.id,
                'token': accessToken
            }
       // }
        
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
        var passwordEnc = loginService.generateHash(password); // encrypt password before saving to db
        var validEmail = loginService.validateEmail(email);    // make sure email is unique to database

        if (validEmail === true) {
            process.nextTick(function () {
                db.find({selector: {username: email}}, function (err, result) {
                    if (err) {
                        return done(null, err);
                    }

                    console.log(result.docs.length);
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
                                return done(null, result, req.flash('signupMessage', 'User ' + email + ' has been added to the DB.'));
                                  //return done(null, false, req.flash('signupMessage', 'User ' + email + ' has been added to the DB.'));
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