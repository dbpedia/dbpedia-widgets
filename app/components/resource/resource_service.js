(function(){
	'use strict';

	/**
	* Fetches resource facts from the dbpedia proxy service
	*
	* @param {object} $http - angular http service
	* @param {string} proxyLocation - an injected constant value w/ the location of the dbpedia proxy
	*/
	function resource($http, proxyLocation) {
		return {
			/**
			* Executes request to retrieve facts for a given resource
			*
			* @param {string} uri - a dbpedia resource URI
			* @returns {Promise}
			*/
			fetch: function (uri) {
				return $http.get(proxyLocation + "/" + uri);
			}
		};
	}


	angular.module('gulp-ng')
		//register the proxy location
		.value('proxyLocation', 'http://localhost:8000/resource')
		//register the resource service
		.factory('resource', resource);
})();