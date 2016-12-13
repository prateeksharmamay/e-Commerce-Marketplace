//loading the 'login' angularJS module
//var login = angular.module('login', ['ui.router']);

index.controller('profile', function($scope, $http, $state, $stateParams, data) {
	
	if(data.sessionStatus == false){
		$state.go("login");
	}
	else{
		$scope.userEmail = data.sessionEmail;
		$scope.userDetails = data.userDetails;
		$scope.profileUpdated = true;
		
		$scope.user = {
				"fname" : $scope.userDetails[0].fname,
				"lname" : $scope.userDetails[0].lname, 
				"ebayHandle" : $scope.userDetails[0].ebayHandle,
				"dob" : $scope.userDetails[0].dob,
				"contact" : $scope.userDetails[0].contact,
				"location" : $scope.userDetails[0].location
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
				/*else{
					
				}*/
			}).error(function(error) {
				$scope.error = false;
				$scope.msg = error;
			});
		};
	}
});
