/**

 */
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mq_client = require('../rpc/client');
var logger = require('./logger');

module.exports = function(passport) {
	passport.use('login', new LocalStrategy(
			{
				usernameField: 'email',
				passwordField: 'password',
				session: false
			},
			function(username, password, done) {
				
				process.nextTick(function(){
					var json_responses;

					console.log("email:"+username);
					console.log("password:"+password);

					var msg_payload = { "email": username, "password": password};
					
					
					console.log("In POST Request = UserName:"+ username);

					mq_client.make_request('login_queue',msg_payload, function(error,user){
						console.log("User: "+user);
						if(error) {
							console.log("Error Occured: "+error);
							return done(error);
						}
						else{
							if(user.code == 404) {
								logger.clickEventsFileLogger.debug("Button: Sign In | "+"UserID:"+username+" | Description:Failed Login");
								return done(null, false);
							}

							else{
								console.log(username);
								logger.clickEventsFileLogger.debug("Button: Sign In | "+"UserID:"+username+" | Description:Successful Login");
								done(null, username);
							}
						}
					});
				});
			}));
};


