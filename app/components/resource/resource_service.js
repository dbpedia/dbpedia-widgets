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
		.value('proxyLocation', 'http://localhost:8000/resource')
		.factory('resource', resource);
})();