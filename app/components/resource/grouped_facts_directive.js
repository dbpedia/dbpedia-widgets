(function(){
	'use strict';

	function dbpediaGroupedFacts() {
		return {
			restrict: 'E',
			template: 
				'<label ng-if="facts.id" class="group-header">{{facts.id}}</label>' +
				'<ul>' + 
					'<li ng-repeat="fact in facts.facts">' +
						'<dbpedia-discrete-fact fact="fact">' +
						'</dbpedia-discrete-fact>' +
					'</li>' +
				'</ul>',
			scope: {
				facts: '='		//two-way parent scope binding
			}
		};
	}

	angular.module('gulp-ng')
		.directive('dbpediaGroupedFacts', dbpediaGroupedFacts);
})();