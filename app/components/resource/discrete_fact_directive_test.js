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
				"value": "http://dbpedia.org/ontology/birthDate",
				"label": "Birth date"
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
				"value": "http://dbpedia.org/ontology/birthDate",
				"label": "Birth date"
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
				"value": "http://dbpedia.org/ontology/occupation",
				"label": "Occupation"
			},
			"objects": [
				{
					"type": "uri",
					"value": "http://dbpedia.org/resource/Rapping",
					"label": "Rapping"
				},
				{
					"type": "uri",
					"value": "http://dbpedia.org/resource/Actor",
					"label": "Actor"
				}
			]
		};
		scope.$apply();
		
		var objectDiv = elm.find('div.object');
		var li = objectDiv.find('li');
		expect(objectDiv.length).toBe(1, 'object div missing');
		expect(li.length).toBe(2, 'incorrect amount of items');
	});

	describe('isURI', function () {
		it('should be a function on the isolate scope', function () {
			var isolateScope = elm.isolateScope();
			expect(isolateScope.isURI).toBeDefined();
			expect(typeof isolateScope.isURI).toBe('function');
		});

		it('should return true when a given object is a URI', function () {
			var isolateScope = elm.isolateScope();
			var obj = {
				"type": "uri",
				"value": "http://dbpedia.org/resource/Rapping",
				"label": "Rapping"
			};

			expect(isolateScope.isURI(obj)).toBe(true);
		});

		it('should return false when a given object is not a URI', function () {
			var isolateScope = elm.isolateScope();
			

			var obj = {
				"type": "typed-literal",
				"datatype": "http://www.w3.org/2001/XMLSchema#date",
				"value": "1971-06-15+02:00"
			};

			expect(isolateScope.isURI(obj)).toBe(false, 'uri evaluated to true');


			obj = {
				"type": "literal",
				"value": "sample value"
			};

			expect(isolateScope.isURI(obj)).toBe(false, 'literal evaluated to true');
		});
	});

	it('should display fact objects of type uri as anchors linking to its resource details page', function () {
		scope.fact = {
			"predicate": {
				"type": "uri",
				"value": "http://dbpedia.org/ontology/occupation",
				"label": "Occupation"
			},
			"objects": [
				{
					"type": "uri",
					"value": "http://dbpedia.org/resource/Rapping",
					"label": "Rapping"
				}
			]
		};
		scope.$apply();
		
		var anchor = elm.find('a[href]');
		expect(anchor.length).toBe(1, 'anchor tag missing');
		expect(anchor.attr('href')).toBe('#/detail?uri=http://dbpedia.org/resource/Rapping', 'incorrect href value');
		expect(anchor.html()).toBe('Rapping');
	});

	it('should not display anchors for non-uri fact objects', function () {
		scope.fact = {
			"predicate": {
				"type": "uri",
				"value": "http://dbpedia.org/ontology/birthDate",
				"label": "Birth date"
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
		var anchor = elm.find('div.object a');
		expect(anchor.length).toBe(0);
	});

	

	describe('isDate', function () {
		it('should be a function on the isolate scope', function () {
			var isolateScope = elm.isolateScope();
			expect(isolateScope.isDate).toBeDefined();
			expect(typeof isolateScope.isDate).toBe('function');
		});

		it('should return true when a given object is a date', function () {
			var isolateScope = elm.isolateScope();
			var dateObject = {
				"type": "typed-literal",
				"datatype": "http://www.w3.org/2001/XMLSchema#date",
				"value": "1971-06-15+02:00"
			};

			expect(isolateScope.isDate(dateObject)).toBe(true);
		});

		it('should return false when a given object is not a date', function () {
			var isolateScope = elm.isolateScope();
			var dateObject = {
				"type": "uri",
				"value": "http://dbpedia.org/resource/Rapping",
				"label": "Rapping"
			};

			expect(isolateScope.isDate(dateObject)).toBe(false, 'uri evaluated to true');


			dateObject = {
				"type": "literal",
				"value": "sample value"
			};

			expect(isolateScope.isDate(dateObject)).toBe(false, 'literal evaluated to true');
		});
	});

	describe('parseDate', function () {
		it('should be a function on the isolate scope', function () {
			var isolateScope = elm.isolateScope();
			expect(isolateScope.isDate).toBeDefined();
			expect(typeof isolateScope.isDate).toBe('function');
		});

		it('should return the correct date as a string', function () {
			var isolateScope = elm.isolateScope();
			var dateObject = {
				"type": "typed-literal",
				"datatype": "http://www.w3.org/2001/XMLSchema#date",
				"value": "1971-06-15+02:00"
			};

			expect(isolateScope.parseDate(dateObject)).toBe('06/15/1971');
		});
	});

	it('should display fact objects of type typed-literal, datatype date, as a formatted date string', function() {
		scope.fact = {
			"predicate": {
				"type": "uri",
				"value": "http://dbpedia.org/ontology/birthDate",
				"label": "Birth date"
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
		var span = elm.find('div.object span');
		expect(span.text()).toBe('06/15/1971');
	});

	describe('isLiteral', function () {
		it('should be a function on the isolate scope', function () {
			var isolateScope = elm.isolateScope();
			expect(isolateScope.isLiteral).toBeDefined();
			expect(typeof isolateScope.isLiteral).toBe('function');
		});

		it('should return true when a given object is a literal', function () {
			var isolateScope = elm.isolateScope();
			var obj = {
				"type": "literal",
				"xml:lang": "en",
				"value": "American rap artist, actor and poet"
			};

			expect(isolateScope.isLiteral(obj)).toBe(true);
		});

		it('should return false when a given object is not a literal', function () {
			var isolateScope = elm.isolateScope();

			var obj = {
				"type": "typed-literal",
				"datatype": "http://www.w3.org/2001/XMLSchema#date",
				"value": "1971-06-15+02:00"
			};
			expect(isolateScope.isLiteral(obj)).toBe(false, 'date evaluated to true');

			obj = {
				"type": "uri",
				"value": "http://dbpedia.org/resource/Rapping",
				"label": "Rapping"
			};
			expect(isolateScope.isLiteral(obj)).toBe(false, 'uri evaluated to true');
		});
	});


	it('should display fact objects of type literal as is', function() {
		scope.fact = {
			"predicate": {
				"type": "uri",
				"value": "http://purl.org/dc/elements/1.1/description",
				"label": "Description"
			},
			"objects": [
				{
					"type": "literal",
					"xml:lang": "en",
					"value": "American rap artist, actor and poet"
				}
			]
		};

		scope.$apply();
		var span = elm.find('div.object span');
		expect(span.text()).toBe('American rap artist, actor and poet');
	});
});