/**
 * New node file
 */

var mq_client = require('../rpc/client');
var logger = require('./logger');

exports.getUserCart = function(req,res){
	var json_responses, sessionStatus, sessionEmail;
	
	if(req.session.email){
		sessionStatus = true;
		sessionEmail = req.session.email;
		
		var msg_payload = { "email": sessionEmail};
		
		console.log("In POST Request = User Email:"+ sessionEmail);
		
		mq_client.make_request('getUserCart_queue',msg_payload, function(err,results){
			
			console.log(results);
			if(err){
				throw err;
			}
			
			if(results.code == 404){
				console.log("User's Cart Data NOT FETCHED");
				
				logger.clickEventsFileLogger.debug("Button: Shopper Cart | "+"UserID:"+sessionEmail+" | Description:Cart Items Displayed");
				
				json_responses = {"statusMsg" : "Cart Data", "statusCode" : 404, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "itemsList": null};
				res.send(json_responses);
			}
			else{
				console.log("User's Cart Data FETCHED");
				
				var itemList = [];
				var i;
				for(i = 0; i < results.items.length ; i++){
					itemList.push(results.items[i].itemDesc[0]);
				}
				
				if(i == results.items.length){
					logger.clickEventsFileLogger.debug("Button: Shopper Cart | "+"UserID:"+sessionEmail+" | Description:Cart Items Displayed");
					
					json_responses = {"statusMsg" : "Cart Data", "statusCode" : 200, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "itemsList": itemList};
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



exports.removeItemFromCart = function(req,res){
	var json_responses, sessionStatus, sessionEmail,itemId, buyerId;
	
	if(req.session.email){
		sessionStatus = true;
		sessionEmail = req.session.email;
		var _id = req.param("_id");
		
		var msg_payload = { "buyerEmail": sessionEmail, "_id": _id};
		
		console.log("In POST Request = User Email:"+ sessionEmail);
		
		mq_client.make_request('removeItemFromCart_queue',msg_payload, function(err,results){
			
			console.log(results);
			if(err){
				throw err;
			}
			
			if(results.code == 404){
				console.log("Item "+_id+" not deleted from cart table");
				
				logger.clickEventsFileLogger.debug("Button: Remove Item | "+"UserID:"+sessionEmail+" | ItemID:"+itemId+" | Description:Items Not Removed from Cart");
				
				json_responses = {"statusMsg" : "Item "+_id+" not deleted from cart table", "statusCode" : 200, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "itemsList": null};
				res.send(json_responses);
			}
			else{
				console.log("Item "+_id+" deleted from cart table");
				
				logger.clickEventsFileLogger.debug("Button: Remove Item | "+"UserID:"+sessionEmail+" | ItemID:"+itemId+" | Description:Items Removed from Cart");
				
				json_responses = {"statusMsg" : "Item "+_id+" deleted from cart table", "statusCode" : 200, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "itemsList": null};
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

/*exports.verifyInventory = function(req,res){
	var json_responses, sessionStatus, sessionEmail;
	
	if(req.session.email){
		sessionStatus = true;
		sessionEmail = req.session.email;
		
		var cartItems = req.param("cartItems");
		var userEmail = req.param("userEmail");
		console.log("cartItems:"+cartItems);
		console.log("userEmail:"+userEmail);
		var items = [];
		
		for(var i = 0; i < cartItems.length; i++){
			items.push(cartItems[i].itemId);
		}
		
		json_responses = {"statusMsg" : "Active Session", "statusCode" : 200, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "itemsList": null};
		res.send(json_responses);
		
		var getAllItems = "SELECT item.itemId, item.qtyLeft FROM item";
		
		mysql.fetchData(getAllItems,function(err,results){
			if(err){
				throw err;
			}
			else{
				if(results.length > 0){
					console.log("ITEMS FETCHED");
					
					json_responses = {"statusMsg" : "Items Fetched", "statusCode" : 200, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "itemsList": results};
					res.send(json_responses);
				}
				else {    
					console.log("No Items in the DB");
					json_responses = {"statusMsg" : "No Items in the DB", "statusCode" : 404, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "itemsList": results};
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
};*/