var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";
var bcrypt = require('bcrypt-nodejs');

function verifyLogin(msg, callback){
	
	var res = {};
	console.log("In verifyLogin:"+ msg.email);
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.connectToCollection('users');

		coll.findOne({email: msg.email},{password:1}, function(err, user){
			mongo.returnConnectionToPool();
			if(err){
				throw err;
			}
			
			if (user) {
				// This way subsequent requests will know the user is logged in.
				if(bcrypt.compareSync(msg.password,user.password)){
					res.code = "200";
					res.value = "Success Login";
					console.log("Succes Login");
					callback(null, res);
				}
				else{
					console.log("Invalid Password");
					
					res.code = "404";
					res.value = "Failed Login";
					console.log("Failed Login");
					callback(null, res);
				}
				

			} else {
				console.log("Invalid Username");
				
				res.code = "404";
				res.value = "Failed Login";
				console.log("Failed Login");
				callback(null, res);
			}
		});
	});
}

function registerUser(msg, callback){
	
	var res = {};
	console.log("In registerUser:"+ msg.userDetails.email);
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.connectToCollection('users');

		coll.findOne({email: msg.userDetails.email}, function(err, user){
			if(err){
				throw err;
			}
			
			if (user) {
				// This way subsequent requests will know the user is logged in.
				mongo.returnConnectionToPool();
				res.code = "404";
				res.value = "User Exists";
				console.log("User Exists");
				callback(null, res);

			} else {
				coll.insertOne(
					{
						"fname" : msg.userDetails.fname,
						"lname" : msg.userDetails.lname,
						"email" : msg.userDetails.email,
						"password" : bcrypt.hashSync(msg.userDetails.password),
						"lastLoginTime" : new Date().toTimeString().split(" ")[0],
						"dob" : "",
						"ebayHandle" : "",
						"contact" : "",
						"location" : ""
					},
					function(err, user){
						mongo.returnConnectionToPool();
						if(err){
							throw err;
						}
						res.code = "200";
						res.value = "User Inserted";
						console.log("User Inserted");
						callback(null, res);
					}
				);
			}
		});
	});
}

function updateLastLoginTime(msg, callback){
	
	var res = {};
	console.log("In updateLastLoginTime:"+ msg.email);
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.connectToCollection('users');

		coll.updateOne({email: msg.email}, {$set:{"lastLoginTime": msg.lastLoginTime}}, function(err, user){
			mongo.returnConnectionToPool();
			if(err){
				throw err;
			}
			
			if (user) {
				// This way subsequent requests will know the user is logged in.
				res.code = "200";
				res.value = "User Login Time Updated";
				console.log("User Login Time Updated");
				callback(null, res);
			} else {
				res.code = "404";
				res.value = "User Login Time NOT Updated";
				console.log("User Login Time NOT Updated");
				callback(null, res);
			}
		});
	});
}

exports.verifyLogin = verifyLogin;
exports.registerUser = registerUser;
exports.updateLastLoginTime = updateLastLoginTime;