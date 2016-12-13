
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";

function addItem(msg, callback){
	
	var res = {};
	console.log("In addItem:"+ msg.email);
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		
		var coll = mongo.connectToCollection('items');
		// This will show the user last login time
		coll.insertOne(msg.item, function(err, user){
			mongo.returnConnectionToPool();
			if(err){
				throw err;
			}
			if (user) {
					console.log("Item Inserted in DB");
					
					res.code = "200";
					res.value = "Item Inserted in DB";
					callback(null, res);
			} else {
				console.log("Item NOT Inserted in DB");
				
				res.code = "404";
				res.value = "Item NOT Inserted in DB";
				callback(null, res);
			}
		});
	});
}

exports.addItem = addItem;