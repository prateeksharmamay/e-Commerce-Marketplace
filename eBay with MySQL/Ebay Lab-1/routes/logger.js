/**
 * Routes file for Login
 */
var winston = require('winston');

winston.setLevels( winston.config.npm.levels );
winston.addColors( winston.config.npm.colors );

module.exports.biddingFileLogger = new( winston.Logger )( {
	transports: [
	             new winston.transports.Console( {
	            	 level: 'debug', 
	            	 colorize: true
	             } ),
	             new winston.transports.File( {
	            	 level: 'debug',
	            	 timestamp : function(){ return Date();},
	            	 filename: 'biddingFileLogger.log',
	            	 handleExceptions: true,
	            	 json: true,
	            	 eol:"\n"
	             } )
	             ] 
} );

module.exports.clickEventsFileLogger = new( winston.Logger )( {
	transports: [
	             new winston.transports.Console( {
	            	 level: 'debug', 
	            	 colorize: true
	             } ),
	             new winston.transports.File( {
	            	 level: 'debug',
	            	 timestamp : function(){ return Date();},
	            	 filename: 'clickEventsFileLogger.log',
	            	 handleExceptions: true,
	            	 json: true,
	            	 eol:"\n"
	             } )
	             ] 
} );