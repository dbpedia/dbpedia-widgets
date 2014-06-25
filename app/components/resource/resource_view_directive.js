(function(){
	'use strict';

	function dbpediaResourceView() {
		return {
			restrict: 'E',
			template: 
			//'<div class="wrapper" ng-if="results">' +
				'<label class="heading">{{ resource.label }}</label>'+
				'<p class="abstract">{{ resource.abstract }}</p>' + 
				'<ul>' +
					'<li ng-repeat="groupedFacts in resource.facts">' + 
						'<dbpedia-grouped-facts facts="groupedFacts">' +
						'</dbpedia-grouped-facts>' +
					'</li>' +
				'</ul>',
			//'</div>',
			scope: {
				resource: '='		//two-way parent scope binding
			}
		};
	}

	angular.module('gulp-ng')
		.directive('dbpediaResourceView', dbpediaResourceView);
})();