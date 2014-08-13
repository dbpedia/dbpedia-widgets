'use strict';

describe("detail_controller_test", function(){
    var scope,
        location,
        ctrl,
        expectedUri = 'http://dbpedia.com/sample/uri',
        resource,
        expectedResource = { "sample": "data" };

    beforeEach(module('gulp-ng'));

    beforeEach(function() {
        module(function($provide) {
            //define a proxyLocation value
            $provide.value('proxyLocation', 'http://localhost:8000/resource');
        });
    });

    beforeEach(inject(function($controller, $rootScope, _$location_, _resource_, $q) {
        scope = $rootScope.$new();
        location = _$location_;
        resource = _resource_;
        var routeParams = {
        	uri: expectedUri
        };


        spyOn(resource, 'fetch').andCallFake(function (uri) {
            var deferred = $q.defer();
            deferred.resolve({
                data : expectedResource
            });
            return deferred.promise;
        });

        ctrl = $controller('DetailCtrl', {
                    $scope: scope,
                    $routeParams: routeParams
                });
        scope.$digest();
    }));

    it("should set the scope uri to the search uri", function() {
    	expect(scope.uri).toBe(expectedUri);
	});

	it("should request the facts for the given resource uri", function() {
        expect(resource.fetch).toHaveBeenCalledWith(expectedUri);
	});

    it("should set the facts on the scope when the resource is resolved", function() {
        expect(scope.resource).toEqual(expectedResource);
    });

    describe('$scope.getWidgetURL', function () {
        it('should generate URL to the embed page', function () {
            location.path("/detail");
            location.search("uri", "http://dbpedia.com/resource/Sample");
            var url = location.url();

            var widgetUrl = scope.getWidgetURL();
            expect(widgetUrl).toEqual("http://server/embed.html#" + url + "&embed=true")
        })
        
    });
});


