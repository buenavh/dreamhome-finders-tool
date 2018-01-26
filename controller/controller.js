(function() {
	'use strict'

	angular
		.module("app", [])
		.controller("controller", controller)
		.service('LoginService', function () {
            this.checkEmailPattern = function (email, ugroup) {
                var email_test;
                var email_regex;

                if (ugroup === '1' || ugroup === '2') {
             	     email_regex = /^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(dhfi)\.com$/g;
                    email_test= email_regex.test(email);
                } else {
                    email_regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
					email_test = email_regex.test(email);
                }
                
                return email_test;
            }
        })
		.config(config);

		controller.$inject = ["$scope", "$http", "$window", "LoginService"];
		function controller($scope, $http, $window, LoginService) {
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
				console.log(newUser);

				$scope.email_test = LoginService.checkEmailPattern(newUser.email, newUser.ugroup);
				
				if (newUser.ugroup === '1' || newUser.ugroup === '2') {
					if ($scope.email_test === true && typeof newUser.password !== 'undefined') {
						registerUser(newUser);
					} else if ($scope.email_test === false) {
						$window.alert("Enter a valid dhfi.com email address if you have selected USER GROUP " + newUser.ugroup + '. Please select USER GROUP 3.');

					} else {
						$window.alert("Please enter a password");
					}

				} else {
					if ($scope.email_test === true) {
						newUser.password = 'test';
						registerUser(newUser);
					} else {
						$window.alert("Please enter a valid email address");
					}
				}	

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


			function registerUser(newUser) {
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

		};

		//use locationProvider to prettify urls
		config.$inject = ['$locationProvider'];
		function config($locationProvider) {

			//prettify our urls i.e. remove the hashbang (#) 
			$locationProvider.html5Mode(true);
		}	
})();
