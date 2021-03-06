'use strict';

describe("resource_service_test", function(){
	var elm, scope, resourceService, $httpBackend;

	beforeEach(module('gulp-ng'));
	
	beforeEach(function() {
		module(function($provide) {
			//define a proxyLocation value
			$provide.value('proxyLocation', 'http://localhost:8000/resource');
		});
	});

	beforeEach(inject(function(resource, _$httpBackend_) {
		resourceService = resource;
		$httpBackend = _$httpBackend_;
	}));
	
	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	it('should have a function fetch', function () {
		expect(resourceService.fetch).toBeDefined();
		expect(typeof resourceService.fetch).toBe("function");
	});

	describe('fetch', function () {
		it('should make a request using the proxyLocation and uri values provided', function () {
			var uri = "http://dbpedia.org/resource/Sample";
			$httpBackend
				.expectGET('http://localhost:8000/resource/' + uri)
				.respond(200, '{}');

			resourceService.fetch(uri);
			$httpBackend.flush();
		});

		it('should return a promise', function () {
			var uri = "http://dbpedia.org/resource/Sample";
			var expectedValue = { "sample": "value" };

			$httpBackend
				.whenGET('http://localhost:8000/resource/' + uri)
				.respond(200, JSON.stringify(expectedValue));

			var promise = resourceService.fetch(uri);

			//check that its a promise w/ a then function
			expect(typeof promise.then).toBe('function');

			//make sure it resolved to the correct value
			$httpBackend.flush();
			promise.then(function (response) {
				expect(response.data).toEqual(expectedValue);
			});
		});
	});
});