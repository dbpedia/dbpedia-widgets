(function () {
	'use strict';


	angular.module('gulp-ng')
		.config(function ($routeProvider) {
			$routeProvider
				.when('/detail', {
					templateUrl: 'detail/detail.html',
					controller: 'DetailCtrl'
				});
		})
		.controller('DetailCtrl', function ($scope, $routeParams) {
			$scope.uri = $routeParams.uri;
			$scope.resource = {};
			$scope.resource.facts = {
				'uri': 'http://dbpedia.org/resource/Sample',
				'lang': 'en',
				'label': 'A Sample Label',
				'alt-label': '',
				'depiction': 'http://upload.wikimedia.org/wikipedia/commons/1/13/Tupac_Shakur_(rapper),_performing_live.jpg',
				'type': 'http://xmlns.com/foaf/0.1/Person',
				'abstract': 'A Sample Abstract',
				'facts': [
					{
						'id': 'bio',
						'facts': [
							{
								'predicate': {
									'type': 'uri',
									'value': 'http://dbpedia.org/ontology/birthDate'
								},
								'predicate_label': {
									'type': 'literal',
									'xml:lang': 'en',
									'value': 'Birth date'
								},
								'objects': [{
									'type': 'typed-literal',
									'datatype': 'http://www.w3.org/2001/XMLSchema#date',
									'value': '1971-06-15+02:00'
								}]
							},
							{
								'predicate': {
									'type': 'uri',
									'value': 'http://dbpedia.org/ontology/birthPlace'
								},
								'predicate_label': {
									'type': 'literal',
									'xml:lang': 'en',
									'value': 'Birth place'
								},
								'objects': [{
									'type': 'uri',
									'value': 'http://dbpedia.org/resource/New_York_City',
									'object_label': {
										'type': 'literal',
										'xml:lang': 'en',
										'value': 'New York City'
									}
								}]
							},
							{
								'predicate': {
									'type': 'uri',
									'value': 'http://dbpedia.org/ontology/deathDate'
								},
								'predicate_label': {
									'type': 'literal',
									'xml:lang': 'en',
									'value': 'Death date'
								},
								'objects': [{
									'type': 'typed-literal',
									'datatype': 'http://www.w3.org/2001/XMLSchema#date',
									'value': '1996-09-12+02:00'
								}]
							},
							{
								'predicate': {
									'type': 'uri',
									'value': 'http://dbpedia.org/ontology/deathPlace'
								},
								'predicate_label': {
									'type': 'literal',
									'xml:lang': 'en',
									'value': 'Death place'
								},
								'objects': [{
									'type': 'uri',
									'value': 'http://dbpedia.org/resource/Las_Vegas',
									'object_label': {
										'type': 'literal',
										'xml:lang': 'en',
										'value': 'Las Vegas'
									}
								}]
							}
						]
					},
					{
						'id': 'artist',
						'facts': [
							{
								'predicate': {
									'type': 'uri',
									'value': 'http://dbpedia.org/ontology/occupation'
								},
								'predicate_label': {
									'type': 'literal',
									'xml:lang': 'en',
									'value': 'Occupation'
								},
								'objects': [{
									'type': 'uri',
									'value': 'http://dbpedia.org/resource/Rapping',
									'object_label': {
										'type': 'literal',
										'xml:lang': 'en',
										'value': 'Rapping'
									}
								}, {
									'type': 'uri',
									'value': 'http://dbpedia.org/resource/Actor',
									'object_label': {
										'type': 'literal',
										'xml:lang': 'en',
										'value': 'Actor'
									}
								}]
							}
						]
					}
				]
			};
		});
})();