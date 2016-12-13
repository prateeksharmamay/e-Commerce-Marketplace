var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/ebay";
var ObjectID = require('mongodb').ObjectID;

function makePayment(msg, callback){
	
	var res = {};
	console.log("In makePayment:"+ msg.email);
	
	if(msg.ccNo.length !== 16){
		console.log('ccNo less than 16 Numbers.');
		
		res.code = "420";
		res.value = "ccNo less than 16 Numbers.";
		callback(null, res);
	}
	
	else{
		mongo.connect(mongoURL, function(){
			console.log('Connected to mongo at: ' + mongoURL);
			
			var coll1 = mongo.connectToCollection('items');
			// To fetch all items that are not listed by this user
			coll1.find({"sellerEmail":{$ne:msg.email}}, function(err, items){
				if(err){
					throw err;
				}

				if (items) {
					items.toArray(function(err,docs){

						console.log("Results obtained as :"+ docs);
						var itemsNotAvailable = [];
						var availableItems = docs;
						var cartItems = msg.cartItems;
						var i;
						console.log("cartItems.length: "+cartItems.length);
						console.log("availableItems.length: "+availableItems.length);
						for(i = 0; i < cartItems.length; i++){
							for(var j=0; j < availableItems.length; j++){
								console.log("cartItems[i]._id :"+cartItems[i]._id);
								console.log("availableItems[j]._id :"+availableItems[j]._id);

								console.log("cartItems.qty :"+cartItems[i].qty);
								console.log("availableItems[j].qtyLeft :"+availableItems[j].qtyLeft);
								if(cartItems[i]._id == availableItems[j]._id && cartItems[i].qty <= availableItems[j].qtyLeft){
									// Do the insertion updation and delete
									console.log("Do the insertion updation and delete");
									var remQty = availableItems[j].qtyLeft - cartItems[i].qty;
									var itemId = new ObjectID(cartItems[i]._id);
									//////////////////////////////////////////////////////////////////////////////
									// Update Qty in Item Table
									var coll2 = mongo.connectToCollection('items');
									coll2.update({"_id": itemId}, {$set:{"qtyLeft":remQty}}, function(err, user){
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
									//////////////////////////////////////////////////////////////////////////////
									
									//////////////////////////////////////////////////////////////////////////////
									// Delete Users Cart Items from DB
									
									var coll3 = mongo.connectToCollection('usersCart');
									// This will show the user last login time
									coll3.remove({"buyerEmail": msg.email, "itemId":itemId}, function(err, cart){
										if(err){
											throw err;
										}
										//if (user.nModified > 0) {
										if (cart) {
												console.log("Item removed from user cart in DB");

												res.cartUpdated = true;
										} else {
											console.log("No change in User Cart in DB");
											
											res.cartUpdated = false;										}
									});
									//////////////////////////////////////////////////////////////////////////////

									//////////////////////////////////////////////////////////////////////////////
									// Insert Items to User Purchase History in DB
									var item = {
											"itemId": itemId,
											"sellerName": availableItems[j].sellerName,
											"itemName": availableItems[j].itemName,
											"itemDescription": availableItems[j].itemDescription,
											"itemPrice": availableItems[j].itemPrice,
											"shippingFrom": availableItems[j].shippingFrom,
											"userEmail": msg.email,
											"qty": cartItems[i].qty,
											"boughtDate": (new Date()).toString().substr(0,16),
											"soldPrice": (cartItems[i].itemPrice * cartItems[i].qty)
										}
									var coll4 = mongo.connectToCollection('userPurchaseHistory');
									// This will show the user last login time
									coll4.insertOne(item, function(err, user){
										if(err){
											throw err;
										}
										if (user) {
												console.log("Item Inserted in userPurchaseHistory DB");
												
												res.code = "200";
												res.value = "Item Inserted in userPurchaseHistory DB";
												callback(null, res);
										} else {
											console.log("Item NOT Inserted in userPurchaseHistory DB");
											
											res.code = "404";
											res.value = "Item NOT Inserted in userPurchaseHistory DB";
											callback(null, res);
										}
									});
									
									//////////////////////////////////////////////////////////////////////////////

									break;
								}
								else if(cartItems[i].itemId === availableItems[j].itemId && cartItems[i].qty > availableItems[j].qtyLeft){
									console.log("Qty of Item more than availability of that item.");
									itemsNotAvailable.push(cartItems[i]);
								}
							}
						}

						if(i === cartItems.length){
							mongo.returnConnectionToPool();
							res.itemsNotAvailable = itemsNotAvailable;
							res.code = "200";
							res.value = "Checkout of Items successful.";
							callback(null, res);
						}

					});
				} else {
					console.log("No Item in DB to checkout");

					res.code = "404";
					res.value = "No Item in DB to checkout";
					callback(null, res);
				}
			});
		});
	}
}

exports.makePayment = makePayment;