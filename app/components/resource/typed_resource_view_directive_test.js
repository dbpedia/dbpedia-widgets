'use strict';

describe("typed_resource_view_directive_test", function(){
	var elm, scope;

	beforeEach(module('gulp-ng'));
	beforeEach(inject(function($rootScope, $compile) {
		elm = jQuery(
			'<div>' +
				'<dbpedia-typed-resource-view resource="facts" configuration="config">' +
				'</dbpedia-typed-resource-view>' +
			'</div>'
		);

		scope = $rootScope.$new();
		scope.facts = {
			"head": {
				"vars": [ "p" , "predicate_label" , "o" , "object_label" , "rank" ]
			},
			"results": {
				"bindings": [
					{
						"p": { "type": "uri" , "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" },
						"predicate_label": { "type": "literal" , "value": "type" },
						"o": { "type": "uri" , "value": "http://xmlns.com/foaf/0.1/Person" },
						"object_label": { "type": "literal" , "value": "Person" }
					},
					{
						"p": { "type": "uri" , "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" },
						"predicate_label": { "type": "literal" , "value": "type" },
						"o": { "type": "uri" , "value": "http://dbpedia.org/ontology/Artist" },
						"object_label": { "type": "literal" , "xml:lang": "en" , "value": "artist" }
					},
					{
						"p": { "type": "uri" , "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" },
						"predicate_label": { "type": "literal" , "value": "type" },
						"o": { "type": "uri" , "value": "http://dbpedia.org/class/yago/Rapper110507482" }
					},
					{
						"p": { "type": "uri" , "value": "http://dbpedia.org/ontology/occupation" } ,
						"predicate_label": { "type": "literal" , "xml:lang": "en" , "value": "occupation" } ,
						"o": { "type": "uri" , "value": "http://dbpedia.org/resource/Rapping" } ,
						"object_label": { "type": "literal" , "xml:lang": "en" , "value": "Rapping" } ,
						"rank": { "datatype": "http://www.w3.org/2001/XMLSchema#float" , "type": "typed-literal" , "value": "75.50723" }
					},
					//acting should be after rapping to verify the items are ordered by their ranking and 
					//not their position in the bindings list
					{
						"p": { "type": "uri" , "value": "http://dbpedia.org/ontology/occupation" } ,
						"predicate_label": { "type": "literal" , "xml:lang": "en" , "value": "occupation" } ,
						"o": { "type": "uri" , "value": "http://dbpedia.org/resource/Actor" } ,
						"object_label": { "type": "literal" , "xml:lang": "en" , "value": "Actor" } ,
						"rank": { "datatype": "http://www.w3.org/2001/XMLSchema#float" , "type": "typed-literal" , "value": "303.58078" }
					},
					{
						"p": { "type": "uri" , "value": "http://dbpedia.org/ontology/birthDate" } ,
						"predicate_label": { "type": "literal" , "xml:lang": "en" , "value": "birth date" } ,
						"o": { "datatype": "http://www.w3.org/2001/XMLSchema#date" , "type": "typed-literal" , "value": "1971-06-15+02:00" }
					},
					{
						"p": { "type": "uri" , "value": "http://dbpedia.org/ontology/deathDate" } ,
						"predicate_label": { "type": "literal" , "xml:lang": "en" , "value": "death date" } ,
						"o": { "datatype": "http://www.w3.org/2001/XMLSchema#date" , "type": "typed-literal" , "value": "1996-09-12+02:00" }
					},
					{
						"p": { "type": "uri" , "value": "http://dbpedia.org/ontology/birthPlace" } ,
						"predicate_label": { "type": "literal" , "xml:lang": "en" , "value": "birth place" } ,
						"o": { "type": "uri" , "value": "http://dbpedia.org/resource/New_York_City" } ,
						"object_label": { "type": "literal" , "xml:lang": "en" , "value": "New York City" } ,
						"rank": { "datatype": "http://www.w3.org/2001/XMLSchema#float" , "type": "typed-literal" , "value": "813.0256" }
					},
					{
						"p": { "type": "uri" , "value": "http://dbpedia.org/ontology/birthPlace" } ,
						"predicate_label": { "type": "literal" , "xml:lang": "en" , "value": "birth place" } ,
						"o": { "type": "uri" , "value": "http://dbpedia.org/resource/New_York" } ,
						"object_label": { "type": "literal" , "xml:lang": "en" , "value": "New York" } ,
						"rank": { "datatype": "http://www.w3.org/2001/XMLSchema#float" , "type": "typed-literal" , "value": "625.0301" }
					},
					{
						"p": { "type": "uri" , "value": "http://dbpedia.org/ontology/deathPlace" } ,
						"predicate_label": { "type": "literal" , "xml:lang": "en" , "value": "death place" } ,
						"o": { "type": "uri" , "value": "http://dbpedia.org/resource/Las_Vegas" } ,
						"object_label": { "type": "literal" , "xml:lang": "en" , "value": "Las Vegas" } ,
						"rank": { "datatype": "http://www.w3.org/2001/XMLSchema#float" , "type": "typed-literal" , "value": "57.24966" }
					},
					{
						"p": { "type": "uri" , "value": "http://dbpedia.org/ontology/deathPlace" } ,
						"predicate_label": { "type": "literal" , "xml:lang": "en" , "value": "death place" } ,
						"o": { "type": "uri" , "value": "http://dbpedia.org/resource/Nevada" } ,
						"object_label": { "type": "literal" , "xml:lang": "en" , "value": "Nevada" } ,
						"rank": { "datatype": "http://www.w3.org/2001/XMLSchema#float" , "type": "typed-literal" , "value": "115.70988" }
					}
				]
			}
		};

		scope.config = {
			"Person": [
				{
					"label": "Occupation",
					"from": "http://dbpedia.org/ontology/occupation"
				},
				{
					"label": "Birth Place",
					"from": "http://dbpedia.org/ontology/birthPlace"
				},
				{
					"label": "Birth Date",
					"from": "http://dbpedia.org/ontology/birthDate"
				},
				{
					"label": "Death Place",
					"from": "http://dbpedia.org/ontology/deathPlace"
				},
				{
					"label": "Death Date",
					"from": "http://dbpedia.org/ontology/deathDate"
				}
			]
		};

		$compile(elm)(scope);
		scope.$digest();
	}));

	it('should attach the resource facts to the scope', function () {
		var isolateScope = elm.find('dbpedia-typed-resource-view').isolateScope();
		expect(angular.equals(isolateScope.resource, scope.facts)).toBe(true);
	});

	it('should attach the configuration to the scope', function () {
		var isolateScope = elm.find('dbpedia-typed-resource-view').isolateScope();
		expect(angular.equals(isolateScope.configuration, scope.config)).toBe(true);
	});

	it('should get the grouping label from the configuration', function () {
		var isolateScope = elm.find('dbpedia-typed-resource-view').isolateScope();
		expect(isolateScope.groupingLabel).toBe("Person");
	});

	it('should attach a function getBindingsForPredicate to the dbpedia-typed-resource-view scope', function () {
		var isolateScope = elm.find('dbpedia-typed-resource-view').isolateScope();
		expect(isolateScope.getBindingsForPredicate).toBeDefined('function no defined');
		expect(typeof isolateScope.getBindingsForPredicate).toBe('function', 'not a function');
	});

	describe('function getBindingsForPredicate',function () {
		it('should return resource bindings that match the given predicate ordered by ranking', function () {
			var isolateScope = elm.find('dbpedia-typed-resource-view').isolateScope();
			var expectedBindings = [
				{
					"p": { "type": "uri" , "value": "http://dbpedia.org/ontology/occupation" } ,
					"predicate_label": { "type": "literal" , "xml:lang": "en" , "value": "occupation" } ,
					"o": { "type": "uri" , "value": "http://dbpedia.org/resource/Actor" } ,
					"object_label": { "type": "literal" , "xml:lang": "en" , "value": "Actor" } ,
					"rank": { "datatype": "http://www.w3.org/2001/XMLSchema#float" , "type": "typed-literal" , "value": "303.58078" }
				},
				{
					"p": { "type": "uri" , "value": "http://dbpedia.org/ontology/occupation" } ,
					"predicate_label": { "type": "literal" , "xml:lang": "en" , "value": "occupation" } ,
					"o": { "type": "uri" , "value": "http://dbpedia.org/resource/Rapping" } ,
					"object_label": { "type": "literal" , "xml:lang": "en" , "value": "Rapping" } ,
					"rank": { "datatype": "http://www.w3.org/2001/XMLSchema#float" , "type": "typed-literal" , "value": "75.50723" }
				},
			];
			var actualBindings = isolateScope.getBindingsForPredicate('http://dbpedia.org/ontology/occupation');
			//use angular.copy to strip out $$ properties like $$hashKey created by ng-repeat
			expect(angular.copy(actualBindings)).toEqual(expectedBindings);
		});
	});
	

	it('should display the correct occupation facts in anchor tags', function() {
		var li = elm.find('li[uri="http://dbpedia.org/ontology/occupation"]');
		var label = li.find('label.predicate');
		var anchors = li.find('div.object a[href]');

		expect(label.length).toBe(1, 'The predicate label was not found');
		expect(label.html()).toBe('Occupation', 'The wrong predicate label was found');
		expect(anchors.length).toBe(2, 'The incorrect amount of anchors tags with an href was found');

		var rappingNode = anchors.filter('[href="http://dbpedia.org/resource/Rapping"]');
		var actorNode = anchors.filter('[href="http://dbpedia.org/resource/Actor"]');

		expect(rappingNode.html()).toBe('Rapping', 'The node did not have the expected value');
		expect(actorNode.html()).toBe('Actor', 'The node did not have the expected value');
	});

	it('should order the occupation facts by ranking', function() {
		var li = elm.find('li[uri="http://dbpedia.org/ontology/occupation"]');
		var anchors = li.find('div.object a');

		var first = angular.element(anchors[0]);
		var second = angular.element(anchors[1]);

		expect(first.is('[href="http://dbpedia.org/resource/Actor"]')).toBe(true);
		expect(second.is('[href="http://dbpedia.org/resource/Rapping"]')).toBe(true);
	});


	xit('should display the correct birth date fact as a date formatted literal', function() {
		var li = elm.find('li[uri="http://dbpedia.org/ontology/birthDate"]');
		var label = li.find('label.predicate');
		var predicate = li.find('div.object');

		expect(label.length).toBe(1);
		expect(label.html()).toBe('birth date');
		expect(anchors.length).toBe(2);

		expect(predicate.html()).toBe('06/15/1971');
	});

	xit('should display a dbpedia-typed-resource-view for each known type', function() {
	});

});