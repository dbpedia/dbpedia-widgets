(function(){
	'use strict';

	function dbpediaDiscreteFact() {
		return {
			restrict: 'E',
			template: 
				'<label class="predicate">{{fact.predicate.label}}</label>' +
				'<div class="object">' +
					'<ul>' + 
						'<li ng-repeat="object in fact.objects">' +
							'<span ng-if="isDate(object)">{{parseDate(object)}}</span>' +
							'<span ng-if="isLiteral(object)">{{object.value}}</span>' +
							'<a ng-if="isURI(object)" href="#/detail?uri={{object.value}}">{{object.label}}</a>' +
						'</li>' +
					'</ul>' +
				'</div>',
			scope: {
				fact: '='
			},
			link: function (scope) {
				scope.isURI = function (obj) {
					return obj.type === 'uri';	
				};

				scope.isDate = function (obj) {
					return obj.type === 'typed-literal' && obj.datatype === 'http://www.w3.org/2001/XMLSchema#date';
				};

				scope.isLiteral = function (obj) {
					return obj.type === 'literal';
				};

				scope.parseDate = function (obj) {
					var matches = obj.value.match(/(\d{4})-(\d{2})-(\d{2})/);
					var year = matches[1];
					var month = matches[2];
					var day = matches[3];
					return month + '/' + day + '/' + year;
				};

				
			}
		};
	}

	angular.module('gulp-ng')
		.directive('dbpediaDiscreteFact', dbpediaDiscreteFact);
})();