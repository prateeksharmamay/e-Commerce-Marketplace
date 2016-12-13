//loading the 'login' angularJS module
//var login = angular.module('login', ['ui.router']);

index.controller('cart', function($scope, $http, $state, $stateParams, data) {
	
	if(data.sessionStatus == false){
		$state.go("login");
	}
	else{
		var itemId, qtyLeft, userEmail;
		$scope.userEmail = data.sessionEmail;
		$scope.itemsList = data.itemsList;
		$scope.cartItemsNo = $scope.itemsList.length;
		$scope.inventoryMsg = true;
		$scope.qty = 1;
		$scope.oldQty = 1;
		$scope.cartTotal = 0;
		$scope.itemWithQtyBought = [];
		
		for(var i = 0; i <  $scope.cartItemsNo; i++){
			$scope.cartTotal += $scope.itemsList[i].itemPrice;
			
			var items = {
					"itemId" : $scope.itemsList[i].itemId,
					"itemName" : $scope.itemsList[i].itemName,
					"itemPrice" : $scope.itemsList[i].itemPrice,
					"qty" : 1,
					"userEmail" : $scope.userEmail
			};
			$scope.itemWithQtyBought.push(items);
		}
		
		$scope.calcTotal = function(itemId,qty,itemPrice){
			
			for(var i = 0; i < $scope.itemWithQtyBought.length;i++){
				if(itemId === $scope.itemWithQtyBought[i].itemId){
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
			
			$http({
				method : "POST",
				url : '/verifyInventory',
				data : {
					"cartItems" : $scope.itemWithQtyBought,
					"userEmail" : $scope.userEmail
				}
			}).success(function(data) {
				//checking the response data for statusCode
				var checkoutFlag = 0;
				if (data.statusCode === 200) {
					var availableItems = data.itemsList;
					
					for(var i = 0; i < $scope.itemWithQtyBought.length; i++){
						for(var j = 0; j < availableItems.length; j++){
							if($scope.itemWithQtyBought[i].itemId === availableItems[j].itemId && $scope.itemWithQtyBought[i].qty <= availableItems[j].qtyLeft){
								checkoutFlag = 1;
								break;
							}
							else if($scope.itemWithQtyBought[i].itemId === availableItems[j].itemId && $scope.itemWithQtyBought[i].qty > availableItems[j].qtyLeft){
								var avail = availableItems.qtyLeft;
								$scope.checkoutMsg += "We only have "+avail+" quantity of "+$scope.itemWithQtyBought.itemName+"<br>";
								checkoutFlag = 0;
								$scope.inventoryMsg = false;
							}
						}
					}
					
					if(checkoutFlag === 1){
						$state.go("checkoutCart", {"itemWithQtyBought" : $scope.itemWithQtyBought, "totalAmount" : $scope.cartTotal, "cartItemsNo":$scope.cartItemsNo});
					}
					else{
						$scope.checkoutMsg = "Item in Card is sold out.";
						checkoutFlag = 0;
						$scope.inventoryMsg = false;
					}
					
				}
				else{
					$scope.inventoryMsg = false;
					$scope.checkoutMsg = data.statusMsg; // Display Items that are not available or how many quantity is available
				}
			}).error(function(error) {
				$scope.error = false;
				$scope.msg = error;
			});
		};
		
		$scope.removeItemFromCart = function(itemId){
			$http({
				method : "POST",
				url : '/removeItemFromCart',
				data : {
					"email" : $scope.userEmail,
					"itemId" : itemId
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
