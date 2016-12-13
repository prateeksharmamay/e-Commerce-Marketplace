/**
 * Routes file for Login
 */
var logger = require('./logger');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";
var bcrypt = require('bcrypt-nodejs');

exports.signup = function(req,res)
{
	console.log("Sign up");
	var email, password, fname, lname, phoneNo;
	var json_responses;
	
	var userDetails = {};
	userDetails.email = req.param("email");
	userDetails.password = req.param("password");
	userDetails.fname = req.param("fname");
	userDetails.lname = req.param("lname");

	console.log(req.param("email"));
	
	if(userDetails.email === '' || userDetails.password === '' || userDetails.email === undefined || userDetails.password === undefined){
		logger.clickEventsFileLogger.debug("Button: Sign Up | "+"UserID:"+email+" | Description:Failed SignUp");
		json_responses = {"statusMsg" : "Email or Password is empty", "statusCode" : 404, "email": null};
		res.send(json_responses);
	}
	
	else{
		console.log("email:"+userDetails.email);
		console.log("password:"+userDetails.password);

		console.log("In registerUser:"+ userDetails.email);
		
		mongo.connect(mongoURL, function(){
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = mongo.connectToCollection('users');

			coll.findOne({email: userDetails.email}, function(err, user){
				console.log("Checking if same user exists.");
				if(err){
					throw err;
				}
				
				if (user) {
					// This way subsequent requests will know the user is logged in.
					console.log("User Exists");
					
					logger.clickEventsFileLogger.debug("Button: Sign Up | "+"UserID:"+email+" | Description:Failed SignUp");

					json_responses = {"statusMsg" : "User Exists", "statusCode" : 404, "email": email};
					res.send(json_responses);

				} else {
					coll.insertOne(
						{
							"fname" : userDetails.fname,
							"lname" : userDetails.lname,
							"email" : userDetails.email,
							"password" : bcrypt.hashSync(userDetails.password),
							"lastLoginTime" : new Date().toTimeString().split(" ")[0],
							"dob" : "",
							"ebayHandle" : "",
							"contact" : "",
							"location" : ""
						},
						function(err, user){
							if(err){
								throw err;
							}
							console.log("User Login Time Inserted");
							
							logger.clickEventsFileLogger.debug("Button: Sign Up | "+"UserID:"+email+" | Description:Successful SignUp");
							
							json_responses = {"statusMsg" : "Congrats! Please sign in to continue", "statusCode" : 200, "email": email};
							res.send(json_responses);
						}
					);
				}
			});
		});
	}
};
