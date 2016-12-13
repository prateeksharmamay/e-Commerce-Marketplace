//loading the 'login' angularJS module
var sCart = angular.module('ebay', []);
//defining the login controller
sCart.controller('shoppersCart', function($scope, $http) {
	//Initializing the 'invalid_login' and 'unexpected_error' 
	//to be hidden in the UI by setting them true,
	//Note: They become visible when we set them to false

	$scope.itemsList = [
	                    {"itemName":"Laptop", "price":400},
	                    {"itemName":"Xbox", "price":200},
	                    {"itemName":"iPhone 7", "price":650}
	                   ];
	
	$scope.cart = [];
	$scope.displayCart = [];
	
	$scope.invalidMsg = true;
	$scope.validMsg = true;
	$scope.ITable = true;
	
	$scope.addToCart = function(itemName) {

		//console.log("$scope.sourceDestination.source"+$scope.sourceDestination.source);
		//console.log("$scope.sourceDestination.destination"+$scope.sourceDestination.destination);

		for(var i = 0 ; i < $scope.itemsList.length; i++){
			if($scope.itemsList[i].itemName == itemName){
				$scope.cart.push($scope.itemsList[i]);
			}
		}
		console.log($scope.cart);
	}
	
	$scope.viewCart = function() {
		$http({
			method : "POST",
			url : '/viewCart',
			data : {
				
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				$scope.msg = "";
				/*$scope.invalidMsg = false;
				$scope.validMsg = true;*/
			}
			else{
				console.log("data.userCart:"+data.userCart);
				
				$scope.displayCart = data.userCart;
				
				$scope.ITable = false;
				//$scope.validMsg = false;
				//$scope.invalidMsg = true;
			}
		}).error(function(error) {
			$scope.msg = error;
			$scope.invalidMsg = false;
		});
		
	}
	
	$scope.buildCart = function() {
		/* Future Enhancement
		 	if(cart.length == ) then send cart = '' in get request
		 	else then send cart with objects in db
		 */
		console.log($scope.cart);
		$http({
			method : "POST",
			url : '/buildShoppingCart',
			data : {
				"cart" : $scope.cart
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				$scope.msg = "";
				/*$scope.invalidMsg = false;
				$scope.validMsg = true;*/
			}
			else{
				console.log("data.userCart:"+data.userCart);
				
				$scope.displayCart = data.userCart;
				
				$scope.ITable = false;
				//$scope.validMsg = false;
				//$scope.invalidMsg = true;
			}
		}).error(function(error) {
			$scope.msg = error;
			$scope.invalidMsg = false;
		});
	};
	
	$scope.logoutUser = function() {
		window.location.assign("/logout");
	}
	
})
