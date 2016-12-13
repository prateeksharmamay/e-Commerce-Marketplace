/**
 * New node file
 */

var mq_client = require('../rpc/client');
var logger = require('./logger');

exports.checkActiveUserSession = function(req,res){
	var json_responses, sessionStatus, sessionEmail;
	
	if(req.session.email){
		sessionStatus = true;
		sessionEmail = req.session.email;
		
		var msg_payload = { "email": sessionEmail};
		
		console.log("In POST Request = User Email:"+ sessionEmail);
		
		mq_client.make_request('getProfileDetails_queue',msg_payload, function(err,results){
			
			console.log(results);
			if(err){
				throw err;
			}
			
			if(results.code == 404){
				console.log("No User Details in the DB");
				
				json_responses = {"statusMsg" : "No Items in the DB", "statusCode" : 404, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "itemsList": null, "userDetails": results.userDetails};
				res.send(json_responses);
			}
			else{
				console.log("User Details FETCHED");
				
				logger.clickEventsFileLogger.debug("Button: Cart Icon | "+"UserID:"+sessionEmail+" | Description:Users Cart Page Displayed");
				
				json_responses = {"statusMsg" : "User Details Fetched", "statusCode" : 200, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "itemsList": null, "userDetails": results.userDetails};
				res.send(json_responses);
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

exports.makePayment = function(req,res){
	var json_responses, sessionStatus, sessionEmail;
	
	if(req.session.email){
		sessionStatus = true;
		sessionEmail = req.session.email;
		
		var cartItems = req.param("cartItems");
		var userEmail = req.param("userEmail");
		var ccNo = req.param("ccNo");
		
		var msg_payload = { "email": sessionEmail, "cartItems": cartItems, "ccNo": ccNo};
		
		console.log("In POST Request = User Email:"+ sessionEmail);
		
		mq_client.make_request('makePayment_queue',msg_payload, function(err,results){
			
			console.log(results);
			if(err){
				throw err;
			}
			
			if(results.code == 404){
				json_responses = {"statusMsg" : "Transaction Unsuccessful", "statusCode" : 404, "sessionStatus": sessionStatus, 
						"sessionEmail": sessionEmail, "itemsNotAvailable": results.itemsNotAvailable };
				
				logger.clickEventsFileLogger.debug("Button: Checkout Cart | "+"UserID:"+sessionEmail+" | Description:Items Bought by Customer");
				
				res.send(json_responses);
			}
			else if(results.code == 420){
				json_responses = {"statusMsg" : "Invalid Card Number", "statusCode" : 420, "sessionStatus": sessionStatus, 
						"sessionEmail": sessionEmail, "itemsNotAvailable": null };
				
				res.send(json_responses);
			}
			
			else{
				json_responses = {"statusMsg" : "Transaction Successful", "statusCode" : 200, "sessionStatus": sessionStatus, 
						"sessionEmail": sessionEmail, "itemsNotAvailable": results.itemsNotAvailable };
				
				logger.clickEventsFileLogger.debug("Button: Checkout Cart | "+"UserID:"+sessionEmail+" | Description:Items Bought by Customer");
				
				res.send(json_responses);
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