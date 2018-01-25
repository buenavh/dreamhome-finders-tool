(function() {
	'use strict'

	angular
		.module("app", [])
		.controller("controller", controller)
		.config(config);
		

		controller.$inject = ["$http", "$window"];
		function controller($http, $window) {
			var vm = this;

			vm.redirectTo = function(url, allow) {
				$http.get('/user-access').then(function (res) {
					console.log(res.data.user);
					if(allow.indexOf(res.data.user.usergroup) > -1) {
						$window.location.href = url;
					}
					else {
						alert('Sorry! You are not allowed to access that page');	
					}
				}, function (err) {
					alert(err);
				});
			}

			vm.cancel = function() {
				$window.location.href = "/home";
			}

			//functions for login
			vm.login = function(user) {
				$http.post('/login', user)

				.then(function(response) {
					//need to save data after login so we know user's role
					if (response.data.success) {
						$window.location.href = "/home";
					}

					else {
						 $window.location.href = "/login";;
					}

				}, function() {
					alert('Authentication failed');
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
						alert('Registration failed');
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
	                //return ({status: "success"});
	                
	            }, function errorCallback(error) {
	                alert(error);
	            });
	        }

			//functions for developer
			vm.addDev = function(dev) {
				$http.post('/submit-developer', dev)

				.then(function (res) {
					alert('Developer information insert completed.');
					$window.location.href= '/home';
				}, function (err) {
					alert('Developer information insert error.');
				});
			}

			vm.editDev = function(id) {
				vm.redirectTo("/developer/update" +"?id=" + id, ['1', '2']);
			}
		};

		//use locationProvider to prettify urls
		config.$inject = ['$locationProvider'];
		function config($locationProvider) {

			//prettify our urls i.e. remove the hashbang (#) 
			$locationProvider.html5Mode(true);
		}	
})();