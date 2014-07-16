(function(){
	'use strict';

	function resource($http, proxyLocation) {
		return {
			fetch: function (uri) {
				var config = {
					params: { uri: uri } 
				};
				return $http.get(proxyLocation, config);
			}
		};
	}

	angular.module('gulp-ng')
		.factory('resource', resource);
})();