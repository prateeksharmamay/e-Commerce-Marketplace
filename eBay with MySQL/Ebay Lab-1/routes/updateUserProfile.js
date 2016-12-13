/**
 * New node file
 */

var mysql = require('./mysqlDAO');
var logger = require('./logger');

exports.getProfileDetails = function(req,res){
	var json_responses, sessionStatus, sessionEmail;
	
	if(req.session.email){
		sessionStatus = true;
		sessionEmail = req.session.email;
		
		var getUserDetails = "SELECT * FROM ebay.user where email = ?";
		
		mysql.fetchDataWithParams(getUserDetails,[sessionEmail],function(err,results){
			if(err){
				throw err;
			}
			else{
				if(results.length > 0){
					console.log("User Details FETCHED");
					
					logger.clickEventsFileLogger.debug("Button: Profile | "+"UserID:"+sessionEmail+" | Description:Users Profile Page Displayed");
					
					json_responses = {"statusMsg" : "User Details Fetched", "statusCode" : 200, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "userDetails": results};
					res.send(json_responses);
				}
				else {    
					console.log("No Items in the DB");
					json_responses = {"statusMsg" : "No Items in the DB", "statusCode" : 404, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "userDetails": results};
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

exports.setProfileDetails = function(req,res){
	var json_responses, sessionStatus, sessionEmail;
	
	if(req.session.email){
		sessionStatus = true;
		sessionEmail = req.session.email;
		var userDetails = req.param("userDetails");
		
		var getUserDetails = "Update user SET ? where email = ?";
		
		mysql.fetchDataWithParams(getUserDetails,[userDetails,sessionEmail],function(err,results){
			if(err){
				throw err;
			}
			else{
					console.log("User Details Updated");
					
					logger.clickEventsFileLogger.debug("Button: Update Profile | "+"UserID:"+sessionEmail+" | Description:Users Profile Updated");
					
					json_responses = {"statusMsg" : "User Details Updated", "statusCode" : 200, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "userDetails": results};
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