//loading the 'login' angularJS module
//var login = angular.module('login', ['ui.router']);

index.controller('auctionPage', function($scope, $http, $state, $stateParams, data) {
	
	if(data.sessionStatus == false){
		$state.go("login");
	}
	else{
		$scope.userEmail = data.sessionEmail;
		$scope.bidPlaced = true;
		$scope.biddableItemList = data.itemsList;
		
		$scope.placeBid = function(item,bidAmount){
			$http({
				method : "POST",
				url : '/addBidToItem',
				data : {
					"email" : $scope.userEmail,
					"itemId" : item._id,
					"bidAmount" : bidAmount
				}
			}).success(function(data) {
				//checking the response data for statusCode
				if (data.statusCode == 200) {
					$scope.bidPlaced = false;
					$scope.bidStatus = "Bid Placed for "+item.itemName;
				}
				else{
					$scope.bidPlaced = false;
					$scope.bidStatus = "Bid Placed for "+item.itemName;
				}
			}).error(function(error) {
				$scope.error = false;
				$scope.msg = error;
			});
		};
	}
});
