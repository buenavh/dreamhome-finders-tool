// developer.controller.js

(function() {
	'use strict'

	angular
		.module("app")
		.controller("DevController", DevController);
	
	DevController.$inject = ['$scope', '$http', '$window'];
	function DevController($scope, $http, $window) {
		var vm = this;

		$scope.clusters = ['North Cluster', 'South Cluster', 'East Cluster', 'West Cluster', 'Central Cluster', 'Others'];
		
		vm.submitDeveloper = function() {
			$http.post('/submit-developer', {
				name: vm.name,
				address: vm.address,
				contact_person: vm.contact,
				project_developer_subsidiary_name: vm.name,
				project_name: vm.projName,
				project_address: vm.projAdd,
				project_contact_person: vm.projContPerson, 
				project_email: vm.projContEmail, 
				project_phone: vm.projContPhone,
				project_commission_rate: vm.projComRate, 
				project_sales_cluster: vm.salesCluster
				
            })
                .success(function(response) {
				
				// TODO: Add error messages
				vm.alertMessage = response.alertMessage;
				$window.location.href= '/login';    
				
            })
                .error(function() {            
				vm.alertMessage = 'Failed to insert to database';
            });

	
			
		}

		
	};
})();
