(function() {
	'use strict'

	angular
		.module("app", [])
		.controller("controller", controller)
		.config(config);
		

		controller.$inject = ["$http", "$window", "$scope"];
		function controller($http, $window, $scope) {
			var vm = this;
			console.log("Controller loading");

			$scope.sales_clusters = ['North Cluster', 'South Cluster', 'East Cluster', 'West Cluster', 'Central Cluster', 'Others'];

			vm.cancel = function() {
				$window.location.href = "/home";
			}

			//functions for login
			vm.login = function(user) {
				$http.post('/login', user)

				.then(function(response) {
					// vm.loginError = response.loginError;
					//need to save data after login so we know user's role
					// if (response.data.success) {
					// 	//$window.location.href = "/home";
					// }

					// else {
					// 	$window.location.href = "/login";;
					// }

				}, function() {
					vm.loginError = 'Authentication failed';
				})
			}

			vm.loginFB = function() {
				$window.location = $window.location.protocol + "//" + $window.location.host + $window.location.pathname + "/auth/facebook";
			}

			//functions for register
			vm.signup = function(newUser) {
				$http.post("/register", newUser)

				.then(function(response) {
					console.log("success");
					if (response.data.success) {
						$window.location.href = "/home";
					}

					else {
						$window.location.href = "/register";;
					}

				}, function() {
						vm.registerError = 'Authentication failed';
				})
			}

			//functions for home
			vm.search = function(text) {
				console.log(text);
				$http({
					method: 'GET',
					url: '/search-all',
					params: {name: text}
				}).then(function successCallback(response) {
					$scope.devResults = response.data;
					console.log($scope.devResults);
					
				}, function errorCallback(response) {
					$scope.error = response;
				});
			}

			vm.searchDev = function(text) {
				console.log(text);
				$http({
					method: 'GET',
					url: '/search-developer',
					params: {name: text}
				}).then(function successCallback(response) {
					$scope.devResults = response.data;
					console.log($scope.devResults);
					
				}, function errorCallback(response) {
					$scope.error = response;
				});
			}

			//functions for developer
			vm.addDev = function(dev) {
				console.log(dev);
				$http.post('/submit-developer', {				
					name: dev.developer_name,
					address: dev.developer_address,
					contact_person: dev.contact_person,
					project_name: dev.project_name,
					project_address: dev.project_address,
					project_contact_person: dev.project_contact_person, 
					project_email: dev.project_contact_email, 
					project_phone: dev.project_contact_phone,
					project_commission_rate: dev.project_commission_rate, 
					project_sales_cluster: dev.sales_cluster
					
				})
					.success(function(response) {

					console.log(response);
					
					// TODO: Add error messages
					alert('Developer information insert completed.');
					$window.location.href= '/home';    
					
				})
					.error(function() {
					alert('Developer information insert error.');            
					//vm.alertMessage = 'Failed to insert to database';
				});
				
			}

			// Go to /developer/update with ID parameter
			vm.update = function(id) {
				$window.location.href = "/developer/update" +"?id=" + id;
			}

		};
		

		//include routeProvider & locationProvider to detect your URL changes
		config.$inject = ['$locationProvider'];
		function config($locationProvider) {

			//prettify our urls i.e. remove the hashbang (#) 
			$locationProvider.html5Mode(true);
		}	
})();