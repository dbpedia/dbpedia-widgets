(function(){
	'use strict';

	/**
	* Displays all the resource facts that form part of the group.
	* Facts are grouped into sets of related facts and 
	* this directive is in charge of displaying each set of
	* grouped facts as an individual section
	*
	* @example facts = { id: 'group name', facts: ['list of related facts'] }
	*/
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