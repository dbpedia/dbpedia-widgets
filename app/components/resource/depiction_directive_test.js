'use strict';

describe("depiction directive", function(){
	var elm, scope, $compile;

	beforeEach(module('gulp-ng'));
	beforeEach(inject(function($rootScope, _$compile_, _$httpBackend_) {
		elm = jQuery(
			'<img dbpedia-depiction resource="resource" />'
		);

		$compile = _$compile_;
		scope = $rootScope.$new();
		// $compile(elm)(scope);

		// scope.resource = {
		// 	"thumbnail": "http://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Tupac_Shakur_(rapper),_performing_live.jpg/200px-Tupac_Shakur_(rapper),_performing_live.jpg", 
		// 	"abstract": "An abstract", 
		// 	"facts": [],
		// 	"label": "Tupac Shakur",
		// 	"depiction": "http://upload.wikimedia.org/wikipedia/commons/1/13/Tupac_Shakur_(rapper),_performing_live.jpg",
		// };
		// scope.$digest();
	}));
	
	it('should bind the resource to the isolate scope', function () {
		scope.resource = {
			"thumbnail": "http://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Tupac_Shakur_(rapper),_performing_live.jpg/200px-Tupac_Shakur_(rapper),_performing_live.jpg", 
			"abstract": "An abstract", 
			"facts": [],
			"label": "Tupac Shakur",
			"depiction": "http://upload.wikimedia.org/wikipedia/commons/1/13/Tupac_Shakur_(rapper),_performing_live.jpg",
		};
		$compile(elm)(scope);
		//scope.$digest();
		var isolateScope = elm.isolateScope();
		expect(angular.equals(isolateScope.resource, scope.resource)).toBe(true);
	});

	it('should listen for the onload event', function () {
		var fakeImage = {};
		var spy = spyOn(window, 'Image').andReturn(fakeImage);

		scope.resource = {
			"thumbnail": "http://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Tupac_Shakur_(rapper),_performing_live.jpg/200px-Tupac_Shakur_(rapper),_performing_live.jpg", 
			"abstract": "An abstract", 
			"facts": [],
			"label": "Tupac Shakur",
			"depiction": "http://upload.wikimedia.org/wikipedia/commons/1/13/Tupac_Shakur_(rapper),_performing_live.jpg",
		};
		$compile(elm)(scope);

		expect(fakeImage.onload).toBeDefined();
		expect(typeof fakeImage.onload).toBe("function");
	});

	it('should listen for the onerror event', function () {
		var fakeImage = {};
		var spy = spyOn(window, 'Image').andReturn(fakeImage);

		scope.resource = {
			"thumbnail": "http://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Tupac_Shakur_(rapper),_performing_live.jpg/200px-Tupac_Shakur_(rapper),_performing_live.jpg", 
			"abstract": "An abstract", 
			"facts": [],
			"label": "Tupac Shakur",
			"depiction": "http://upload.wikimedia.org/wikipedia/commons/1/13/Tupac_Shakur_(rapper),_performing_live.jpg",
		};
		$compile(elm)(scope);

		expect(fakeImage.onerror).toBeDefined();
		expect(typeof fakeImage.onerror).toBe("function");
	});


	it('should preload the thumbnail', function () {
		var fakeImage = {};
		var spy = spyOn(window, 'Image').andReturn(fakeImage);

		scope.resource = {
			"thumbnail": "http://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Tupac_Shakur_(rapper),_performing_live.jpg/200px-Tupac_Shakur_(rapper),_performing_live.jpg", 
			"abstract": "An abstract", 
			"facts": [],
			"label": "Tupac Shakur",
			"depiction": "http://upload.wikimedia.org/wikipedia/commons/1/13/Tupac_Shakur_(rapper),_performing_live.jpg",
		};
		$compile(elm)(scope);

		expect(spy).toHaveBeenCalled();
		expect(fakeImage.src).toBe(scope.resource.thumbnail, 'thumbnail not being loaded');
	});

	describe('thumbnail load', function () {
		it('should set the image tag attribute to the preloaded image', function () {
			var fakeImage = {};
			var spy = spyOn(window, 'Image').andReturn(fakeImage);

			scope.resource = {
				"thumbnail": "http://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Tupac_Shakur_(rapper),_performing_live.jpg/200px-Tupac_Shakur_(rapper),_performing_live.jpg", 
				"abstract": "An abstract", 
				"facts": [],
				"label": "Tupac Shakur",
				"depiction": "http://upload.wikimedia.org/wikipedia/commons/1/13/Tupac_Shakur_(rapper),_performing_live.jpg",
			};
			$compile(elm)(scope);

			fakeImage.onload();
			expect(elm.attr('src')).toBe(scope.resource.thumbnail);
		});
	});

	describe('thumbnail error', function () {
		it('should try to load the full depiction', function () {
			// body...
		});
	});



	xit('should attempt to display the thumbnail first', function () {
		var label = elm.find('label.predicate');
		expect(label.length).toBe(1, 'predicate label missing');
		expect(label.html()).toBe('Birth date', 'incorrect label');
	});

	xit('should display all fact objects', function () {
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

	xdescribe('isURI', function () {
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

});