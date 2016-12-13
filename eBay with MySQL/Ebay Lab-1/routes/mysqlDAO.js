// WITH CONNECTION POOLING
var ejs= require('ejs');
var mysql = require('mysql');
var connectionsInPool = [];
var connection;

// Create 5 Connections in Pool

for(var i = 0; i < 500; i++){
	var connection = mysql.createConnection({
	    host     : 'localhost',
	    user     : 'root',
	    password : 'system123#',
	    database : 'ebay',
	    port	 : 3306
	});
	
	connectionsInPool.push(connection);
}

console.log("Number of Connections in Pool: "+ connectionsInPool.length);

//Put your mysql configuration settings - user, password, database and port
function getConnection(){
	if(connectionsInPool.length > 0){
		connection = connectionsInPool.pop();
		console.log("Connections left in Pool: "+ connectionsInPool.length);
		return connection;
	}
	else{
		setInterval(function(){ 
			console.log("Connections left in Pool: "+ connectionsInPool.length);
			console.log("No Connection in Pool");
			getConnection(); 
			}, 1);
	}
}

function returnConnectionToPool(connection){
	connectionsInPool.push(connection);
	console.log("Connections Added to Pool. Now No. in Pool: "+ connectionsInPool.length);
}

exports.fetchDataWithParams = function(sqlQuery,params,callback){
	
	console.log("\nSQL Query::"+sqlQuery);
	console.log("\nparams::"+params);
	
	var connection=getConnection();
	console.log("DB successful connection !!!");
	
	connection.query(sqlQuery, params, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			console.log("DB Results:"+rows);
			callback(err, rows);
		}
	});
	console.log("\nConnection closed..");
	returnConnectionToPool(connection);
};

exports.fetchData = function(sqlQuery,callback){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	var connection=getConnection();
	
	console.log("DB successful connection !!!");
	
	connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			console.log("DB Results:"+rows);
			callback(err, rows);
		}
	});
	console.log("\nConnection closed..");
	returnConnectionToPool(connection);
};

exports.insertData = function(sqlQuery, params,callback){
	
	console.log("\nSQL Query::"+sqlQuery);
	console.log("\nparams::"+params);
	
	var connection=getConnection();
	
	connection.query(sqlQuery, params, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			console.log("DB Results:"+rows);
			callback(err, rows);
		}
	});
	console.log("\nConnection closed..");
	returnConnectionToPool(connection);
};



/*
 * WITHOUT CONNECTION POOLING
 */
/*
var ejs= require('ejs');
var mysql = require('mysql');

//Put your mysql configuration settings - user, password, database and port
function getConnection(){
	var connection = mysql.createConnection({
	    host     : 'localhost',
	    user     : 'root',
	    password : 'system123#',
	    database : 'ebay',
	    port	 : 3306
	});
	return connection;
}


exports.fetchDataWithParams = function(sqlQuery,params,callback){
	
	console.log("\nSQL Query::"+sqlQuery);
	console.log("\nparams::"+params);
	
	var connection=getConnection();
	
	console.log("DB successful connection !!!");
	
	connection.query(sqlQuery, params, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			console.log("DB Results:"+rows);
			callback(err, rows);
		}
	});
	console.log("\nConnection closed..");
	connection.end();
};

exports.fetchData = function(sqlQuery,callback){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	var connection=getConnection();
	
	console.log("DB successful connection !!!");
	
	connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			console.log("DB Results:"+rows);
			callback(err, rows);
		}
	});
	console.log("\nConnection closed..");
	connection.end();
};

exports.insertData = function(sqlQuery, params,callback){
	
	console.log("\nSQL Query::"+sqlQuery);
	console.log("\nparams::"+params);
	
	var connection=getConnection();
	
	connection.query(sqlQuery, params, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			console.log("DB Results:"+rows);
			callback(err, rows);
		}
	});
	console.log("\nConnection closed..");
	connection.end();
};*/