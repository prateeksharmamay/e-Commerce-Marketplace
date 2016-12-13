//loading the 'login' angularJS module
//var login = angular.module('login', ['ui.router']);

index.controller('purchaseHistory', function($scope, $http, $state, $stateParams, data) {
	
	if(data.sessionStatus == false){
		$state.go("login");
	}
	else{
		$scope.userEmail = data.sessionEmail;
		$scope.bidPlaced = true;
		$scope.biddableItemList = data.itemsList;
		
	}
});
