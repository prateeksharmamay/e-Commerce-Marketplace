
/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes')
, http = require('http')
, path = require('path')
, login = require('./routes/login')
, logout = require('./routes/logout')
, cart = require('./routes/cart')
, checkoutCart = require('./routes/checkoutCart')
, items = require('./routes/items')
, auctionPage = require('./routes/auctionPage')
, sellingHistory = require('./routes/sellingHistory')
, purchaseHistory = require('./routes/purchaseHistory')
, updateUserProfile = require('./routes/updateUserProfile')
, session = require('client-sessions');


var dashboard = require("./routes/dashboard");

var app = express();

app.use(session({   
	  
	cookieName: 'session',    
	secret: 'cmpe273_ebay_lab',    
	duration: 30 * 60 * 1000,    //setting the time for active session
	activeDuration: 5 * 60 * 1000,  
})); // setting time for the session to be active when the window is open // 5 minutes set currently

//all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//development only
if ('development' === app.get('env')) {
	app.use(express.errorHandler());
}

//GET Requests
app.get('/', routes.index);
app.post('/signin',login.signin);
app.post('/signup',login.signup);
app.post('/getAllItemsforUser', dashboard.getAllItems);
app.post('/addItemToUserCart', dashboard.addItemToUserCart);
app.post('/getUserCart', cart.getUserCart);
app.post('/removeItemFromCart', cart.removeItemFromCart);
app.post('/verifyInventory', cart.verifyInventory);
app.post('/checkActiveUserSession', checkoutCart.checkActiveUserSession);
app.post('/makePayment', checkoutCart.makePayment);
app.post('/addItem', items.addItem);
app.post('/getBiddableItemsforUser', auctionPage.getBiddableItemsforUser);
app.post('/addBidToItem', auctionPage.addBidToItem);
app.post('/sellingHistory', sellingHistory.getSellingHistory);
app.post('/purchaseHistory', purchaseHistory.getPurchaseHistory);
app.post('/getProfileDetails', updateUserProfile.getProfileDetails);
app.post('/setProfileDetails', updateUserProfile.setProfileDetails);
app.post('/logout', logout.signout);

	var server = http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});  
	module.exports = server;