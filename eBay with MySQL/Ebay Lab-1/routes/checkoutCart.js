/**
 * New node file
 */

var mysql = require('./mysqlDAO');
var logger = require('./logger');

exports.checkActiveUserSession = function(req,res){
	var json_responses, sessionStatus, sessionEmail;
	
	if(req.session.email){
		sessionStatus = true;
		sessionEmail = req.session.email;
		
		json_responses = {"statusMsg" : "Active Session", "statusCode" : 200, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "itemsList": null};
		res.send(json_responses);
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
		
		
		if(ccNo.length !== 16){
			json_responses = {"statusMsg" : "Invalid Card Number", "statusCode" : 400, "sessionStatus": sessionStatus, 
					"sessionEmail": sessionEmail, "itemsNotAvailable": null };

			res.send(json_responses);
		}
		
		else{
			console.log("cartItems.length:"+cartItems.length);

			var getAllItems = "SELECT item.itemId, item.qtyLeft FROM item";
			var itemsNotAvailable = [];
			var successFlag=0;

			mysql.fetchData(getAllItems,function(err,results){
				if(err){
					throw err;
				}
				else{
					console.log("Results obtained as :"+results);
					var availableItems = results;
					for(var i = 0; i < cartItems.length; i++){
						for(var j=0; j < availableItems.length; j++){
							console.log("cartItems[i].itemId :"+cartItems[i].itemId);
							console.log("availableItems[j].itemId :"+availableItems[j].itemId);
							
							console.log("cartItems.qty :"+cartItems.qty);
							console.log("availableItems[j].qtyLeft :"+availableItems[j].itemId);
							if(cartItems[i].itemId === availableItems[j].itemId && cartItems[i].qty <= availableItems[j].qtyLeft){
								// Do the insertion updation and delete
								// Update Qty in Item Table
								var updateItemsTable = "update ebay.item SET item.qtyLeft = ? where itemId = ?";
								
								var remQty = availableItems[j].qtyLeft - cartItems[i].qty;
								
								/*var updateItem = [];
								updateItem.push(remQty);
								updateItem.push(cartItems[i].itemId);*/
								
								console.log("in for i,j");
								mysql.fetchDataWithParams(updateItemsTable,[remQty,cartItems[i].itemId],function(err,results){
									console.log("in update Table");
									if(err){
										throw err;
									}
									else{
										successFlag=1;
										console.log("Qty for Item changed in Item Table");
									}  
								});
								
								var deleteCartForUser = "delete from users_cart where users_cart.buyerEmail = ?";
								var buyerEmail = [];
								buyerEmail.push(userEmail);
								
								mysql.fetchDataWithParams(deleteCartForUser,buyerEmail,function(err,results){
									if(err){
										throw err;
									}
									else{
										successFlag=1;
										console.log(userEmail+" Cart has been Cleared");
									}  
								});
								
								var item = {}; 
								item.itemId = cartItems[i].itemId;
								item.userEmail = cartItems[i].userEmail;
								item.qty = cartItems[i].qty;
								item.boughtDate = new Date();
								item.soldPrice = (cartItems[i].itemPrice * cartItems[i].qty);
								
								var addToUserPurchaseHistory = "insert into user_order_data SET ?";
								
								mysql.insertData(addToUserPurchaseHistory,item,function(err,results){
									if(err){
										throw err;
									}
									else{
										successFlag=1;
										console.log("Item added to User's Purchases Table.");
									}  
								});
								
								break;
							}
							else if(cartItems[i].itemId === availableItems[j].itemId && cartItems[i].qty > availableItems[j].qtyLeft){
								console.log("Not in if");
								itemsNotAvailable.push(cartItems[i]);
							}
						}
					}
					
					if(i === cartItems.length){
						json_responses = {"statusMsg" : "Transaction Successful", "statusCode" : 200, "sessionStatus": sessionStatus, 
								"sessionEmail": sessionEmail, "itemsNotAvailable": itemsNotAvailable };
						
						logger.clickEventsFileLogger.debug("Button: Checkout Cart | "+"UserID:"+sessionEmail+" | Description:Items Bought by Customer");
						
						res.send(json_responses);
					}
				}  
			});
		}
		
		
	}
	
	else{
		console.log("No Active Session.");
		sessionStatus = false;
		sessionEmail = null;
		json_responses = {"statusMsg" : "No Active Session", "statusCode" : 404, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "itemsList": null};
		res.send(json_responses);
	}
};