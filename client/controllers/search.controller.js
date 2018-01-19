// user.controller.js

(function() {
	'use strict'

	angular
		.module("app")
		.controller("SearchController", SearchController);
	
    SearchController.$inject = ['$scope', '$http'];
	function SearchController($scope, $http) {
        var vm = this;
        
        vm.searchDeveloper = function() {
            console.log(vm.devName);
            $http({
                method: 'GET',
                url: '/search-developer',
                params: {name: vm.devName}
            }).then(function successCallback(response) {
                $scope.devResults = response.data;
                console.log($scope.devResults);
                
            }, function errorCallback(response) {
                $scope.error = response;
            });
        }
	};
})();