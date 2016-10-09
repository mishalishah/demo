/*
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var ContactUsSchema = new mongoose.Schema({
	name: String,
	contact_number: String,
	email: String,
	address: String
});
var ContactUs = mongoose.model('ContactUs', ContactUsSchema);


/* GET users listing. */
/*router.get('/', function(req, res) {
	console.log("Starting of method contacts GET");
	ContactUs.find(function(err,contacts){
		console.log("contacts fetched",err,contactUs);
		res.render('contactus',{"contactUs":contactUs});
	});
	console.log("Ending of method contacts GET");
});

router.post('/', function(req, res) {
	var obj = {name: req.param('name'),
	contact_number: req.param('contact_number'),
	email: req.param('email'),
	address: req.param('address')};

	var contactus = new Contact(obj);
	
		contactus.save();
		

});
*/