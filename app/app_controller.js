(function(){

	'use strict';

	angular.module('gulp-ng')
			.controller('ApplicationCtrl', ['$scope', '$location', function ($scope, $location) {
				//$scope.resourceSelected = {};
				$scope.$watch('resourceSelected', function (newVal, oldVal) {
					if (newVal === oldVal){ //no change
						return;
					}

					$location.path('/detail');
					$location.search('uri', newVal.uri);
				});
			}]);
})();