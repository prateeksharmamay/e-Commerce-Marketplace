/**
 * Routes file for Login
 */
var logger = require('./logger');
var mq_client = require('../rpc/client');

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

		var msg_payload = { "userDetails": userDetails};
		
		console.log("In POST Request = userDetails:"+ userDetails);
		
		mq_client.make_request('signup_queue',msg_payload, function(err,results){
			
			console.log(results);
			if(err){
				throw err;
			}
			
			if(results.code == 404){
				console.log("User Exists");
				
				logger.clickEventsFileLogger.debug("Button: Sign Up | "+"UserID:"+email+" | Description:Failed SignUp");

				json_responses = {"statusMsg" : "User Exists", "statusCode" : 404, "email": email};
				res.send(json_responses);
			}
			else{
				console.log("User Login Time Inserted");
				
				logger.clickEventsFileLogger.debug("Button: Sign Up | "+"UserID:"+email+" | Description:Successful SignUp");
				
				json_responses = {"statusMsg" : "Congrats! Please sign in to continue", "statusCode" : 200, "email": email};
				res.send(json_responses);
			}
		});
	}
};