'use strict';

describe("resource_view_directive_test", function(){
	var displayConfiguration, 
		$httpBackend,
		samplePersonConfiguration = {
			"Person": [
				{
					label: "Occupation",
					from: "http://dbpedia.org/ontology/occupation",
				}
			]
		};

	beforeEach(module('gulp-ng'));
	beforeEach(inject(function($rootScope, $compile, _displayConfiguration_, _$httpBackend_) {
		displayConfiguration = _displayConfiguration_;
		$httpBackend = _$httpBackend_;

		$httpBackend.when('GET', '/assets/configurations/xmlns.com/foaf/0.1/Person.json')
					.respond(samplePersonConfiguration);
	}));

	it('should have a getConfigurationURL function', function() {
		expect(displayConfiguration.getConfigurationURL).toBeDefined();
		expect(typeof displayConfiguration.getConfigurationURL).toBe('function');
	});

	describe('function getConfigurationURL', function () {
		it('should get the location for the display configuration for a given type', function () {
			var typeURI = 'http://xmlns.com/foaf/0.1/Person';
			var expectedURL = '/assets/configurations/xmlns.com/foaf/0.1/Person.json';
			var actualURL = displayConfiguration.getConfigurationURL(typeURI);
			expect(actualURL).toBe(expectedURL);


			typeURI = 'http://dbpedia.org/ontology/Artist';
			expectedURL = '/assets/configurations/dbpedia.org/ontology/Artist.json';
			actualURL = displayConfiguration.getConfigurationURL(typeURI);
			expect(actualURL).toBe(expectedURL);
		});
	});

	it('should have a forType function', function() {
		expect(displayConfiguration.forType).toBeDefined();
		expect(typeof displayConfiguration.forType).toBe('function');
	});

	describe('function forType', function () {

		it('should call getConfigurationURL to get the location of the for the given uri', function () {
			var typeURI = 'http://xmlns.com/foaf/0.1/Person';
			spyOn(displayConfiguration, 'getConfigurationURL');
			displayConfiguration.forType(typeURI)
			expect(displayConfiguration.getConfigurationURL).toHaveBeenCalledWith(typeURI);
		});
		
		it('should request the JSON configuration for the given type', function() {
			var typeURI = 'http://xmlns.com/foaf/0.1/Person';
			$httpBackend.expectGET('/assets/configurations/xmlns.com/foaf/0.1/Person.json');

			var promise = displayConfiguration.forType(typeURI);
			var configuration;

			promise.then(function (response) {
				configuration = response.data;
			});

			$httpBackend.flush();
			expect(configuration).toEqual(samplePersonConfiguration);
		});
	});
});