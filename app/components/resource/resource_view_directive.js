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
					'<li ng-repeat="groupedFacts in resource.facts">' + 
						'<dbpedia-grouped-facts facts="groupedFacts">' +
						'</dbpedia-grouped-facts>' +
					'</li>' +
				'</ul>',
			//'</div>',
			scope: {
				resource: '='		//two-way parent scope binding
			},
			link: function (scope, element) {
				scope.$watch('resource', function (newVal, oldVal) {
					if (newVal) {
						scope.heading = scope.resource.label;
						scope.abstract = scope.resource.abstract;
					}
				});
			}
		};
	}

	angular.module('gulp-ng')
		.directive('dbpediaResourceView', dbpediaResourceView);
})();