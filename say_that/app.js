var express=require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/contact-book-db');

var FrequentSchema = new mongoose.Schema({
	command: String,
	lastsearchDate: Date,
	image: String
});
var Frequent = mongoose.model('Frequent', FrequentSchema);

var ContactSchema = new mongoose.Schema({
	name: String,
	contact_number: String,
	email: String,
	birthDate: Date,
	image: String,
	address: String
});

var Contact = mongoose.model('Contact', ContactSchema);


var app=express();
var contacts = require('./routes/contacts');
var index = require('./routes/index');
var voice = require('./routes/voice');
//var contactus = require('./routes/contactus');


require('./routes/main')(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


app.use(express.static(__dirname + '/public'));
app.use('/',index);
app.use('/contacts',contacts);
//app.use('/contactus',contactus);
app.use('/voice', voice);




module.exports = app;