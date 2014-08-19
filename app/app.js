(function(){
	'use strict';

	angular.module('gulp-ng', [ 'ngRoute', 'ngSanitize', 'gulp-ng-main', 'templates' ])
		.config(function ($routeProvider) {
			
			$routeProvider
				.otherwise({
					redirectTo: '/'
				});
		
		});
})();