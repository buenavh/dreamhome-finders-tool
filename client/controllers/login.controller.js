//login.controller.js

(function() {
	'use strict'

	angular
		.module("app")
		.controller("LoginController", LoginController);
	
	LoginController.$inject = ['$scope', '$http', '$window'];
	function LoginController($scope, $http, $window) {
		var vm = this;

		vm.login = function() {
			var password = vm.password;
			var email = vm.email;

			$http.post('/login', {
                email: email,
                password: password
            })
                .success(function(response) {
				
				// TODO: Add error messages
				vm.loginError = response.loginError;
				
            })
                .error(function() {            
				vm.loginError = 'Authentication failed.';
            });
		}

		vm.loginFB = function() {
			$window.location = $window.location.protocol + "//" + $window.location.host + $window.location.pathname + "/auth/facebook";

		}
	};
})();