//loading the 'login' angularJS module
//var login = angular.module('login', ['ui.router']);

index.controller('checkoutCart', function($scope, $http, $state, $stateParams, sessionState) {
	
	if(sessionState.sessionStatus == false){
		$state.go("login");
	}
	else{
		$scope.userEmail = sessionState.sessionEmail;
		$scope.cartItems = $stateParams.itemWithQtyBought;
		$scope.totalAmount = $stateParams.totalAmount;
		$scope.cartItemsNo = $stateParams.cartItemsNo;
		console.log($scope.cartItems);
		$scope.paymentNotification = true;
		$scope.errorNotification = true;

		if($scope.totalAmount=== null || $scope.cartItemsNo === null){
			$scope.totalAmount = 0;
			$scope.cartItemsNo = 0;
		}
		
		$scope.creditcard = {
			      ccNumber: '',
			      expiryDate: '',
			      cvv: '',
			      firstName: '',
			      lastName: '',
			      address: '',
		};

		$scope.makePayment = function(){
			
			if($scope.creditcard.ccNumber==='' || $scope.creditcard.expiryDate==='' || $scope.creditcard.cvv==='' || $scope.creditcard.firstName==='' || 
					$scope.creditcard.lastName==='' || $scope.creditcard.address===''){
				$scope.errorNotification = false;
				$scope.errorMsg = "You have left one or more required fields empty.";
			}
			
			else{
				$http({
					method : "POST",
					url : '/makePayment',
					data : {
						"userEmail" : $scope.userEmail,
						"cartItems" : $scope.cartItems,
						"ccNo" : $scope.creditcard.ccNumber,
						"expiryDate" : $scope.creditcard.expiryDate,
						"cvv" : $scope.creditcard.cvv
					}
				}).success(function(data) {
					//checking the response data for statusCode
					if (data.statusCode === 200) {
						$scope.paymentNotification = false;
						$scope.stopPayment = true;
						$scope.errorNotification = true;
						if(data.itemsNotAvailable.length == 0){
							$scope.paymentMsg = "Payment Successful. Thank You for Shopping with us.";
						}
						else{
							$scope.paymentMsg = "Payment Successful. Thank You for Shopping with us. Item "+data.itemsNotAvailable[0].itemName+" was not available";
						}
						
					}
					else if(data.statusCode === 420){
						$scope.errorNotification = false;
						$scope.errorMsg = data.statusMsg;
					}
					else{
						$scope.errorNotification = false;
						$scope.errorMsg = data.statusMsg;
					}
				}).error(function(error) {
					$scope.error = false;
					$scope.msg = error;
				});
			}
			
		}
	}
});
