(function(){
	'use strict';

	function dbpediaResourceView() {
		return {
			restrict: 'E',
			template: 
			//'<div class="wrapper" ng-if="results">' +
				'<label class="heading">{{ heading }}</label>'+
				'<p class="abstract">{{ abstract }}</p>',
			//'</div>',
			scope: {
				resource: '='		//two-way parent scope binding
			},
			link: function (scope, element) {
				scope.$watch('resource', function (newVal, oldVal) {
					if (newVal) {
						var bindings = scope.resource.results.bindings;
						var labelNode = bindings.filter(function (item) {
							return item.p.value === "http://www.w3.org/2000/01/rdf-schema#label";
						})[0];
						scope.heading = labelNode ? labelNode.o.value : "";

						var abstractNode = bindings.filter(function (item) {
							return item.p.value === "http://dbpedia.org/ontology/abstract";
						})[0];
						scope.abstract = abstractNode ? abstractNode.o.value : "";
					};
				});
			}
		};
	}

	angular.module('gulp-ng')
		.directive('dbpediaResourceView', dbpediaResourceView);
})();