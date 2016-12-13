//loading the 'login' angularJS module
//var login = angular.module('login', ['ui.router']);

index.controller('dashboard', function($scope, $http, $state, $stateParams, data) {
	
	if(data.sessionStatus == false){
		$state.go("login");
	}
	else{
		$scope.userEmail = data.sessionEmail;
		$scope.itemsList = data.itemsList;
		$scope.addedToCart = true;
		$scope.lastLoginTime = data.loginTimeData[0].lastLoginTime;
		
		$scope.addToCart = function(item){
			$http({
				method : "POST",
				url : '/addItemToUserCart',
				data : {
					"email" : $scope.userEmail,
					"itemId" : item.itemId
				}
			}).success(function(data) {
				//checking the response data for statusCode
				if (data.statusCode === 200) {
					$scope.addedToCart = false;
					$scope.cartMsg = item.itemName+" added to your cart.";
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
