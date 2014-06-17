'use strict';

describe("resource_view_directive_test", function(){
	var elm, scope, displayConfiguration;


	var $httpBackend,
		personTypeURI = 'http://xmlns.com/foaf/0.1/Person',
		samplePersonConfiguration = {
			"Person": [
				{
					label: "Occupation",
					from: "http://dbpedia.org/ontology/occupation",
				}
			]
		},
		artistTypeURI = 'http://dbpedia.org/ontology/Artist',
		sampleArtistConfiguration = {
			"Musical Artist": [
				{
					label: "Genre",
					from: ["http://dbpedia.org/ontology/genre", "http://dbpedia.org/property/genre"]
				}
			]
		},
		yagoRapperTypeURI = 'http://dbpedia.org/class/yago/Rapper110507482';

	beforeEach(module('gulp-ng'));
	
	
	beforeEach(inject(function($rootScope, $compile, _displayConfiguration_, _$httpBackend_) {
		displayConfiguration = _displayConfiguration_;
		$httpBackend = _$httpBackend_;

		spyOn(displayConfiguration, 'forType').andCallThrough();

		//train httpBackend w/ a couple responses
		$httpBackend.when('GET', displayConfiguration.getConfigurationURL(personTypeURI))
					.respond(samplePersonConfiguration);

		$httpBackend.when('GET', displayConfiguration.getConfigurationURL(artistTypeURI))
					.respond(sampleArtistConfiguration);

		$httpBackend.when('GET', displayConfiguration.getConfigurationURL(yagoRapperTypeURI))
					.respond(404, '');

		elm = jQuery(
			'<div>' +
				'<dbpedia-resource-view resource="facts">' +
				'</dbpedia-resource-view>' +
			'</div>'
		);

		scope = $rootScope.$new();
		$compile(elm)(scope);
		scope.$digest();
	}));
	
	xit('should create a wrapper div when there are facts for the resource', function () {
		scope.facts = {
			"head": {
				"vars": [ "p" , "predicate_label" , "o" , "object_label" , "rank" ]
			},
			"results": {
				"bindings": [
					{
						"p": { "type": "uri" , "value": "http://www.w3.org/2000/01/rdf-schema#label" },
						"predicate_label": { "type": "literal" , "value": "label" },
						"o": { "type": "literal" , "xml:lang": "en" , "value": "A Sample Label" }
					}
				]
			}
		};
		scope.$apply();

		var wrapper = elm.find('div.wrapper');
		expect(wrapper.length).toBe(1);
	});

	xit('should display nothing when there are no facts for the resource', function () {
		var wrapper = elm.children('div');
		//expect(wrapper.length).toBe(0);
		expect(elm.is(':empty')).toBe(true);
	});

	it('should display the label from the resource facts', function() {
		scope.facts = {
			"head": {
				"vars": [ "p" , "predicate_label" , "o" , "object_label" , "rank" ]
			},
			"results": {
				"bindings": [
					{
						"p": { "type": "uri" , "value": "http://www.w3.org/2000/01/rdf-schema#label" },
						"predicate_label": { "type": "literal" , "value": "label" },
						"o": { "type": "literal" , "xml:lang": "en" , "value": "A Sample Label" }
					}
				]
			}
		};
		scope.$apply();

		var heading = elm.find('label.heading');
		expect(heading.length).toBe(1);
		expect(heading.html()).toBe('A Sample Label');
	});

	it('should display the abstract from the resource facts', function() {
		scope.facts = {
			"head": {
				"vars": [ "p" , "predicate_label" , "o" , "object_label" , "rank" ]
			},
			"results": {
				"bindings": [
					{
						"p": { "type": "uri" , "value": "http://dbpedia.org/ontology/abstract" },
						"predicate_label": { "type": "literal" , "value": "has abstract" },
						"o": { "type": "literal" , "xml:lang": "en" , "value": "A Sample Abstract" }
					}
				]
			}
		};
		scope.$apply();

		var heading = elm.find('p.abstract');
		expect(heading.length).toBe(1);
		expect(heading.html()).toBe('A Sample Abstract');
	});

	it('should request the display configuration for every rfd type from the resource facts', function() {
		scope.facts = {
			"head": {
				"vars": [ "p" , "predicate_label" , "o" , "object_label" , "rank" ]
			},
			"results": {
				"bindings": [
					{
						"p": { "type": "uri" , "value": "http://www.w3.org/2000/01/rdf-schema#label" },
						"predicate_label": { "type": "literal" , "value": "label" },
						"o": { "type": "literal" , "xml:lang": "en" , "value": "A Sample Label" }
					},
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
					}
				]
			}
		};
		scope.$apply();

		//make sure it only requests for configurations of rdf types
		//http://www.w3.org/1999/02/22-rdf-syntax-ns#type
		var expectedTypes = [
				['http://xmlns.com/foaf/0.1/Person'],
				['http://dbpedia.org/ontology/Artist'],
				['http://dbpedia.org/class/yago/Rapper110507482']
			];

		expect(displayConfiguration.forType).toHaveBeenCalled();
		expect(displayConfiguration.forType.callCount).toBe(expectedTypes.length);
		expect(displayConfiguration.forType.argsForCall).toEqual(expectedTypes);
	});


	it('should maintain a list of display configurations for all the known types', function() {
		scope.facts = {
			"head": {
				"vars": [ "p" , "predicate_label" , "o" , "object_label" , "rank" ]
			},
			"results": {
				"bindings": [
					{
						"p": { "type": "uri" , "value": "http://www.w3.org/2000/01/rdf-schema#label" },
						"predicate_label": { "type": "literal" , "value": "label" },
						"o": { "type": "literal" , "xml:lang": "en" , "value": "A Sample Label" }
					},
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
					}
				]
			}
		};
		scope.$apply();
		$httpBackend.flush(3);

		var expectedKnownTypes = [
			samplePersonConfiguration,
			sampleArtistConfiguration
		];

		var directiveIsolateScope = elm.children().isolateScope();
		var knownTypes = directiveIsolateScope.knownTypes;
		expect(knownTypes.length).toBe(expectedKnownTypes.length);
		//use angular.equals so $ properties are ignored.
		//the $ properties are added when the ng-repeat assigns a template 
		//instance a new scope
		expect(angular.equals(knownTypes, expectedKnownTypes)).toBe(true);
	});


	it('should display a dbpedia-typed-resource-view for each known type', function() {
		scope.facts = {
			"head": {
				"vars": [ "p" , "predicate_label" , "o" , "object_label" , "rank" ]
			},
			"results": {
				"bindings": [
					{
						"p": { "type": "uri" , "value": "http://www.w3.org/2000/01/rdf-schema#label" },
						"predicate_label": { "type": "literal" , "value": "label" },
						"o": { "type": "literal" , "xml:lang": "en" , "value": "A Sample Label" }
					},
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
					}
				]
			}
		};
		scope.$apply();
		$httpBackend.flush(3);

		//make sure a list item is created for each dbpedia-typed-resource-view
		var listItems = elm.find('li');
		expect(listItems.length).toBe(2);

		var typedResourceViews = elm.find('dbpedia-typed-resource-view');
		expect(typedResourceViews.length).toBe(2);
	});
});