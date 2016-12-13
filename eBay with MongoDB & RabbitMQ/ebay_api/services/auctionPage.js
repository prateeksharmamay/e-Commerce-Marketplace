var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";
var ObjectID = require('mongodb').ObjectID;

function getBiddableItemsforUser(msg, callback){
	
	var res = {};
	console.log("In getBiddableItemsforUser:"+ msg.email);
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		
		var coll = mongo.connectToCollection('items');
		// To fetch all items that are not listed by this user
		coll.find({"sellerEmail":{$ne:msg.email}, "qtyLeft":{$gt:0}, "bidFlag":"1"}, function(err, items){
			mongo.returnConnectionToPool();
			if(err){
				throw err;
			}
			if (items) {
				items.toArray(function(err,docs){
					console.log("Biddable Item Fetched from DB");
					console.log("itemsName: "+ docs);
					res.items = docs;
					res.code = "200";
					res.value = "Biddable Item Fetched from DB";
					callback(null, res);
				});
			} else {
				console.log("No Biddable Item in DB");
				
				res.items = null;
				res.code = "404";
				res.value = "No Biddable Item in DB";
				callback(null, res);
			}
		});
	});
}

function addBidToItem(msg, callback){
	
	var res = {};
	console.log("In addBidToItem:"+ msg.email);
	var id = new ObjectID(msg._id);
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		
		var coll = mongo.connectToCollection('items');
		// To fetch all items that are not listed by this user
		coll.findOne({"_id": id}, function(err, items){
			if(err){
				throw err;
			}
			if (items) {
				if(items.bidPrice < msg.bidAmount){
					var coll2 = mongo.connectToCollection('items');
					coll2.update({"_id": id}, {$set:{"bidPrice":msg.bidAmount, "bidUser":msg.email}}, function(err, item){
						mongo.returnConnectionToPool();
						if(err){
							throw err;
						}
						if (item) {
							console.log("Bid Item Details updated in DB");

							res.code = "200";
							res.value = "Bid Item Details updated in DB";
							callback(null, res);
						} else {
							console.log("Bid Item Details NOT updated in DB");
							
							res.code = "404";
							res.value = "Bid Item Details NOT updated in DB";
							callback(null, res);
						}
					});
				}
				else{
					console.log("Bid Price For item less than the current highest Bid.");
					
					res.code = "404";
					res.value = "Bid Price For item less than the current highest Bid.";
					callback(null, res);
				}
			} else {
				console.log("No Biddable Item in DB");
				
				res.code = "404";
				res.value = "No Biddable Item in DB";
				callback(null, res);
			}
		});
	});
}

exports.getBiddableItemsforUser = getBiddableItemsforUser;
exports.addBidToItem = addBidToItem;