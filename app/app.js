(function(){
	'use strict';

	angular.module('gulp-ng', [ 'ngRoute','gulp-ng-main','templates' ])
		.config(function ($routeProvider) {
			
			$routeProvider
				.otherwise({
					redirectTo: '/'
				});
		
		});
})();