(function(){
	'use strict';

	function dbpediaDiscreteFact() {
		return {
			restrict: 'E',
			template: 
				'<label class="predicate">{{fact.predicate_label.value}}</label>' +
				'<div class="object">' +
					'<ul>' + 
						'<li ng-repeat="object in fact.objects">' +
							'<a href="{{object.value}}">{{object.object_label.value}}</a>' +
						'</li>' +
					'<ul>' +
				'</div>',
			scope: {
				fact: '='
			}
		};
	}

	angular.module('gulp-ng')
		.directive('dbpediaDiscreteFact', dbpediaDiscreteFact);
})();