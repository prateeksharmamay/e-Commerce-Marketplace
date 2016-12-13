/**
 * New node file
 */

var mysql = require('./mysqlDAO');
var logger = require('./logger');

exports.getPurchaseHistory = function(req,res){
	var json_responses, sessionStatus, sessionEmail;
	
	if(req.session.email){
		sessionStatus = true;
		sessionEmail = req.session.email;
		
		var getItemsPurchasedByUser = "SELECT concat(user.fname,user.lname) as sellerName, user_order_data.qty, user_order_data.boughtDate, user_order_data.soldPrice,item.itemName, item.itemDescription, item.shippingFrom FROM user_order_data inner join item on item.itemId = user_order_data.itemId inner join user on item.sellerId = user.userid where userEmail = ?";
		
		var param = [req.session.email];
		
		mysql.fetchDataWithParams(getItemsPurchasedByUser,[sessionEmail],function(err,results){
			if(err){
				throw err;
			}
			else{
				if(results.length > 0){
					console.log("ITEMS FETCHED");
					
					logger.clickEventsFileLogger.debug("Button: Purchase History | "+"UserID:"+sessionEmail+" | Description:Users Purchase History Displayed");
					
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