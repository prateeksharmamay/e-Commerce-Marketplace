/**
 * Routes file for Login
 */
var mq_client = require('../rpc/client');
var logger = require('./logger');

exports.checkActiveUserSessionSellItem = function(req,res){
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
				
				logger.clickEventsFileLogger.debug("Button: Sell Item | "+"UserID:"+sessionEmail+" | Description:Sell Item Page Displayed");
				
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


exports.addItem = function(req,res)
{

	var email, password, item;
	var json_responses;
	var sessionEmail = req.session.email;

	email = req.param("email");
	item = req.param("item");

	console.log("email:"+email);
	console.log("item:"+item);
	var itemDetails = {};
	if(item.bidFlag == 0){
		itemDetails = {
				"sellerEmail" : sessionEmail,
				"sellerName" : item.sellerName,
				"itemName" : item.itemName,
				"itemDescription" : item.itemDescription,
				"itemPrice" : item.itemPrice,
				"qty" : item.qty,
				"qtyLeft" : item.qtyLeft,
				"shippingFrom" : item.shippingFrom,
				"listDate" : new Date(),
				"bidFlag" : "0",
				"auctionEndDate" : null,
				"bidPrice" : null,
				"bidUser" : null
			};
	}
	else{
		var days = 4;
		console.log("In days 4");
		itemDetails = {
				"sellerEmail" : sessionEmail,
				"sellerName" : item.sellerName,
				"itemName" : item.itemName,
				"itemDescription" : item.itemDescription,
				"itemPrice" : item.itemPrice,
				"qty" : item.qty,
				"qtyLeft" : item.qtyLeft,
				"shippingFrom" : item.shippingFrom,
				"listDate" : new Date(),
				"bidFlag" : "1",
				"auctionEndDate" : new Date(Date.now()+days*24*60*60*1000),
				"bidPrice" : 0,
				"bidUser" : null
			};
	}
	
	var msg_payload = { "email": sessionEmail, "item": itemDetails};
	
	console.log("In POST Request = User Email:"+ msg_payload.item);
	
	mq_client.make_request('addItem_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		
		if(results.code == 404){
			console.log("Item Not Added Successfully");
			logger.clickEventsFileLogger.debug("Button: Add Item | "+"UserID:"+email+" | Description:Item Not Added to Selling List");
			json_responses = {"statusMsg" : "Item Not Added Successfully", "statusCode" : 404, "email": email};
			res.send(json_responses);
		}
		else{
			console.log("Item Added Successfully");
			logger.clickEventsFileLogger.debug("Button: Add Item | "+"UserID:"+email+" | Description:Item Added to Selling List");
			json_responses = {"statusMsg" : "Item Added Successfully", "statusCode" : 200, "email": email};
			res.send(json_responses);
		}
	});
	
};