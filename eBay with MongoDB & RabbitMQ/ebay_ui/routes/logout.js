/**
 * Routes file for Login
 */
var mq_client = require('../rpc/client');
var logger = require('./logger');

exports.signout = function(req,res){
	var json_response, sessionStatus, sessionEmail;
	sessionEmail = req.session.email;
	
	if(req.session.email){
		sessionStatus = true;
		sessionEmail = req.session.email;
		var lastLoginTime = (new Date()).toString().substr(0,24);
		
		var msg_payload = { "email": sessionEmail, "lastLoginTime": lastLoginTime};
		
		console.log("In POST Request = User Email:"+ sessionEmail);
		
		mq_client.make_request('updateLastLoginTime_queue',msg_payload, function(err,results){
			
			console.log(results);
			if(err){
				throw err;
			}
			
			if(results.code == 404){
				console.log("User Login Time NOT Updated");
				
				req.session.destroy();
				logger.clickEventsFileLogger.debug("Button: Logout | "+"UserID:"+sessionEmail+" | Description:User Logs Out");
				
				json_response = {"statusMsg" : "User Logged Out", "statusCode" : 200, "email": sessionEmail};
				res.send(json_response);
			}
			else{
				console.log("User Login Time Updated");
				
				req.session.destroy();
				logger.clickEventsFileLogger.debug("Button: Logout | "+"UserID:"+sessionEmail+" | Description:User Logs Out");
				
				json_response = {"statusMsg" : "User Logged Out", "statusCode" : 200, "email": sessionEmail};
				res.send(json_response);
			}
		});
	}
	
	else{
		console.log("No Active Session.");
		sessionStatus = false;
		sessionEmail = null;
		json_response = {"statusMsg" : "No Active Session", "statusCode" : 404, "sessionStatus": sessionStatus, "sessionEmail": sessionEmail, "itemsList": null};
		res.send(json_response);
	}
};