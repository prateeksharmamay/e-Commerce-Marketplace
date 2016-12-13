//loading the 'login' angularJS module
//var login = angular.module('login', ['ui.router']);

index.controller('cart', function($scope, $http, $state, $stateParams, data) {
	
	if(data.sessionStatus == false){
		$state.go("login");
	}
	else{
		var _id, qtyLeft, userEmail;
		$scope.userEmail = data.sessionEmail;
		$scope.itemsList = data.itemsList;
		$scope.cartItemsNo = $scope.itemsList.length;
		$scope.inventoryMsg = true;
		$scope.qty = 1;
		$scope.oldQty = 1;
		$scope.cartTotal = 0;
		$scope.itemWithQtyBought = [];
		
		for(var i = 0; i <  $scope.cartItemsNo; i++){
			$scope.cartTotal += Number($scope.itemsList[i].itemPrice);
			
			var items = {
					"_id" : $scope.itemsList[i]._id,
					"itemName" : $scope.itemsList[i].itemName,
					"itemPrice" : $scope.itemsList[i].itemPrice,
					"qty" : 1,
					"userEmail" : $scope.userEmail
			};
			$scope.itemWithQtyBought.push(items);
		}
		
		$scope.calcTotal = function(_id,qty,itemPrice){
			
			for(var i = 0; i < $scope.itemWithQtyBought.length;i++){
				if(_id === $scope.itemWithQtyBought[i]._id){
					var calcQty;
					if(qty > $scope.itemWithQtyBought[i].qty){
						calcQty = qty - $scope.itemWithQtyBought[i].qty;
						$scope.cartTotal += ($scope.itemWithQtyBought[i].itemPrice * calcQty);
					}
					else{
						calcQty = $scope.itemWithQtyBought[i].qty - qty;
						$scope.cartTotal -= ($scope.itemWithQtyBought[i].itemPrice * calcQty);
					}
					
					$scope.itemWithQtyBought[i].qty = qty;
				}
			}
		};
		
		$scope.checkoutStateTransition = function(){
			$state.go("checkoutCart", {"itemWithQtyBought" : $scope.itemWithQtyBought, "totalAmount" : $scope.cartTotal, "cartItemsNo":$scope.cartItemsNo});
		};
		
		$scope.removeItemFromCart = function(_id){
			$http({
				method : "POST",
				url : '/removeItemFromCart',
				data : {
					"email" : $scope.userEmail,
					"_id" : _id
				}
			}).success(function(data) {
				//checking the response data for statusCode
				if (data.statusCode === 200) {
					$state.reload();
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
