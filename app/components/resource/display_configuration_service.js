(function(){
	'use strict';

	function DisplayConfiguration($http) {
		var configurationRoot = '/assets/configurations/';
		this.getConfigurationURL = function (typeURI) {
			//replace the protocol w/ the configuration root
			//and append .json
			return typeURI.replace('http://', configurationRoot) + '.json';
		}

		this.forType = function (typeURI) {
			var url = this.getConfigurationURL(typeURI);
			return $http.get(url);
		}
	}

	angular.module('gulp-ng')
		.service('displayConfiguration', DisplayConfiguration);
})();