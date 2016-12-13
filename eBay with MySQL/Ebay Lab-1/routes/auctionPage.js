/**
 * New node file
 */

var mysql = require('./mysqlDAO');
var logger = require('./logger');

exports.getBiddableItemsforUser = function(req,res){
	var json_responses, sessionStatus, sessionEmail;
	
	if(req.session.email){
		sessionStatus = true;
		sessionEmail = req.session.email;
		
		var getAllItems = "select * from  item inner join  user on  item.sellerId = user.userId where item.qtyLeft > 0 and item.bidFlag = 1 and  user.email <> ?";
		
		var param = [req.session.email];
		
		mysql.fetchDataWithParams(getAllItems,param,function(err,results){
			if(err){
				throw err;
			}
			else{
				if(results.length > 0){
					console.log("ITEMS FETCHED");
					
					logger.clickEventsFileLogger.debug("Button: Bid/Auction | "+"UserID:"+sessionEmail+" | Description:Items available for bidding Displayed");
					
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

exports.addBidToItem = function(req,res){
var json_responses, sessionStatus, sessionEmail;
	
	if(req.session.email){
		sessionStatus = true;
		sessionEmail = req.session.email;
		
		var itemId = req.param("itemId");
		var bidAmount = req.param("bidAmount");

		var getItem = "select * from  item where item.itemId = ?";

		mysql.fetchDataWithParams(getItem,[itemId],function(err,results){
			if(err){
				throw err;
			}
			else{
				if(results.length > 0){
					console.log("ITEM FETCHED");
					
					logger.clickEventsFileLogger.debug("Button: Place Bid | "+"UserID:"+sessionEmail+" | ItemID:"+itemId+" | Bid Amount:"+bidAmount+" | Description:Bid Placed");
					logger.biddingFileLogger.debug("UserID:"+sessionEmail+" | ItemID:"+itemId+" | Bid Amount:"+bidAmount);
					
					if(results[0].bidPrice < bidAmount){
						
						var updateItemWithBidDetail = "update item set item.bidPrice = ?, item.bidUser = ? where itemId = ? ";
						
						mysql.fetchDataWithParams(updateItemWithBidDetail,[bidAmount,sessionEmail,itemId],function(err,results){
							if(err){
								throw err;
							}
							else{
								console.log("ITEM UPDATED");

								json_responses = {"statusMsg" : "ITEM UPDATED", "statusCode" : 200, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "itemsList": null};
								res.send(json_responses);
							}  
						});
					}
					
					json_responses = {"statusMsg" : "Items Fetched", "statusCode" : 200, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "itemsList": results};
					res.send(json_responses);
				}
				else {    
					console.log("No Items in the DB");
					json_responses = {"statusMsg" : "No Item in the DB", "statusCode" : 404, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "itemsList": null};
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