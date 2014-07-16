(function(){
	'use strict';

	function dbpediaResourceView() {
		return {
			restrict: 'E',
			template: 
			//'<div class="wrapper" ng-if="results">' +
				'<img dbpedia-depiction resource="resource" />' +
				'<label class="heading">{{ resource.label }}</label>'+
				'<p class="comment">{{ resource.comment }}</p>' + 
				'<div class="clear"></div>' + 
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