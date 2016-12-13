//loading the 'login' angularJS module
//var login = angular.module('login', ['ui.router']);

index.controller('profile', function($scope, $http, $state, $stateParams, data) {
	
	if(data.sessionStatus == false){
		$state.go("login");
	}
	else if(data.statusCode == 405){
		alert("Connection Problem. Please try again !!!");
	}
	else{
		$scope.userEmail = data.sessionEmail;
		$scope.userDetails = data.userDetails;
		$scope.profileUpdated = true;
		
		$scope.user = {
				"fname" : $scope.userDetails.fname,
				"lname" : $scope.userDetails.lname, 
				"ebayHandle" : $scope.userDetails.ebayHandle,
				"dob" : $scope.userDetails.dob,
				"contact" : $scope.userDetails.contact,
				"location" : $scope.userDetails.location
			};
		
		$scope.updateProfile = function(bidFlag){

			$http({
				method : "POST",
				url : '/setProfileDetails',
				data : {
					"email" : $scope.userEmail,
					"userDetails" : $scope.user
				}
			}).success(function(data) {
				//checking the response data for statusCode
				if (data.statusCode === 200) {
					$scope.profileUpdated = false;
					$scope.msg = "User Profile has been Updated";
				}
				else{
					$scope.profileUpdated = false;
					$scope.msg = "Connection Error. Please try after some time.";
				}
			}).error(function(error) {
				$scope.error = false;
				$scope.msg = error;
			});
		};
	}
});
