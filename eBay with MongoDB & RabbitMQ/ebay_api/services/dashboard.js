var mongo = require("./mongo");
var ObjectID = require('mongodb').ObjectID;
var mongoURL = "mongodb://localhost:27017/ebay";

function getAllItems(msg, callback){
	
	var res = {};
	console.log("In getAllItems:"+ msg.email);
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		
		var coll = mongo.connectToCollection('users');
		// This will show the user last login time
		coll.findOne({"email": msg.email}, {_id:0,lastLoginTime:1}, function(err, user){
			if(err){
				throw err;
			}
			
			var coll1 = mongo.connectToCollection('items');
			// To fetch all items that are not listed by this user
			coll1.find({"sellerEmail":{$ne:msg.email}, "qtyLeft":{$gt:0}, "bidFlag":"0"}, function(err, items){
				mongo.returnConnectionToPool();
				if(err){
					throw err;
				}
				
				if (items) {
					items.toArray(function(err,docs){
						console.log("Item Fetched from DB");
						console.log("itemsName: "+ docs);
						res.lastLoginTime = user.lastLoginTime;
						res.items = docs;
						res.code = "200";
						res.value = "Item Fetched from DB";
						callback(null, res);
					});
				} else {
					console.log("No Item in DB");
					
					res.lastLoginTime = user.lastLoginTime;
					res.items = null;
					res.code = "404";
					res.value = "No Item in DB";
					callback(null, res);
				}
			});
		});
	});
}

function addItemToUserCart(msg, callback){
	
	var res = {};
	console.log("In addItemToUserCart:"+ msg.email);
	var id = new ObjectID(msg.itemId);
	console.log("msg.itemId:"+ msg.itemId);
	console.log("id:"+ id);
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		
		var coll = mongo.connectToCollection('usersCart');
		// This will show the user last login time
		coll.insertOne({"buyerEmail": msg.email, "itemId": id}, function(err, cartItem){
			mongo.returnConnectionToPool();
			if(err){
				throw err;
			}
			
			if (cartItem) {
					console.log("User Cart Item inserted in DB");

					res.code = "200";
					res.value = "User Cart Item inserted in DB";
					callback(null, res);
			} else {
				console.log("User Cart Item NOT inserted in DB");
				
				res.code = "404";
				res.value = "User Cart Item NOT inserted in DB";
				callback(null, res);
			}
		});
	});
}

function afterBidExpiry(msg, callback){
	
	var res = {};
	console.log("In afterBidExpiry:"+ msg.email);
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		
		var coll1 = mongo.connectToCollection('items');
		// To fetch all items that are not listed by this user
		coll1.find({"qtyLeft":{$gt:0}, "bidFlag":"1"}, function(err, items){
			if(err){
				throw err;
			}
			
			if (items) {
				items.toArray(function(err,docs){
					console.log("Fake Chrone Job Running");
					
					var currentDate = new Date();
					var i;
					for(i = 0; i < docs.length; i++){
						var auctionEndDate = new Date(docs[i].auctionEndDate);
						console.log("auctionEndDate:"+auctionEndDate);
						var timeDiff = currentDate.getTime() - auctionEndDate.getTime();
						var diffDays = timeDiff / (1000 * 3600 * 24);
						
						if(diffDays > 0){
							var itemId = docs[i]._id;
							var buyerEmail = docs[i].bidUser;
							var itemPrice = docs[i].itemPrice;
							
							var coll2 = mongo.connectToCollection('usersCart');
							coll2.insertOne({"buyerEmail": buyerEmail, "itemId": itemId}, function(err, cartItem){
								if(err){
									throw err;
								}
								
								if (cartItem) {
										console.log("User Cart Item inserted in DB");

										res.cartUpdated = true;
								} else {
									console.log("User Cart Item NOT inserted in DB");
									
									res.cartUpdated = false;
								}
							});
							
							
							var coll3 = mongo.connectToCollection('items');
							coll3.update({"_id": itemId}, {$set:{"bidFlag":"2", "itemPrice":itemPrice}}, function(err, user){
								if(err){
									throw err;
								}
								if (user) {
									console.log("Item QTY updated in DB");

									res.itemQtyUpdated = true;
								} else {
									console.log("Item QTY NOT updated in DB");
									
									res.itemQtyUpdated = false;
								}
							});
						}
					}
					
					if(i ==  docs.length){
						mongo.returnConnectionToPool();
						console.log("Changes for expired Bid are done successfully.");
						console.log("itemsName: "+ docs);
						res.code = "200";
						res.value = "Changes for expired Bid are done successfully.";
						callback(null, res);
					}
				});
			} else {
				console.log("No Item in DB");
				
				res.lastLoginTime = user.lastLoginTime;
				res.items = null;
				res.code = "404";
				res.value = "No Item in DB";
				callback(null, res);
			}
		});
	});
}

exports.getAllItems = getAllItems;
exports.addItemToUserCart = addItemToUserCart;
exports.afterBidExpiry = afterBidExpiry;