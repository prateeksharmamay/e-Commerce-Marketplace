/**
 * New node file
 */

var logger = require('./logger');
var mq_client = require('../rpc/client');

exports.getAllItems = function(req,res){
	var json_responses, sessionStatus, sessionEmail;
	
	if(req.session.email){
		sessionStatus = true;
		sessionEmail = req.session.email;
		console.log("sessionEmail: "+sessionEmail);
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		
		// Run the Back-end Job for processing Bid
		
		var msg_payload1 = { "email": sessionEmail};
		
		console.log("In POST Request = User Email:"+ sessionEmail);
		
		mq_client.make_request('afterBidExpiry_queue',msg_payload1, function(err,results){
			
			console.log(results);
			if(err){
				throw err;
			}
			
			if(results.code == 404){
				console.log("Changes for expired Bid are NOT done successfully.");
				
				json_responses = {"statusMsg" : "Changes for expired Bid are NOT done successfully.", "statusCode" : 404, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "itemsList": null};
			}
			else{
				console.log("ITEMS with Login Time FETCHED");
				
				json_responses = {"statusMsg" : "Changes for expired Bid are done successfully.", "statusCode" : 200, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "itemsList": null};
			}
		});
		
		// To Fetch Items for User Dashboard
		
		var msg_payload = { "email": sessionEmail};
		
		console.log("In POST Request = User Email:"+ sessionEmail);
		
		mq_client.make_request('getAllItems_queue',msg_payload, function(err,results){
			
			console.log(results);
			if(err){
				throw err;
			}
			
			if(results.code == 404){
				console.log("No Items in the DB");
				
				logger.clickEventsFileLogger.debug("Button: Dashboard/Shopping | "+"UserID:"+sessionEmail+" | Description:No Items For User");

				json_responses = {"statusMsg" : "No Items in the DB", "statusCode" : 404, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "itemsList": results.items,"loginTimeData": results.lastLoginTime};
				res.send(json_responses);
			}
			else{
				console.log("ITEMS with Login Time FETCHED");
				
				logger.clickEventsFileLogger.debug("Button: Dashboard/Shopping | "+"UserID:"+sessionEmail+" | Description:Items Displayed");
				
				json_responses = {"statusMsg" : "Items Fetched", "statusCode" : 200, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "itemsList": results.items,"loginTimeData": results.lastLoginTime};
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


exports.addItemToUserCart = function(req,res){
	var json_responses, sessionStatus, sessionEmail, item_id, email;
	
	if(req.session.email){
		sessionStatus = true;
		sessionEmail = req.session.email;
		email = req.param("email");
		item_id = req.param("itemId");
		
		var msg_payload = { "email": sessionEmail, "itemId": item_id};
		
		console.log("In POST Request = User Email:"+ sessionEmail);
		
		mq_client.make_request('addItemToUserCart_queue',msg_payload, function(err,results){
			
			console.log(results);
			if(err){
				throw err;
			}
			
			if(results.code == 404){
				console.log("User Cart Data NOT Inserted");
				
				logger.clickEventsFileLogger.debug("Button: Add To Cart | "+"UserID:"+email+" | Description:Item NOT Added to user's cart.");

				json_responses = {"statusMsg" : "Item added to your Cart", "statusCode" : 404};
				res.send(json_responses);
			}
			else{
				console.log("User Cart Data Inserted");
				
				logger.clickEventsFileLogger.debug("Button: Add To Cart | "+"UserID:"+email+" | Description:Item Added to user's cart.");
				
				json_responses = {"statusMsg" : "Item added to your Cart", "statusCode" : 200};
				res.send(json_responses);
			}
		});
	}
	else{
		console.log("No Active Session.");
		json_responses = {"statusMsg" : "No Active Session", "statusCode" : 404};
		res.send(json_responses);
	}
};