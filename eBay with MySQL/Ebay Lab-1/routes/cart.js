/**
 * New node file
 */

var mysql = require('./mysqlDAO');
var logger = require('./logger');

exports.getUserCart = function(req,res){
	var json_responses, sessionStatus, sessionEmail;
	
	if(req.session.email){
		sessionStatus = true;
		sessionEmail = req.session.email;
		
		var getUserCartData = "SELECT item.itemId, item.sellerId, concat(user.fname, user.lname) 'sellerName', item.itemName, item.itemDescription, item.itemPrice, item.qty, item.qtyLeft, item.shippingFrom, item.bidFlag, users_cart.users_cartId, users_cart.buyerId, users_cart.buyerEmail FROM item inner join users_cart on users_cart.itemId = item.itemId inner join user on user.userid = item.sellerId where users_cart.buyerEmail = ?";
		
		var param = [req.session.email];
		
		mysql.fetchDataWithParams(getUserCartData,param,function(err,results){
			if(err){
				throw err;
			}
			else{
				if(results.length > 0){
					console.log("User's Cart Data FETCHED");
					
					logger.clickEventsFileLogger.debug("Button: Shopper Cart | "+"UserID:"+sessionEmail+" | Description:Cart Items Displayed");
					
					json_responses = {"statusMsg" : "Cart Data", "statusCode" : 200, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "itemsList": results};
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
};



exports.removeItemFromCart = function(req,res){
	var json_responses, sessionStatus, sessionEmail,itemId, buyerId;
	
	if(req.session.email){
		sessionStatus = true;
		sessionEmail = req.session.email;
		
		itemId = req.param("itemId");
		buyerId = req.param("email");
		
		var deleteItemFromCart = "delete from users_cart where users_cart.itemId = ? and users_cart.buyerEmail = ?";
		
		var param = [];
		param.push(itemId);
		param.push(buyerId);
		
		mysql.fetchDataWithParams(deleteItemFromCart,param,function(err,results){
			if(err){
				throw err;
			}
			else{
					console.log("Item "+itemId+" deleted from cart table");
					
					logger.clickEventsFileLogger.debug("Button: Remove Item | "+"UserID:"+sessionEmail+" | ItemID:"+itemId+" | Description:Items Removed from Cart");
					
					json_responses = {"statusMsg" : "Item "+itemId+" deleted from cart table", "statusCode" : 200, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "itemsList": null};
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

exports.verifyInventory = function(req,res){
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
		
		/*json_responses = {"statusMsg" : "Active Session", "statusCode" : 200, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "itemsList": null};
		res.send(json_responses);*/
		
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
};