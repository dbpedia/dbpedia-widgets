'use strict';

describe("resource_view_directive_test", function(){
	var elm, scope;

	beforeEach(module('gulp-ng'));
	beforeEach(inject(function($rootScope, $compile, _$httpBackend_) {
		elm = jQuery(
			'<div>' +
				'<dbpedia-resource-view resource="facts">' +
				'</dbpedia-resource-view>' +
			'</div>'
		);

		scope = $rootScope.$new();
		scope.facts = {
			"uri": "http://dbpedia.org/resource/Sample",
			"lang": "en",
			"label": "A Sample Label",
			"alt-label": "",
			"depiction": "http://upload.wikimedia.org/wikipedia/commons/1/13/Tupac_Shakur_(rapper),_performing_live.jpg",
			"type": "http://xmlns.com/foaf/0.1/Person",
			"abstract": "A Sample Abstract",
			"comment": "A Sample Comment",
			"wikipedia": "http://en.wikipedia.org/wiki/Sample",
			"facts": [
				{
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
				},
				{
					"type": "group",
					"id": "bio",
					"facts": [
						{
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
						},
						{
							"predicate": {
								"type": "uri",
								"value": "http://dbpedia.org/ontology/birthPlace",
								"label": "Birth place"
							},
							"objects": [
								{
									"type": "uri",
									"value": "http://dbpedia.org/resource/New_York_City",
									"label": "New York City"
								}
							]
						},
						{
							"predicate": {
								"type": "uri",
								"value": "http://dbpedia.org/ontology/deathDate",
								"label": "Death date"
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
								"value": "http://dbpedia.org/ontology/deathPlace",
								"label": "Death place"
							},
							"objects": [
								{
									"type": "uri",
									"value": "http://dbpedia.org/resource/Las_Vegas",
									"label": "Las Vegas"
								}
							]
						}
					]
				},
				{
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
				}
			]
		};

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

	it('should display the label from the resource facts in an anchor', function() {
		var heading = elm.find('a.heading');
		expect(heading.length).toBe(1);
		expect(heading.html()).toBe('A Sample Label');
	});

	it('should link the label anchor tag to the wikipedia article', function() {
		var heading = elm.find('a.heading');
		expect(heading.length).toBe(1);
		expect(heading.attr("href")).toBe('http://en.wikipedia.org/wiki/Sample');
	});

	it('should open the label anchor tag in a new window', function() {
		var heading = elm.find('a.heading');
		expect(heading.length).toBe(1);
		expect(heading.attr("target")).toBe('_blank');
	});

	it('should display the comment from the resource facts', function() {
		var heading = elm.find('p.comment');
		expect(heading.length).toBe(1);
		expect(heading.html()).toBe('A Sample Comment');
	});

	it('should display the depiction of the resource', function () {
		var depiction = elm.find('img[dbpedia-depiction][resource="resource"]');
		expect(depiction.length).toBe(1);
	});


	it('should display each of the grouped facts', function() {
		//make sure a list item is created for each dbpedia-grouped-fact
		var listItems = elm.children('dbpedia-resource-view').children('ul').children('li');
		expect(listItems.length).toBe(3, 'Incorrect amount of list items');

		var typedResourceViews = elm.find('dbpedia-grouped-facts');
		expect(typedResourceViews.length).toBe(3, 'Incorrect amount of dbpedia-grouped-facts elements');
	});

	it('should pass the grouped facts to dbpedia-resource-view via the fact attribute', function() {
		var typedResourceViews = elm.find('dbpedia-grouped-facts[facts="groupedFacts"]');
		expect(typedResourceViews.length).toBe(3, 'Grouped facts not passed via the fact attribute');
	});
});