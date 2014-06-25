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
							'<span ng-if="isDate(object)">{{parseDate(object)}}</span>' +
							'<a ng-if="isURI(object)" href="{{object.value}}">{{object.object_label.value}}</a>' +
						'</li>' +
					'<ul>' +
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