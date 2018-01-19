(function() {
	'use strict'

	angular
		.module("app", [])
		.controller("controller", controller)
		.config(config);
		

		controller.$inject = ["$http", "$window"];
		function controller($http, $window) {
			var vm = this;
			console.log("IM loading");

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
			}

			//functions for developer
			vm.addDev = function(dev) {
				console.log(dev);
			}
		};

		//include routeProvider & locationProvider to detect your URL changes
		config.$inject = ['$locationProvider'];
		function config($locationProvider) {

			//prettify our urls i.e. remove the hashbang (#) 
			$locationProvider.html5Mode(true);
		}	
})();