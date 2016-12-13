var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";

function getProfileDetails(msg, callback){
	
	var res = {};
	console.log("In getProfileDetails:"+ msg.email);
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		
		var coll = mongo.connectToCollection('users');
		// This will show the user last login time
		coll.findOne({"email": msg.email}, {_id:0}, function(err, user){
			mongo.returnConnectionToPool();
			if(err){
				throw err;
			}
			
			if (user) {
					console.log("User Details Fetched from DB");
					console.log("User Details: "+ user);

					res.userDetails = user;
					res.code = "200";
					res.value = "User Details Fetched from DB";
					callback(null, res);
			} else {
				console.log("No such User in DB");
				
				res.userDetails = null;
				res.code = "404";
				res.value = "No such User in DB";
				callback(null, res);
			}
		});
	});
}

function setProfileDetails(msg, callback){
	
	var res = {};
	console.log("In setProfileDetails:"+ msg.email);
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		console.log("msg.userDetails: "+msg.userDetails.fname);
		var coll = mongo.connectToCollection('users');
		// This will show the user last login time
		coll.update({"email": msg.email}, {$set:msg.userDetails}, function(err, user){
			mongo.returnConnectionToPool();
			if(err){
				//throw err;
				console.log("Error: "+err);
				
				res.modified = null;
				res.code = "404";
				res.value = "Error in DB Connection.";
				callback(null, res);
			}
			console.log("user: "+user);
			//if (user.nModified > 0) {
			if (user) {
					console.log("User Details updated in DB");
					console.log("User Details: "+ user);

					res.modified = true;
					res.code = "200";
					res.value = "User Details updated in DB";
					callback(null, res);
			} else {
				console.log("No change in User Details in DB");
				
				res.modified = null;
				res.code = "404";
				res.value = "No change in User Details in DB";
				callback(null, res);
			}
		});
	});
}

exports.getProfileDetails = getProfileDetails;
exports.setProfileDetails = setProfileDetails;