//index.js

//SETUP LOCAL EXPRESS SERVER

var express 		= require("express");
var router 			= express.Router();
var app 			= express();
//var port 			= process.env.PORT || 3000;
var bodyParser		= require("body-parser");
var cfenv           = require('cfenv');
var path 			= require('path');
var dotenv 			= require('dotenv').config();

//configure statis server directory
app.use(express.static(__dirname));

//configure body parser to allow us to use POST (i.e. req.body)
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

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

//SETUP THE ROUTES TO USE
router.use(function(req, res, next) {
	console.log("Processing");
	next();
});


// fire up the index page for every request so angular app is triggered
router.route("*")
	.get(function(req, res) {
		res.sendFile('./index.html', {root:__dirname});
	});

app.use(router);

/*
//FIRE UP THE SERVER
app.listen(port, function () {
	console.log("Initializing...");
	console.log("Server started at " + port);
});
*/

var dbCloudant = require('./server/service/cloudant.service');
var db = dbCloudant.initDBConnection();

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

