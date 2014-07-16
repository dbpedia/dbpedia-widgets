(function () {
	'use strict';


	angular.module('gulp-ng')
		.config(function ($routeProvider) {
			$routeProvider
				.when('/detail', {
					templateUrl: 'detail/detail.html',
					controller: 'DetailCtrl'
				});
		})
		.controller('DetailCtrl', function ($scope, $routeParams, resource) {
			$scope.uri = $routeParams.uri;
			resource.fetch($scope.uri).then(function (response) {
				$scope.resource = response.data;
			});
		});
})();