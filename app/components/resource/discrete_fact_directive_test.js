'use strict';

describe("discrete_fact_directive_test", function(){
	var elm, scope;

	beforeEach(module('gulp-ng'));
	beforeEach(inject(function($rootScope, $compile, _$httpBackend_) {
		elm = jQuery(
			'<dbpedia-discrete-fact fact="fact">' +
			'</dbpedia-discrete-fact>'
		);

		scope = $rootScope.$new();
		$compile(elm)(scope);
		scope.$digest();
	}));
	
	it('should bind the fact to the isolate scope', function () {
		scope.fact = {
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
		};
		scope.$apply();

		var isolateScope = elm.isolateScope();
		expect(angular.equals(isolateScope.fact, scope.fact)).toBe(true);
	});

	it('should display the correct fact label', function () {
		scope.fact = {
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
		};
		scope.$apply();
		
		var label = elm.find('label.predicate');
		expect(label.length).toBe(1, 'predicate label missing');
		expect(label.html()).toBe('Birth date', 'incorrect label');
	});

	it('should display all fact objects', function () {
		scope.fact = {
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
		};
		scope.$apply();
		
		var objectDiv = elm.find('div.object');
		var li = objectDiv.find('li');
		expect(objectDiv.length).toBe(1, 'object div missing');
		expect(li.length).toBe(2, 'incorrect amount of items');
	});

	it('should display fact objects of type uri as anchors linking to its resource', function () {
		scope.fact = {
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
				}
			]
		};
		scope.$apply();
		
		var anchor = elm.find('a[href]');
		expect(anchor.length).toBe(1, 'anchor tag missing');
		expect(anchor.attr('href')).toBe('http://dbpedia.org/resource/Rapping', 'incorrect href value');
		expect(anchor.html()).toBe('Rapping');
	});

	xit('should display the correct birth date fact as a date formatted literal', function() {
		var li = elm.find('li[uri="http://dbpedia.org/ontology/birthDate"]');
		var label = li.find('label.predicate');
		var predicate = li.find('div.object');

		expect(label.length).toBe(1);
		expect(label.html()).toBe('Birth Date');
		expect(predicate.text()).toBe('06/15/1971');
	});
});