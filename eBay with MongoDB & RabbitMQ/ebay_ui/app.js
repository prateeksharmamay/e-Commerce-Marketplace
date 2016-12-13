// To include node modules
var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser');

// To include local routes

var login = require('./routes/login')
, dashboard = require("./routes/dashboard")
, updateUserProfile = require('./routes/updateUserProfile')
, logout = require('./routes/logout')
, checkoutCart = require('./routes/checkoutCart')
, items = require('./routes/items')
, auctionPage = require('./routes/auctionPage')
, cart = require('./routes/cart')
, sellingHistory = require('./routes/sellingHistory')
, purchaseHistory = require('./routes/purchaseHistory')
,registerWithoutR = require('./routes/registerWithoutR');


// To include passportJS
var passport = require('passport');
require('./routes/passport')(passport);

// To include Mongodb & Express-Session initialization related statements
var mongo = require("./routes/mongo");
var mongoSessionURL = "mongodb://localhost:27017/ebay";
var expressSessions = require("express-session");
var mongoStore = require("connect-mongo/es5")(expressSessions);

///////////////////////////////////////////////////////////
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));
///////////////////////////////////////////////////////////
// Initialize Express Sessions in Mongo Store
app.use(expressSessions({
	  secret: "CMPE273_passport",
	  resave: false,
	  saveUninitialized: false,
	  duration: 30 * 60 * 1000,
	  activeDuration: 5 * 6 * 1000,
	  store: new mongoStore({
	    url: mongoSessionURL
	  })
	}));
///////////////////////////////////////////////////////////
app.use(app.router);

app.use(passport.initialize());
///////////////////////////////////////////////////////////

// Handling Errors
	//catch 404 and forward to error handler
	app.use(function(req, res, next) {
	  var err = new Error('Not Found');
	  err.status = 404;
	  next(err);
	});
	
	// error handlers
	
	// development error handler
	// will print stacktrace
	if (app.get('env') === 'development') {
	  app.use(function(err, req, res, next) {
	    res.status(err.status || 500);
	    res.render('error', {
	      message: err.message,
	      error: err
	    });
	  });
	}
	
	// production error handler
	// no stacktraces leaked to user
	app.use(function(err, req, res, next) {
	  res.status(err.status || 500);
	  res.render('error', {
	    message: err.message,
	    error: {}
	  });
	});

/////////////////////////////////////////////////////////
// To handle requests

app.get('/', routes.index);

app.post('/signin', function(req, res, next) {
	passport.authenticate('login', function(err, username, info) {
		var json_responses;
		
		if(err) {
//			return next(err);
			json_responses = {"statusMsg" : "Connection Error", "statusCode" : 405};
			
			return res.send(json_responses);
		}
		
		else{
			if(!username) {
				json_responses = {"statusMsg" : "Invalid Login", "statusCode" : 404, "email": null};
				
				return res.send(json_responses);
			}
			
			else{
				req.logIn(username, {session:false}, function(err) {
					if(err) {
						return next(err);
					}
					
					req.session.email = username;
					console.log("Session Initilized");
					
					json_responses = {"statusMsg" : "Valid Login", "statusCode" : 200, "email": username};
					
					return res.send(json_responses);
				});
			}
		}
	})(req, res, next);
});

/*app.get('/login', isAuthenticated, function(req, res) {
	res.render('', {user:{username: req.session.user}});
});

function isAuthenticated(req, res, next) {
	if(req.session.user) {
		console.log(req.session.user);
		return next();
	}

	res.redirect('/');
}*/

app.post('/signup', login.signup);
//app.post('/signup', registerWithoutR.signup);
app.post('/logout', logout.signout);
app.post('/getAllItemsforUser', dashboard.getAllItems);
app.post('/getProfileDetails', updateUserProfile.getProfileDetails);
app.post('/setProfileDetails', updateUserProfile.setProfileDetails);
app.post('/checkActiveUserSession', checkoutCart.checkActiveUserSession);
app.post('/checkActiveUserSessionSellItem', items.checkActiveUserSessionSellItem);
app.post('/addItem', items.addItem);
app.post('/addItemToUserCart', dashboard.addItemToUserCart);
app.post('/getUserCart', cart.getUserCart);
app.post('/removeItemFromCart', cart.removeItemFromCart);
app.post('/makePayment', checkoutCart.makePayment);
app.post('/addBidToItem', auctionPage.addBidToItem);
app.post('/getBiddableItemsforUser', auctionPage.getBiddableItemsforUser);
app.post('/sellingHistory', sellingHistory.getSellingHistory);
app.post('/purchaseHistory', purchaseHistory.getPurchaseHistory);

/////////////////////////////////////////////////////////
	


var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});  
module.exports = server;
/**
//connect to the mongo collection session and then createServer
var server;
mongo.connect(mongoSessionURL, function(err,connection){
	if(err){
		console.log(err);
	}
	console.log('Connected to mongo at: ' + mongoSessionURL);
	server = http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});  
});
module.exports = server;
*/