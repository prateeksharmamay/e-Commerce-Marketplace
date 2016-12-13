
index.controller('logoutPage', function($scope, $http, $state) {
	console.log("In logoutPage Controller");
	$scope.error = true;
	$scope.error1 = true;
	var vm = this;
	
	$http({
		method : "POST",
		url : '/logout',
	}).success(function(data) {
		//checking the response data for statusCode
		if (data.statusCode === 200) {
			$scope.error = false;
			$scope.msg = "Signed Out Successfully";
		}
		else{
			$scope.error = false;
			$scope.msg = "Error in Sign Out";
		}
	}).error(function(error) {
		$scope.msg = error;
	});
	
$scope.registerUser = function(){
		
	if($scope.email != $scope.emailCopy){
		$scope.error = false;
		$scope.msg = "You have entered different emails ";
	}

	else{
		$http({
			method : "POST",
			url : '/signup',
			data : {
				"email" : $scope.email,
				"password" : $scope.password,
				"fname" : $scope.fname,
				"lname" : $scope.lname,
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode === 404) {
				$scope.error1 = false;
				$scope.msg = data.statusMsg;
			}
			else{
				$scope.error1 = false;
				$scope.msg = data.statusMsg;
			}
		}).error(function(error) {
			$scope.msg = error;
		});

	}
	};

	$scope.signin = function(){
		console.log("In Signin");
		if($scope.email == undefined || $scope.password == undefined){
			$scope.msg = "Email or Password is empty";
			$scope.error = false;
		}
		
		else{
			$http({
				method : "POST",
				url : '/signin',
				data : {
					"email" : $scope.email,
					"password" : $scope.password
				}
			}).success(function(data) {
				//checking the response data for statusCode
				if (data.statusCode === 404) {
					$scope.error = false;
					$scope.msg = data.statusMsg;
				}
				else{
					$state.go("userDashboard", {"email" : data.email});
				}
			}).error(function(error) {
				$scope.error = false;
				$scope.msg = error;
			});
		}
	};
});