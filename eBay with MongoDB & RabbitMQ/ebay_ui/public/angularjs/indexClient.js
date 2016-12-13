//loading the 'login' angularJS module
var index = angular.module('index', ['ui.router','ngMaterial', 'ngMdIcons']);

index.config(function($stateProvider, $urlRouterProvider, $locationProvider, $urlMatcherFactoryProvider) {
	$urlMatcherFactoryProvider.caseInsensitive(true);
	//$locationProvider.html5Mode(true);
	$urlRouterProvider.otherwise('/');
	
	$stateProvider
	.state('login', {	
		url : '/',
		templateUrl : '/templates/login.html',
		controller : 'loginPage'
		
	})
	.state('userDashboard', {
		url : '/dashboard/:email',
		templateUrl : '/templates/dashboard.html',
		controller : 'dashboard',
		params:{"email":null},
		resolve: {
	        data: function ($http) {
	            return $http.post("/getAllItemsforUser")
	                    .then(function (response) {
	                        return response.data;
	                    });
	        }
	    }
	})
	.state('userCart', {
		url : '/cart',
		templateUrl : '/templates/cart.html',
		controller : 'cart',
		/*params:{"email":null},*/
		resolve: {
	        data: function ($http) {
	            return $http.post("/getUserCart")
	                    .then(function (response) {
	                        return response.data;
	                    });
	        }
	    } 
	})
	.state('checkoutCart', {
		url : '/checkout',
		templateUrl : '/templates/checkoutCart.html',
		controller : 'checkoutCart',
		params:{"itemWithQtyBought":null, "totalAmount":null,"cartItemsNo":null},
		resolve: {
	        sessionState: function ($http) {
	            return $http.post("/checkActiveUserSession")
	                    .then(function (response) {
	                        return response.data;
	                    });
	        }
	    } 
	})
	.state('sellItem', {
		url : '/sellItem',
		templateUrl : '/templates/sellItem.html',
		controller : 'sellItem',
		params:{"email":null},
		resolve: {
	        data: function ($http) {
	            return $http.post("/checkActiveUserSessionSellItem")
	                    .then(function (response) {
	                        return response.data;
	                    });
	        }
	    } 
	})
	.state('auction', {
		url : '/auction',
		templateUrl : '/templates/auctionPage.html',
		controller : 'auctionPage',
		params:{"email":null},
		resolve: {
	        data: function ($http) {
	            return $http.post("/getBiddableItemsforUser")
	                    .then(function (response) {
	                        return response.data;
	                    });
	        }
	    } 
	})
	.state('sellingHistory', {
		url : '/sellingHistory',
		templateUrl : '/templates/sellingHistory.html',
		controller : 'sellingHistory',
		params:{"email":null},
		resolve: {
	        data: function ($http) {
	            return $http.post("/sellingHistory")
	                    .then(function (response) {
	                        return response.data;
	                    });
	        }
	    } 
	})
	.state('purchaseHistory', {
		url : '/purchaseHistory',
		templateUrl : '/templates/purchaseHistory.html',
		controller : 'purchaseHistory',
		params:{"email":null},
		resolve: {
	        data: function ($http) {
	            return $http.post("/purchaseHistory")
	                    .then(function (response) {
	                        return response.data;
	                    });
	        }
	    } 
	})
	.state('profile', {
		url : '/profile',
		templateUrl : '/templates/userProfile.html',
		controller : 'profile',
		params:{"email":null},
		resolve: {
	        data: function ($http) {
	            return $http.post("/getProfileDetails")
	                    .then(function (response) {
	                        return response.data;
	                    });
	        }
	    } 
	})
	.state('logout', {	
		url : '/logout',
		templateUrl : '/templates/logout.html',
		controller : 'logoutPage'
		
	});
});