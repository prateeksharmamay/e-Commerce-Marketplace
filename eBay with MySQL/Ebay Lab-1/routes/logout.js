/**
 * Routes file for Login
 */
var mysql = require('./mysqlDAO');
var logger = require('./logger');

exports.signout = function(req,res){
	var json_response;
	
	var insertUserLoginTime ="UPDATE user_last_login SET lastLoginTime = ? where userEmail = ?";
	var userEmail = req.session.email;
	var lastLoginTime = new Date().toTimeString().split(" ")[0];
	
	console.log("userEmail:"+userEmail);
	
	mysql.insertData(insertUserLoginTime,[lastLoginTime,userEmail],function(err,results){
		if(err){
			throw err;
		}
		else{
			console.log("User Login Time Updated");
			req.session.destroy();
			logger.clickEventsFileLogger.debug("Button: Logout | "+"UserID:"+userEmail+" | Description:User Logs Out");
			json_response = {"statusMsg" : "User Logged Out", "statusCode" : 200, "email": userEmail};
			res.send(json_response);
		}  
	});
};