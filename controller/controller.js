(function() {
	'use strict'

	angular
		.module("app", [])
		.controller("controller", controller)
		.config(config);
		

		controller.$inject = ["$http", "$window"];
		function controller($http, $window) {
			var vm = this;

			vm.cancel = function() {
				$window.location.href = "/home";
			}

			//functions for login
			vm.login = function(user) {
				$http.post('/login', user)

				.then(function(response) {
					// vm.loginError = response.loginError;
					//need to save data after login so we know user's role
					if (response.data.success) {
						// test res redirect as well
						$window.location.href = "/home";
					}

					else {
						 $window.location.href = "/login";;
					}

				}, function() {
					vm.loginError = 'Authentication failed';
				})
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

				}, function () {
						vm.registerError = 'Authentication failed';
				})
			}

			//functions for home
			vm.search = function(text) {
	            $http({
	                method: 'GET',
	                url: '/search-all',
	                params: {name: text}
            	})

	            .then(function successCallback(response) {
	                vm.searchResults = response.data;
	                return ({status: "success"});
	                
	            }, function errorCallback(error) {
	                vm.error = error;
	                console.log(error);
	            });
	        }

			//functions for developer
			vm.addDev = function(dev) {
				console.log(dev);

				$http.post('/submit-developer', dev)

				.then(function (res) {
					console.log(res);
					alert('Developer information insert completed.');
					$window.location.href= '/home';
				}, function (err) {
					console.log(err);
					alert('Developer information insert error.');
				});
			}

			vm.editDev = function(id) {
				$window.location.href = "/developer/update" +"?id=" + id;
			}
		};

		//use locationProvider to prettfy urls
		config.$inject = ['$locationProvider'];
		function config($locationProvider) {

			//prettify our urls i.e. remove the hashbang (#) 
			$locationProvider.html5Mode(true);
		}	
})();