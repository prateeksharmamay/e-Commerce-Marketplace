/**
 * New node file
 */

var mysql = require('./mysqlDAO');
var logger = require('./logger');

exports.getAllItems = function(req,res){
	var json_responses, sessionStatus, sessionEmail;
	
	if(req.session.email){
		sessionStatus = true;
		sessionEmail = req.session.email;
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		
		// Run the Back-end Job for processing Bid
		
		var getAllBiddableItems = "select * from item where item.bidFlag = 1 and item.qtyLeft > 0";
		
		mysql.fetchData(getAllBiddableItems,function(err,results){
			if(err){
				throw err;
			}
			else{
				if(results.length > 0){
					console.log("Fake Chrone Job Running");
					
					var currentDate = new Date();
					
					for(var i = 0; i < results.length; i++){
						var auctionEndDate = new Date(results[i].auctionEndDate);
						console.log("auctionEndDate:"+auctionEndDate);
						var timeDiff = currentDate.getTime() - auctionEndDate.getTime();
						var diffDays = timeDiff / (1000 * 3600 * 24);
						
						if(diffDays > 0){
							var itemId = results[i].itemId;
							var buyerEmail = results[i].bidUser;
							var itemPrice = results[i].itemPrice;
							
							var insertUserCartQuery ="INSERT INTO users_cart SET ?";
							var cartData = {"itemId":itemId, "buyerEmail":buyerEmail};
							
							mysql.fetchDataWithParams(insertUserCartQuery,cartData,function(err,results){
								if(err){
									throw err;
								}
								else{
									console.log("User Cart Data Inserted");

									json_responses = {"statusMsg" : "Item added to your Cart", "statusCode" : 200};
								}
							});
							
							var updateItemsTable = "update item SET item.bidFlag = 2, item.itemPrice = ? where itemId = ?";
							var remQty = 0;
							
							/*var updateItem = [];
							updateItem.push(remQty);
							updateItem.push(cartItems[i].itemId);*/
							
							console.log("in for i,j");
							mysql.fetchDataWithParams(updateItemsTable,[itemPrice,results[i].itemId],function(err,results){
								console.log("in update Table");
								if(err){
									throw err;
								}
								else{
									successFlag=1;
									console.log("Qty for Item changed in Item Table");
								}  
							});
						}
					}
					
					json_responses = {"statusMsg" : "Items Fetched", "statusCode" : 200};
				}
				else {    
					console.log("No Items in the DB");
					json_responses = {"statusMsg" : "No Items in the DB", "statusCode" : 404};
				}
			}  
		});
		
		// To Fetch Items for User Dashboard
		
		var getAllItems = "select * from  item inner join  user on  item.sellerId = user.userId where item.qtyLeft > 0 and item.bidFlag = 0 and  user.email <> ?";
		
		var param = [req.session.email];
		
		mysql.fetchDataWithParams(getAllItems,param,function(err,results){
			if(err){
				throw err;
			}
			else{
				if(results.length > 0){
					console.log("ITEMS FETCHED");
					
					var getUserLoginTime = "SELECT * FROM ebay.user_last_login where userEmail = ?";
					
					mysql.fetchDataWithParams(getUserLoginTime,[sessionEmail],function(err,loginTimeData){
						if(err){
							throw err;
						}
						else{
							if(loginTimeData.length > 0){
								console.log("Login Time FETCHED");
								
								logger.clickEventsFileLogger.debug("Button: Dashboard/Shopping | "+"UserID:"+sessionEmail+" | Description:Items Displayed");
								
								json_responses = {"statusMsg" : "Items Fetched", "statusCode" : 200, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "itemsList": results,"loginTimeData":loginTimeData};
								res.send(json_responses);
							}
							else {    
								console.log("No Items in the DB");
								json_responses = {"statusMsg" : "No Items in the DB", "statusCode" : 404, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "itemsList": results,"loginTimeData":null};
								res.send(json_responses);
							}
						}  
					});
					
					/*json_responses = {"statusMsg" : "Items Fetched", "statusCode" : 200, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "itemsList": results};
					res.send(json_responses);*/
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


exports.addItemToUserCart = function(req,res){
	var json_responses, item_id, email;
	
	if(req.session.email){
		email = req.param("email");
		item_id = req.param("itemId");
		
		var insertUserCartQuery ="INSERT INTO users_cart SET ?";
		var cartData = {itemId:item_id, buyerEmail:email};
		
		
		
		mysql.fetchDataWithParams(insertUserCartQuery,cartData,function(err,results){
			if(err){
				throw err;
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