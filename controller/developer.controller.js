(function() {
	'use strict'

	angular
		.module("app", [])
		.controller("DeveloperCtrl", DeveloperCtrl)
		.config(config);
		

		DeveloperCtrl.$inject = ["$http", "$window", "$scope", "$location"];
		function DeveloperCtrl($http, $window, $scope, $location) {
			var vm = this;
			console.log("DeveloperCtrl loading");

			$scope.sales_clusters = ['North Cluster', 'South Cluster', 'East Cluster', 'West Cluster', 'Central Cluster', 'Others'];

			vm.idParam = $location.search().id; 

			Initialize();

			//functions for developer
			vm.cancel = function() {
				$window.location.href = "/home";
			}

			vm.updateDev = function(vm, id, rev) {
				$http.post('/update-developer', {
					id									: id,				
					rev									: rev,
					developer_name						: vm.developer_name,
					developer_address					: vm.developer_address,	
					developer_contact_person			: vm.developer_contact_person,
					developer_project_project_name		: vm.project_name,
					developer_project_address			: vm.project_address,
					developer_project_contact_person	: vm.project_contact_person, 
					developer_project_contact_email		: vm.project_contact_email, 
					developer_project_contact_phone		: vm.project_contact_phone,
					developer_project_commission_rate	: vm.project_commission_rate, 
					developer_project_sales_cluster		: vm.project_sales_cluster
					
				})
					.success(function(response) {
					console.log(response);
					alert('Developer information update completed.');
					$window.location.href= '/home';    
					
				})
					.error(function() {
					alert('Developer information update error.');
				});
			}

			// Run this to get the details for the document to be updated
			function Initialize () {
				if (vm.idParam != '' || typeof vm.idParam !== 'undefined') {
					$http({
						method: 'GET',
						url: '/developer/update-query',
						params: {id: vm.idParam}
					}).then(function successCallback(response) {
						vm.infoResults = response.data;
						console.log('results: ' + JSON.stringify(vm.infoResults));
						angular.forEach(response.data, function (item) {
							vm._id 							= item._id;
							vm._rev 						= item._rev;
							vm.developer_name 				= item.developer_name;
							vm.developer_address 			= item.developer_address;
							vm.developer_contact_person 	= item.developer_contact_person;
							vm.project_name 				= item.developer_project_project_name;
							vm.project_address 				= item.developer_project_address;
							vm.project_contact_person 		= item.developer_project_contact_person;
							vm.project_contact_email 		= item.developer_project_contact_email;
							vm.project_contact_phone 		= item.developer_project_contact_phone;
							vm.project_commission_rate 		= item.developer_project_commission_rate;
							vm.project_sales_cluster 		= item.developer_project_sales_cluster;
						});

					}, function errorCallback(response) {
						$scope.error = response;
					});
				}
			}
		};

		//include routeProvider & locationProvider to detect your URL changes
		config.$inject = ['$locationProvider'];
		function config($locationProvider) {

			//prettify our urls i.e. remove the hashbang (#) 
			$locationProvider.html5Mode(true);
		}	
})();