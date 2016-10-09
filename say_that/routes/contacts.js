var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Contact = mongoose.model('Contact');


/* GET users listing. */
router.get('/', function(req, res) {
	var sort = req.query.sort;
	var page = req.query.page;
	
	
	console.log("Starting of method contacts GET");
	
	if(page==undefined)
	{
	page=1;
	}
	
	if(sort=="desc")
	{
		console.log("Starting of method contacts GET - "+page);
		Contact.find({}).sort('-name').skip((page-1)*6).limit(6).exec(function(err, contacts){
		console.log("contacts fetched",err,contacts);
	
		Contact.count().exec(function(err,totalRecords){
			var totalPage = Math.ceil((totalRecords / 6));
			res.render('profiles',{contacts:contacts,totalPage:totalPage,currentPage:page});	
		});
	});
	}
	
	else
	{
	console.log("Starting of method contacts GET - "+page);
	Contact.find({}).sort('name').skip((page-1)*6).limit( 6).exec(function(err, contacts){
		console.log("contacts fetched",err,contacts);
			Contact.count().exec(function(err,totalRecords){
			var totalPage = Math.ceil((totalRecords / 6));
			res.render('profiles',{contacts:contacts,totalPage:totalPage,currentPage:page});	
		});
	});
	}
	console.log("Ending of method contacts GET");
});

router.get('/:id', function(req, res) {
	if(req.params.id == 0){
	res.render('contact-form',{contact:{}});
		
	} else {
		Contact.findById(req.params.id,function (err, contact){
			res.render('contact-form',{contact:contact});
		});
	}
});



router.get('/delete/:id', function(req, res) {
	// Perform delete.
	Contact.findByIdAndRemove(req.params.id).exec();
	res.redirect("..");
});

/* GET users listing. */
router.post('/', function(req, res) {
	var obj = {name: req.param('name'),
	contact_number: req.param('contact_number'),
	email: req.param('email'),
	image: "http://localhost:3000/img/profiles/"+req.param('name').substr(0,1).toUpperCase()+".jpg",
	address: req.param('address')};

	var contact = new Contact(obj);
	if(req.param('_id') == 0){
		contact.save();
		res.redirect('./contacts');
	} else {
		// Write update logic.
		var conditions = {_id:req.param('_id')};
		console.log("Udating contact.. ",conditions);
		Contact.update(conditions,obj,{ multi: false },function(err,rows){
			console.log("in update callback",err,rows);
			res.redirect('./contacts');
		});
	}
	
});

module.exports = router;
