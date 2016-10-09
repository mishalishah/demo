var express = require('express');
var shell = require("shelljs");
var fs = require('fs');
var router = express.Router();
var mongoose = require('mongoose');


/*
1. "2 + 4 + 1" | if has any one of (+,-,*,/) 
2. route to "pvr" | if starts with "rout to"
3. shutdown my pc | has shutdown
4. open "facebook" (web URL) | if has any one of (facebook,gmail,youtube)
5. open "skype" (System application) | if has any one of (skype,notepad,...)
6. search "something" | starts with "search"
7. play "movie or song name" | starts with "play" has any one of (*.mp3)

*/


/*var FrequentSchema = new mongoose.Schema({
	command: String,
	lastsearchDate: Date,
	image: String
});
*/

var config =  JSON.parse(fs.readFileSync(__dirname+'/conf.json', 'utf8'));
var medias = shell.ls(__dirname+'/media');
var Frequent = mongoose.model('Frequent');
var Contact = mongoose.model('Contact');


var apps=["skype" , "notepad", "winword", "powerpoint" , "VISIO" , "EXCEL" , "notepad++" , "firefox"];
var play=["Table.mkv", "Jaane Bhi Do Yaaro.mp4" , "Madras Cafe.mkv"];

/* GET http://localhost:3000/voice?command=hello */
router.get('/', function(req, res) {
	var command = req.query.command;
	var output = "Operation failed.";
	var image = "error.jpg";
	console.log(""+command);
	command=command.replace("plus","+");
	command=command.replace("minus","-");
	command=command.replace("multiplied by","*");
	command=command.replace("into","*");
	command=command.replace("divided by","/");
	
	command=command.replace("zero","0");
	command=command.replace("one","1");
	command=command.replace("two","2");
	command=command.replace("three","3");
	command=command.replace("four","4");
	command=command.replace("five","5");
	command=command.replace("six","6");
	command=command.replace("seven","7");
	command=command.replace("eight","8");
	command=command.replace("nine","9");
	
	if(command.indexOf("+") > -1 || command.indexOf("-") > -1 || command.indexOf("*") > -1  || command.indexOf("/") > -1 ) {
		console.log(""+command);
		
		output = eval(command);
		
		console.log(""+output);
		image= "calc.jpg";
		
		
	}

	else if(command.indexOf("route to") > -1){
	
		output = command.substr(9);
		shell.exec('"chrome" "file:///C:/wamp/www/st_main/main_project/commands/route.html?q='+output+'"',{async:true,silent:true});
		image= "location.jpg";
	}
	
	
	else if(command.indexOf("shutdown") > -1){
		shell.exec("shutdown -s",{async:true,silent:true});
		output = "Shutdown done.";
		image= "shutdown.jpg";
	}
	
		
	else if(command.indexOf("open") > -1) {
			var token= command.substr(5);
			console.log(token);
		

		for(var i=0;i<config.length;i++)
			{

			if(config[i].href.toLowerCase().indexOf(token.toLowerCase()) > -1 || config[i].aka.indexOf(token.toLowerCase()) > -1){
			
				shell.exec('"chrome" "file:///C:/wamp/www/st_main/main_project/commands/open.html?q='+config[i].href+'"',{async:true,silent:true});
				
				
				
				console.log("shell execute");
				output = config[i].href;
				image= token +".jpg";
				break;
				}
			}
		
		for(var i=0;i<medias.length;i++){
			if(medias[i].toLowerCase().indexOf(token.toLowerCase()) > -1){
				shell.exec('"'+__dirname+'/media/'+medias[i]+'"',{async:true,silent:true});
				output = '"'+__dirname+'/media/'+medias[i]+'"';
				image= token +".jpg";
				break;
			}
		}
		
		
		for(i=0; i<apps.length; i++){
		//console.log("inside for loop");
		if((apps[i].toUpperCase()).indexOf(token.toUpperCase()) > -1){
			shell.exec('"'+apps[i]+'"' ,{async:true,silent:true});
				
			//console.log("inside if block",apps[i]);
			output=apps[i];
			image= token +".jpg";
			break;	
				
			}
		}	
}

	/*else if(command.indexOf("open") > -1) {
		var token= command.substr(5);
		for(var i=0; i<=apps.length; i++){
		
		if(apps[i].indexOf(token) > -1){
			output= apps[i];
			break;
			}
		}
	}*/
	
	else if(command.indexOf("search") > -1) {
		var token= command.substr(7);
		shell.exec('"chrome" "file:///C:/wamp/www/st_main/main_project/commands/search.html?q='+token+'"',{async:true,silent:true});
		output = token;
		image= "search.jpg";
	}
	
	else if(command.indexOf("play") > -1) {
		var token= command.substr(5);
		
		for(var i=0; i<play.length; i++){
			//console.log("inside for loop in play section"+token);
		if((play[i].toUpperCase()).indexOf(token.toUpperCase()) > -1){
			//console.log("inside if block in play"+token);
			console.log(play[i]);
			shell.exec('"'+play[i]+'"',{async:true,silent:true});
			output= play[i];
			image= "music.jpg";
			break;
			}
		}
	}
	
else if(command.indexOf("call") > -1){
		var token = command.substring(5);
		Contact.findOne({name: new RegExp(token+'+', "i")}, function(err, contact) {
			if(contact && contact.contact_number){
				console.log(contact);
				shell.exec("skype.exe /callto:"+contact.contact_number,{async:true,silent:true});
				output = "Calling "+contact.name+" on "+contact.contact_number;
			} else {
				output = "No contact to call";
			}
			res.send(""+output);
		});
		return;
	}

else if(command.indexOf("mail") > -1){
		var token = command.substring(5); //name with subject for body
		
		if(token.indexOf("with") > -1){
				
				var name=token.substring(0,token.indexOf("with")-1);
				console.log(""+name);
				
				var subject=token.substring(token.indexOf("with")+5,token.indexOf("for")-1);
				console.log(""+subject);
				
				var body=token.substring(token.indexOf("for")+4);
				console.log(""+body);
				
				token=name;
				}
				
		Contact.findOne({name: new RegExp(token+'+', "i")}, function(err, contact) {
			if(contact && contact.email){
				console.log(contact);
				shell.exec('"chrome" "file:///C:/wamp/www/st_main/main_project/commands/open.html?q=mailto:'+contact.email+'?subject='+subject+'&body='+body+'"' ,{async:true,silent:true});
				output = "Sending email to "+contact.name+" on "+contact.email;
			} else {
				output = "No contact to mail";
			}
			res.send(""+output);
		});
		return;
	}	
	
	var obj = {command: command,
	lastsearchDate: new Date(),
	image: "http://localhost:3000/img/frequent/"+image
	
	};

	var frequent = new Frequent(obj);
	frequent.save();
	

	res.send(""+output);
	
} );

module.exports = router;
