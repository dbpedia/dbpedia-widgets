(function(){
	'use strict';

	function resource($http, proxyLocation) {
		return {
			fetch: function (uri) {
				return $http.get(proxyLocation + "/" + uri);
			}
		};
	}

	angular.module('gulp-ng')
		.factory('resource', resource);
})();