//loading the 'login' angularJS module
var login = angular.module('login', ['ui.router']);

login.config(function($stateProvider, $urlRouterProvider, $locationProvider, $urlMatcherFactoryProvider) {
	$urlMatcherFactoryProvider.caseInsensitive(true);
	$locationProvider.html5Mode(true);
	$stateProvider.state('login', {	
		url : '/',
		views: {
            'header': {
                templateUrl : 'templates/header.html',
            },
            'content': {
                templateUrl : 'templates/login.html',
            },
		}
	})
	$urlRouterProvider.otherwise('/');
});




//defining the login controller
login.controller('loginPage', function($scope, $http) {
	//Initializing the 'invalid_login' and 'unexpected_error' 
	//to be hidden in the UI by setting them true,
	//Note: They become visible when we set them to false
	$scope.error = true;
	
	if($scope.msg != '' || $scope.msg != undefined){
		$scope.error = false;
	}
})
