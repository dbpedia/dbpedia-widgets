(function(){
	'use strict';

	function dbpediaResourceView() {
		return {
			restrict: 'E',
			replace: true,
			template: '<div class="wrapper">' + 
				'<label class="heading">{{heading}}</label>'+
			'</div>',
			scope: {
				resource: '='		//two-way parent scope binding
			},
			link: function (scope, element) {
				if (scope.resource) {

				}

				// console.log("RESOURCE", scope.resource);
				// var bindings = scope.resource.results.bindings;
				// scope.heading = bindings.filter(function (item) {
				// 	return item.p.value === "http://www.w3.org/2000/01/rdf-schema#label";
				// })[0];
			}
		};
	}

	angular.module('gulp-ng')
		.directive('dbpediaResourceView', dbpediaResourceView);
})();