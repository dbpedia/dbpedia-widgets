(function(){

	'use strict';

	angular.module('gulp-ng')
			.controller('ApplicationCtrl', ['$scope', '$location', '$window', function ($scope, $location, $window) {
				//$scope.resourceSelected = {};
				$scope.$watch('resourceSelected', function (newVal, oldVal) {
					if (newVal === oldVal){ //no change
						return;
					}

					$location.path('/detail');
					$location.search('uri', newVal.uri);
				});

				$scope.$on('$routeChangeSuccess', function (evnt) {
					$window.ga('send', 'pageview', $location.url());
				});
			}]);
})();