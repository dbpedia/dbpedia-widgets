(function(){
	'use strict';

	function dbpediaResourceView(displayConfiguration) {
		return {
			restrict: 'E',
			template: 
			//'<div class="wrapper" ng-if="results">' +
				'<label class="heading">{{ heading }}</label>'+
				'<p class="abstract">{{ abstract }}</p>' + 
				'<ul>' +
					'<li ng-repeat="config in knownTypes">' + 
						'<dbpedia-typed-resource-view resource="resource" configuration="config">' + 
						'</dbpedia-typed-resource-view>' + 
					'</li>' +
				'</ul>',
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


						var rdfTypeNodes = bindings.filter(function (item) {
							return item.p.value === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
						});

						rdfTypeNodes.forEach(function (node) {
							displayConfiguration
								.forType(node.o.value)
								.success(function (data) {
									if(!angular.isArray(scope.knownTypes)){
										scope.knownTypes = [];
									}

									scope.knownTypes.push(data);
								});
						});
					};
				});
			}
		};
	}

	angular.module('gulp-ng')
		.directive('dbpediaResourceView', dbpediaResourceView);
})();