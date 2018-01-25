// declare variables

var express 		= require("express");
var router 			= express.Router();
var app 			= express();
var bodyParser		= require("body-parser");
var cfenv           = require('cfenv');
var path 			= require('path');
var dotenv 			= require('dotenv').config();
var passport        = require('passport');
var session 		= require('express-session');
var flash           = require('connect-flash');
var morgan 			= require('morgan');
var cookieParser 	= require('cookie-parser');
var dbCloudant      = require('./server/services/cloudant.service');

app.use(morgan('dev'));                             // log request to the console
app.use(cookieParser());                            // read cookies (for auth)
app.use(bodyParser.urlencoded({extended: true}));   // configure body parser to allow us to use POST (i.e. req.body)
app.use(bodyParser.json());


//configure static server directory
app.use(express.static(__dirname));

//configure port to use for local deployment
app.set('port', process.env.PORT || 6006);

//configure passport feature
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//include backend controllers
require('./controller/passport.controller')(passport);

//setup routes
require('./server/routes/passport.route')(app, passport);  
require('./server/routes/developer.route')(app);

// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

//set up the Cloud Foundry environment
var appEnv = cfenv.getAppEnv();

if (app.get('env') === 'development') {
    app.listen(app.get('port'),function() {
        console.log('server listening on port %d in %s mode', app.get('port'), app.get('env'));
    });

} else {    
    // start server on the specified port and binding host
    app.listen(appEnv.port, '0.0.0.0', function() {
        // print a message when the server starts listening
        console.log("server starting on " + appEnv.url);
    });
}