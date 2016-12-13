/**
 * New node file
 */

var mysql = require('./mysqlDAO');
var logger = require('./logger');

exports.getSellingHistory = function(req,res){
	var json_responses, sessionStatus, sessionEmail;
	
	if(req.session.email){
		sessionStatus = true;
		sessionEmail = req.session.email;
		
		var getItemsSoldByUser = "select * from  item inner join  user on  item.sellerId = user.userId where user.email = ?";
		
		var param = [req.session.email];
		
		mysql.fetchDataWithParams(getItemsSoldByUser,[sessionEmail],function(err,results){
			if(err){
				throw err;
			}
			else{
				if(results.length > 0){
					console.log("ITEMS FETCHED");
					
					logger.clickEventsFileLogger.debug("Button: Selling History | "+"UserID:"+sessionEmail+" | Description:Users Selling History Displayed");
					
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