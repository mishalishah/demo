var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* GET home page. */


var Frequent=mongoose.model('Frequent');
router.get('/', function(req, res) {
	console.log("Starting of method contacts GET");
	
		Frequent.find({}).limit( 6).sort('-lastsearchDate').exec(function(err, frequent) {
		console.log("Frequent fetched",err,frequent);
		res.render('index',{"frequent":frequent});
	});
	console.log("Ending of method contacts GET");
});


module.exports = router;
