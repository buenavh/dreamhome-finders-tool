// user.controller.js

(function() {
	'use strict'

	angular
		.module("app")
		.controller("UserController", UserController);
	
	UserController.$inject = [];
	function UserController() {
		var vm = this;
	};
})();