/**
 * New node file
 */

var mq_client = require('../rpc/client');
var logger = require('./logger');

exports.getBiddableItemsforUser = function(req,res){
	var json_responses, sessionStatus, sessionEmail;
	
	if(req.session.email){
		sessionStatus = true;
		sessionEmail = req.session.email;
		
		var msg_payload = { "email": sessionEmail};
		
		console.log("In POST Request = User Email:"+ sessionEmail);
		
		mq_client.make_request('getBiddableItemsforUser_queue',msg_payload, function(err,results){
			
			console.log(results);
			if(err){
				throw err;
			}
			
			if(results.code == 404){
				console.log("NO Biddable ITEMS FETCHED");
				
				logger.clickEventsFileLogger.debug("Button: Bid/Auction | "+"UserID:"+sessionEmail+" | Description:Items available for bidding Displayed");
				
				json_responses = {"statusMsg" : "NO Biddable Items Fetched", "statusCode" : 200, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "itemsList": results.items};
				res.send(json_responses);
			}
			else{
				console.log("Biddable ITEMS FETCHED");
				
				logger.clickEventsFileLogger.debug("Button: Bid/Auction | "+"UserID:"+sessionEmail+" | Description:Items available for bidding Displayed");
				
				json_responses = {"statusMsg" : "Biddable Items Fetched", "statusCode" : 200, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "itemsList": results.items};
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

exports.addBidToItem = function(req,res){
var json_responses, sessionStatus, sessionEmail;
	
	if(req.session.email){
		sessionStatus = true;
		sessionEmail = req.session.email;
		
		var itemId = req.param("itemId");
		var bidAmount = req.param("bidAmount");

		var msg_payload = { "email": sessionEmail, "_id": itemId, "bidAmount": bidAmount};
		
		console.log("In POST Request = User Email:"+ sessionEmail);
		
		logger.clickEventsFileLogger.debug("Button: Place Bid | "+"UserID:"+sessionEmail+" | ItemID:"+itemId+" | Bid Amount:"+bidAmount+" | Description:Bid Placed");
		logger.biddingFileLogger.debug("UserID:"+sessionEmail+" | ItemID:"+itemId+" | Bid Amount:"+bidAmount);
		
		mq_client.make_request('addBidToItem_queue',msg_payload, function(err,results){
			
			console.log(results);
			if(err){
				throw err;
			}
			
			if(results.code == 404){
				console.log("ITEM Bid Details NOT Updated");

				json_responses = {"statusMsg" : "ITEM Bid Details Updated", "statusCode" : 200, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "results": results};
				res.send(json_responses);
			}
			else{
				console.log("ITEM Bid Details Updated");

				json_responses = {"statusMsg" : "ITEM Bid Details Updated", "statusCode" : 200, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "results": results};
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