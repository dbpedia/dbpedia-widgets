(function(){
	'use strict';

	function dbpediaTypedResourceView() {
		return {
			restrict: 'E',
			template: 
			'<ul>' + 
				'<li ng-repeat="factMapping in configuration[groupingLabel]" uri="{{factMapping.from}}">' +
					'<label class="predicate">{{factMapping.label}}</label>' +
					'<div class="object">' +
						'<ul>' + 
							'<li ng-repeat="binding in getBindingsForPredicate(factMapping.from)">' +
								'<a href="{{binding.o.value}}">{{binding.object_label.value}}</a>' +
							'</li>' +
						'<ul>' +
					'</div>' +
				'</li>' +
			'</ul>',
			scope: {
				resource: '=',		//two-way parent scope binding
				configuration: '='
			},
			link: function (scope, element) {
				scope.getBindingsForPredicate = function (predicateURI) {
					return scope.resource.results.bindings.filter(function (binding) {
						return binding.p.value === predicateURI;
					}).sort(function (a, b) {
						var rankingA = a.rank ? parseFloat(a.rank.value) : 0;
						var rankingB = b.rank ? parseFloat(b.rank.value) : 0;
						return rankingA < rankingB;
					});
				};

				scope.groupingLabel = Object.keys(scope.configuration)[0];
			}
		};
	}

	angular.module('gulp-ng')
		.directive('dbpediaTypedResourceView', dbpediaTypedResourceView);
})();