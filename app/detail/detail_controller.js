(function () {
	'use strict';


	angular.module('gulp-ng')
		//configure the routes
		.config(function ($routeProvider) {
			$routeProvider
				.when('/detail', {
					templateUrl: 'detail/detail.html',
					controller: 'DetailCtrl'
				});
		})
		.controller('DetailCtrl', function ($scope, $routeParams, resource, $location, $sce) {
			/*
				The DetailCtrl is in charge of gettings the facts for 
				the requested URI, generating the embed code, and opening
				the modal that displays the embed code. 
			*/

			//get the uri from the route parameters
			$scope.uri = $routeParams.uri;
			//request the resource facts
			resource.fetch($scope.uri).then(function (response) {
				$scope.resource = response.data;
			});

			//start the modal in the closed state
			$scope.modalOpen = false;
			/**
			* toggles the modal between open/closed state
			*/
			$scope.toggleModal = function () {
				$scope.modalOpen = !$scope.modalOpen;
			};

			/**
			* generates the iframe embed code
			* @returns {string}
			*/
			$scope.getEmbedCode = function () {
				var iframe = 
					'<iframe src="' + $scope.getWidgetURL() + '" ' + 
							'frameborder="0" ' + 
							'width="350"' +
							'height="400"' +
					'/>';
				return iframe;
			};


			/**
			* Exposes the $sce.trustAsHtml function.
			* Thisis used to sanatize the embed code generated so 
			* angular will trust and render the embed code html
			* @param {string} str - an HTML string to be sanitized for angular consumption
			*/
			$scope.sanitize = function (str) {
				return $sce.trustAsHtml(str);
			};

			/**
			* Generates the URL for the widget version of this resource
			* @returns {string}
			*/
			$scope.getWidgetURL = function () {
				var p = $location.protocol();
				var h = $location.host();
				var port = $location.port();
				port = port !== 80 ? ':' + port : '';
				var url = $location.url();
				var path = 'embed.html';
				
				return p + '://' + h + port + '/' + path + '#' +  url;
			};
		});
})();