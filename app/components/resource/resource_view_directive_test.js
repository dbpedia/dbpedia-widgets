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

	// it('request the facts for the given resource uri', function() {
	// 	expect(false).toBe(true);
	// });
	
	it('should create a wrapper div', function () {
		var wrapper = elm.children('div.wrapper');
		expect(wrapper.length).toBe(1);
	});

	it('should display nothing when the facts are missing', function () {
		var wrapper = elm.children('div');
		expect(wrapper.children().length).toBe(1);
		expect(heading.html()).toBe('Tupac Shakur');
	});

	it('should display the label from the resource facts', function() {
		console.log(elm);
		var heading = elm.find('label.heading');
		scope.facts = {
			"head": {
				"vars": [ "p" , "predicate_label" , "o" , "object_label" , "rank" ]
			},
			"results": {
				"bindings": [
					{
						"p": { "type": "uri" , "value": "http://www.w3.org/2000/01/rdf-schema#label" },
						"predicate_label": { "type": "literal" , "value": "label" },
						"o": { "type": "literal" , "xml:lang": "en" , "value": "Tupac Shakur" }
					}
				]
			}
		};
		scope.$apply();
		expect(heading.length).toBe(1);
		expect(heading.html()).toBe('Tupac Shakur');
	});

	xit('should display the depiction for the resource if available', function() {
		expect(false).toBe(true);
	});

	xit('should display the thumbnail for the resource when the depiction fails', function() {
		expect(false).toBe(true);
	});

	xit('should hide the depiction/thumbnail if they fail to load', function() {
		expect(false).toBe(true);
	});

	xit('should display the abstract for the resource', function() {
		expect(false).toBe(true);
	});
});