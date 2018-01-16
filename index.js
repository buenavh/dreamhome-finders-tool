//index.js

//SETUP LOCAL EXPRESS SERVER

var express 		= require("express");
var router 			= express.Router();
var app 			= express();
var port 			= process.env.PORT || 3000;
var bodyParser		= require("body-parser");

//configure statis server directory
app.use(express.static(__dirname));

//configure body parser to allow us to use POST (i.e. req.body)
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

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

//FIRE UP THE SERVER
app.listen(port, function () {
	console.log("Initializing...");
	console.log("Server started at " + port);
});

