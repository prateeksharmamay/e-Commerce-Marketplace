var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";
var ObjectID = require('mongodb').ObjectID;

function getUserCart(msg, callback){
	
	var res = {};
	console.log("In getUserCart:"+ msg.email);
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		
		var coll = mongo.connectToCollection('usersCart');
		// This will show the user last login time
		coll.aggregate([
		                {$match : { "buyerEmail" : msg.email }},
		                {
		                  $lookup:
		                    {
		                      from: "items",
		                      localField: "itemId",
		                      foreignField: "_id",
		                      as: "itemDesc"
		                    }
		               }
		               ,{ $project : { "itemDesc" : 1,_id:0 } }
		               ], function(err, items){
			mongo.returnConnectionToPool();
			if(err){
				throw err;
			}
			console.log("items: "+items);
			if (items) {
				console.log("Cart Items Fetched from DB");
				console.log("itemsName: "+ items);

				res.items = items;
				res.code = "200";
				res.value = "Cart Items Fetched from DB";
				callback(null, res);
			} else {
				console.log("No Item in DB");

				res.items = null;
				res.code = "404";
				res.value = "No Item in DB";
				callback(null, res);
			}
		});
	});
}

function removeItemFromCart(msg, callback){
	
	var res = {};
	var id = new ObjectID(msg._id);
	console.log("In removeItemFromCart:"+ msg.buyerEmail);
	
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		console.log("msg._id: "+"ObjectId('"+msg._id+"')");
		var coll = mongo.connectToCollection('usersCart');
		// This will show the user last login time
		coll.remove({"buyerEmail": msg.buyerEmail, "itemId":id}, function(err, cart){
			mongo.returnConnectionToPool();
			if(err){
				throw err;
			}
			//if (user.nModified > 0) {
			if (cart) {
					console.log("Item removed from user cart in DB");
					console.log("Cart Details: "+ cart);

					res.modified = true;
					res.code = "200";
					res.value = "Item removed from user cart in DB";
					callback(null, res);
			} else {
				console.log("No change in User Cart in DB");
				
				res.modified = null;
				res.code = "404";
				res.value = "No change in User Cart in DB";
				callback(null, res);
			}
		});
	});
}

exports.getUserCart = getUserCart;
exports.removeItemFromCart = removeItemFromCart;