'use strict';

describe("resource_view_directive_test", function(){
	var elm, scope;

	beforeEach(module('gulp-ng'));
	beforeEach(inject(function($rootScope, $compile) {
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

	xit('should display the resource facts using the typed-resource-view directive', function() {
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

		var typedResourceView = elm.find('typed-resource-view');
		expect(typedResourceView.length).toBe(1);
		expect(typedResourceView.attr('resource')).toBe('facts');
	});

});