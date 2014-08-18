(function(){

	'use strict';

	angular.module('gulp-ng')
			.controller('ApplicationCtrl', ['$scope', '$location', '$window', function ($scope, $location, $window) {
				/*
					This is the root controller for the application.
				*/

				$scope.embed = $location.search().embed === 'true';

				//watch for a change in the resource selected
				//this will occur when someone searches for a resource using
				//the search box and a selection is made from the drop down menu
				$scope.$watch('resourceSelected', function (newVal, oldVal) {
					if (newVal === oldVal){ //no change
						return;
					}

					//change the path and set the uri parameter
					$location.path('/detail');
					$location.search('uri', newVal.uri);
				});

				//notify GA that the page changed
				$scope.$on('$routeChangeSuccess', function (evnt) {
					$window.ga('send', 'pageview', $location.url());
				});
			}]);
})();