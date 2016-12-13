//loading the 'login' angularJS module
//var login = angular.module('login', ['ui.router']);

index.controller('sellItem', function($scope, $http, $state, $stateParams, data) {
	
	if(data.sessionStatus == false){
		$state.go("login");
	}
	else{
		$scope.userEmail = data.sessionEmail;
		$scope.itemsList = data.itemsList;
		$scope.itemAdded = true;
		
		$scope.addToItemList = function(bidFlag){
			
			if(bidFlag === 0){
				$scope.item = {
						"sellerName" : data.userDetails.fname+' '+data.userDetails.lname,
						"itemName" : $scope.itemName,
						"itemDescription" : $scope.itemDescription, 
						"itemPrice" : $scope.itemPrice,
						"qty" : parseInt($scope.itemQty),
						"qtyLeft" : parseInt($scope.itemQty),
						"bidFlag" : 0,
						"shippingFrom" : $scope.sellerLocation,
						"listDate" : null,
						"auctionEndDate" : null
					};
			}
			else{
				$scope.item = {
						"sellerName" : data.userDetails.fname+' '+data.userDetails.lname,
						"itemName" : $scope.itemName,
						"itemDescription" : $scope.itemDescription, 
						"itemPrice" : $scope.itemPrice,
						"qty" : 1,
						"qtyLeft" : 1,
						"bidFlag" : 1,
						"shippingFrom" : $scope.sellerLocation,
						"listDate" : null,
						"auctionEndDate" : null,
						"bidPrice":0
					};
			}
			
			
			$http({
				method : "POST",
				url : '/addItem',
				data : {
					"email" : $scope.userEmail,
					"item" : $scope.item
				}
			}).success(function(data) {
				//checking the response data for statusCode
				if (data.statusCode === 200) {
					$scope.itemAdded = false;
					$scope.itemMsg = "Item has been Added";
				}
				/*else{
					
				}*/
			}).error(function(error) {
				$scope.error = false;
				$scope.msg = error;
			});
		};
	}
});
