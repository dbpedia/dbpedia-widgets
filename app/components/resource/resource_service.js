(function(){
	'use strict';

	function resource($http, proxyLocation) {
		return {
			fetch: function (uri) {
				// var config = {
				// 	params: { uri: uri } 
				// };
				// return $http.get(proxyLocation, config);
				return $http.get(proxyLocation + "/" + uri);
			}
		};
	}

	angular.module('gulp-ng')
		.factory('resource', resource);
})();