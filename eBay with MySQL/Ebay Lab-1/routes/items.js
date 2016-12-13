/**
 * Routes file for Login
 */
var mysql = require('./mysqlDAO');
var logger = require('./logger');

exports.addItem = function(req,res)
{

	var email, password, item;
	var json_responses;


	email = req.param("email");
	item = req.param("item");

	console.log("email:"+email);
	console.log("item:"+item);

	var getUserQuery ="select userId from user where email=?;";

	mysql.fetchDataWithParams(getUserQuery,[email],function(err,results){
		if(err){
			throw err;
		}
		else{
			if(results.length > 0){
				console.log("User Exists");
				
				var insertItemQuery ="insert into item set ?";
				var days = 4;
				
				item.listDate = new Date();
				var newDate = new Date(Date.now()+days*24*60*60*1000);
				item.sellerId = results[0].userId;
				
				if(item.bidFlag === 1){
					item.auctionEndDate = newDate;
				}
				else{
					item.auctionEndDate = null;
				}
				mysql.fetchDataWithParams(insertItemQuery,item,function(err,results){
					if(err){
						throw err;
					}
					else{
						console.log("Item Added Successfully");
						logger.clickEventsFileLogger.debug("Button: Add Item | "+"UserID:"+email+" | Description:Item Added to Selling List");
						json_responses = {"statusMsg" : "Item Added Successfully", "statusCode" : 200, "email": email};
						res.send(json_responses);
					}  
				});

				/*json_responses = {"statusMsg" : "User Exists", "statusCode" : 404, "email": email};
				res.send(json_responses);*/
			}
		}  
	});
};