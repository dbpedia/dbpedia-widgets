(function(){
	'use strict';

	/**
	* Displays all the resource facts for a certain predicate
	*/
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

				/**
				* Determintes if an object is a uri
				* @param {object} obj - an object related to the resource
				* @returns {Boolean}
				*/
				scope.isURI = function (obj) {
					return obj.type === 'uri';	
				};

				/**
				* Determintes if an object is a date
				* @param {object} obj - an object related to the resource
				* @returns {Boolean}
				*/
				scope.isDate = function (obj) {
					return obj.type === 'typed-literal' && obj.datatype === 'http://www.w3.org/2001/XMLSchema#date';
				};

				/**
				* Determintes if an object is a literal
				* @param {object} obj - an object related to the resource
				* @returns {Boolean}
				*/
				scope.isLiteral = function (obj) {
					return obj.type === 'literal';
				};

				/**
				* Returns the date from an object
				* @param {object} obj - an object related to the resource
				* @returns {String}
				*/
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