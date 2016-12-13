/**
 * Routes file for Login
 */
var mysql = require('./mysqlDAO');
var logger = require('./logger');
var crypto = require('crypto');
var key = '984145';

exports.signin = function(req,res)
{

	var email, password;
	var json_responses;
	
	email = req.param("email");
	password = req.param("password");
	
	console.log("email:"+email);
	console.log("password:"+password);
	
	// check user already exists
	var getUserQuery ="select * from user where email=? and password = ?";
	var encryptedPassword = crypto.createHmac('sha1', key).update(password).digest('hex');
	
	var userCred = [];
	userCred.push(email);
	userCred.push(encryptedPassword);
	
	console.log("encryptedPassword: "+encryptedPassword);
	
	console.log("Query is:"+getUserQuery);
	
	if(email === '' || password === '' || email === undefined || password === undefined){
		json_responses = {"statusMsg" : "Email or Password is empty", "statusCode" : 404, "email": email};
		res.send(json_responses);
	}
	
	else{
		mysql.fetchDataWithParams(getUserQuery,userCred,function(err,results){
			if(err){
				throw err;
			}
			else{
				if(results.length > 0){
					console.log("Valid Login");
					req.session.email = email;
					console.log("Session initialized");
					console.log("Valid Login");
					console.log("Session initialized");
					
					logger.clickEventsFileLogger.debug("Button: Sign In | "+"UserID:"+email+" | Description:Successful Login");
					
					json_responses = {"statusMsg" : "Valid Login", "statusCode" : 200, "email": email};
					res.send(json_responses);
				}
				else {    
					console.log("Invalid Login");
					
					logger.clickEventsFileLogger.debug("Button: Sign In | "+"UserID:"+email+" | Description:Failed Login");
					
					json_responses = {"statusMsg" : "Invalid Login", "statusCode" : 404, "email": email};
					res.send(json_responses);
				}
			}  
		});
	}
};

exports.signup = function(req,res)
{

	var email, password, fname, lname, phoneNo;
	var json_responses;
	
	
	email = req.param("email");
	password = req.param("password");
	fname = req.param("fname");
	lname = req.param("lname");

	var encryptedPassword = crypto.createHmac('sha1', key).update(password).digest('hex');

	if(email === '' || password === '' || email === undefined || password === undefined){
		logger.clickEventsFileLogger.debug("Button: Sign Up | "+"UserID:"+email+" | Description:Failed SignUp");
		json_responses = {"statusMsg" : "Email or Password is empty", "statusCode" : 404, "email": email};
		res.send(json_responses);
	}
	
	else{
		console.log("email:"+email);
		console.log("password:"+password);

		var getUserQuery ="select * from user where email=?;";
		
		mysql.fetchDataWithParams(getUserQuery,[email],function(err,results){
			if(err){
				throw err;
			}
			else{
				if(results.length > 0){
					console.log("User Exists");
					
					logger.clickEventsFileLogger.debug("Button: Sign Up | "+"UserID:"+email+" | Description:Failed SignUp");

					json_responses = {"statusMsg" : "User Exists", "statusCode" : 404, "email": email};
					res.send(json_responses);
				}
				else {   // If no user with this email is found, we will add him to the user table 
					console.log("New User");
					var insertUserQuery ="INSERT INTO user SET ?";
					var userValues = {};
					userValues.email = email;
					userValues.password = encryptedPassword;
					userValues.fname = fname;
					userValues.lname = lname;

					mysql.insertData(insertUserQuery,userValues,function(err,results){
						if(err){
							throw err;
						}
						else{
							console.log("User Inserted");
							
							var insertUserLoginTime ="INSERT INTO user_last_login SET ?";
							var userTimeValues = {};
							userTimeValues.userEmail = email;
							userTimeValues.lastLoginTime = new Date().toTimeString().split(" ")[0];;
							
							mysql.insertData(insertUserLoginTime,userTimeValues,function(err,results){
								if(err){
									throw err;
								}
								else{
									console.log("User Login Time Inserted");
									
									logger.clickEventsFileLogger.debug("Button: Sign Up | "+"UserID:"+email+" | Description:Successful SignUp");
									
									json_responses = {"statusMsg" : "Congrats! Please sign in to continue", "statusCode" : 200, "email": email};
									res.send(json_responses);
								}  
							});
						}  
					});

				}
			}  
		});
	}
};