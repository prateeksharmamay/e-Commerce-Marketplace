var mongo = require("./mongo");
var ObjectID = require('mongodb').ObjectID;
var mongoURL = "mongodb://localhost:27017/ebay";

function getPurchaseHistory(msg, callback){
	
	var res = {};
	console.log("In getPurchaseHistory:"+ msg.email);
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		
		var coll1 = mongo.connectToCollection('userPurchaseHistory');
		// To fetch all items that are not listed by this user
		coll1.find({"userEmail":msg.email}, function(err, items){
			mongo.returnConnectionToPool();
			if(err){
				throw err;
			}
			
			if (items) {
				items.toArray(function(err,docs){
					console.log("Puchased Items by User Fetched from DB");
					res.items = docs;
					res.code = "200";
					res.value = "Puchased Items by User Fetched from DB";
					callback(null, res);
				});
			} else {
				console.log("No Puchased Items for in DB");
				
				res.items = null;
				res.code = "404";
				res.value = "No Puchased Items for in DB";
				callback(null, res);
			}
		});
	});
}

exports.getPurchaseHistory = getPurchaseHistory;