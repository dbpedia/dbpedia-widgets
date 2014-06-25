'use strict';

describe("grouped_facts_directive_test", function(){
	var elm, scope, displayConfiguration;

	beforeEach(module('gulp-ng'));
	beforeEach(inject(function($rootScope, $compile, _displayConfiguration_, _$httpBackend_) {
		elm = jQuery(
			'<div>' +
				'<dbpedia-grouped-facts facts="groupedFacts">' +
				'</dbpedia-grouped-facts>' +
			'</div>'
		);

		scope = $rootScope.$new();
		scope.groupedFacts = {
			"id": "bio",
			"facts": [
				{
					"predicate": {
						"type": "uri",
						"value": "http://dbpedia.org/ontology/birthDate"
					},
					"predicate_label": {
						"type": "literal",
						"xml:lang": "en",
						"value": "Birth date"
					},
					"objects": [
						{
							"type": "typed-literal",
							"datatype": "http://www.w3.org/2001/XMLSchema#date",
							"value": "1971-06-15+02:00"
						}
					]
				},
				{
					"predicate": {
						"type": "uri",
						"value": "http://dbpedia.org/ontology/birthPlace"
					},
					"predicate_label": {
						"type": "literal",
						"xml:lang": "en",
						"value": "Birth place"
					},
					"objects": [
						{
							"type": "uri",
							"value": "http://dbpedia.org/resource/New_York_City",
							"object_label": {
								"type": "literal",
								"xml:lang": "en",
								"value": "New York City"
							}
						}
					]
				},
				{
					"predicate": {
						"type": "uri",
						"value": "http://dbpedia.org/ontology/deathDate"
					},
					"predicate_label": {
						"type": "literal",
						"xml:lang": "en",
						"value": "Death date"
					},
					"objects": [
						{
							"type": "typed-literal",
							"datatype": "http://www.w3.org/2001/XMLSchema#date",
							"value": "1996-09-12+02:00"
						}
					]
				},
				{
					"predicate": {
						"type": "uri",
						"value": "http://dbpedia.org/ontology/deathPlace"
					},
					"predicate_label": {
						"type": "literal",
						"xml:lang": "en",
						"value": "Death place"
					},
					"objects": [
						{
							"type": "uri",
							"value": "http://dbpedia.org/resource/Las_Vegas",
							"object_label": {
								"type": "literal",
								"xml:lang": "en",
								"value": "Las Vegas"
							}
						}
					]
				},
				{
					"predicate": {
						"type": "uri",
						"value": "http://dbpedia.org/ontology/occupation"
					},
					"predicate_label": {
						"type": "literal",
						"xml:lang": "en",
						"value": "Occupation"
					},
					"objects": [
						{
							"type": "uri",
							"value": "http://dbpedia.org/resource/Rapping",
							"object_label": {
								"type": "literal",
								"xml:lang": "en",
								"value": "Rapping"
							}
						},
						{
							"type": "uri",
							"value": "http://dbpedia.org/resource/Actor",
							"object_label": {
								"type": "literal",
								"xml:lang": "en",
								"value": "Actor"
							}
						}
					]
				}
			]
		};

		$compile(elm)(scope);
		scope.$digest();
	}));
	
	it('should attach the resource facts to the scope', function () {
		var isolateScope = elm.find('dbpedia-grouped-facts').isolateScope();
		expect(angular.equals(isolateScope.facts, scope.groupedFacts)).toBe(true);
	});

	describe('grouping label', function () {
		it('should be displayed when the group id present', function () {
			var groupingLabelElement = elm.children('dbpedia-grouped-facts').children('label');
			
			expect(groupingLabelElement.length).toBe(1, 'grouping label element missing');
			expect(groupingLabelElement.html()).toBe('bio', 'incorrect grouping label');
		});

		it('should come be hidden when the group id missing', function () {
			//remove the grouping label
			delete scope.groupedFacts['id'];
			scope.$apply();

			var groupingLabelElement = elm.children('dbpedia-grouped-facts').children('label');
			expect(groupingLabelElement.length).toBe(0, 'grouping label element displayed');
		});
	});

	it('should display each fact individually', function() {
		var dbpediaDiscreteFacts = elm.find('dbpedia-discrete-fact');
		var li = dbpediaDiscreteFacts.parent('li');
		

		expect(dbpediaDiscreteFacts.length).toBe(5, 'discrete facts not displayed');
		expect(li.length).toBe(5, 'discrete facts are not placed in an individual li');
	});
});