/**
 * New node file
 */
var mq_client = require('../rpc/client');
var logger = require('./logger');

exports.getProfileDetails = function(req,res){
	var json_responses, sessionStatus, sessionEmail;
	
	if(req.session.email){
		sessionStatus = true;
		sessionEmail = req.session.email;
		
		var msg_payload = { "email": sessionEmail};
		
		console.log("In POST Request = User Email:"+ sessionEmail);
		
		mq_client.make_request('getProfileDetails_queue',msg_payload, function(err,results){
			console.log('err '+err);			
			console.log('results '+results);
			if(err){
				console.log("RabbitMQ Connection Error "+err);
				
				json_responses = {"statusMsg" : "RabbitMQ Connection Error", "statusCode" : 405, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "userDetails": null};
				res.send(json_responses);
			}
			
			else{
				if(results.code == 404){
					console.log("No User Details in the DB");
					
					json_responses = {"statusMsg" : "No Items in the DB", "statusCode" : 404, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "userDetails": results.userDetails};
					res.send(json_responses);
				}
				else{
					console.log("User Details FETCHED");
					
					logger.clickEventsFileLogger.debug("Button: Profile | "+"UserID:"+sessionEmail+" | Description:Users Profile Page Displayed");
					
					json_responses = {"statusMsg" : "User Details Fetched", "statusCode" : 200, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "userDetails": results.userDetails};
					res.send(json_responses);
				}
			}
		});
	}
	
	else{
		console.log("No Active Session.");
		sessionStatus = false;
		sessionEmail = null;
		json_responses = {"statusMsg" : "No Active Session", "statusCode" : 404, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "itemsList": null};
		res.send(json_responses);
	}
};

exports.setProfileDetails = function(req,res){
	var json_responses, sessionStatus, sessionEmail;
	
	if(req.session.email){
		sessionStatus = true;
		sessionEmail = req.session.email;
		var userDetails = req.param("userDetails");
		
		var msg_payload = { "email": sessionEmail, "userDetails": userDetails};
		
		console.log("In POST Request = User Email:"+ sessionEmail);
		
		mq_client.make_request('setProfileDetails_queue',msg_payload, function(err,results){
			
			console.log('err '+err);			
			console.log('results '+results);
			if(err){
				console.log("RabbitMQ Connection Error "+err);
				
				json_responses = {"statusMsg" : "RabbitMQ Connection Error", "statusCode" : 405, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "userDetails": null};
				res.send(json_responses);
			}
			else{
				if(results.code == 404){
					console.log("No change in User Details in DB");
					
					json_responses = {"statusMsg" : "No change in User Details in DB", "statusCode" : 404, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "userDetails": null};
					res.send(json_responses);
				}
				else{
					console.log("User Details Updated");
					
					logger.clickEventsFileLogger.debug("Button: Update Profile | "+"UserID:"+sessionEmail+" | Description:Users Profile Updated");
					
					json_responses = {"statusMsg" : "User Details Updated", "statusCode" : 200, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "userDetails": null};
					res.send(json_responses);
				}
			}
		});
	}
	
	else{
		console.log("No Active Session.");
		sessionStatus = false;
		sessionEmail = null;
		json_responses = {"statusMsg" : "No Active Session", "statusCode" : 404, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "itemsList": null};
		res.send(json_responses);
	}
};