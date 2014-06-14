'use strict';

describe("detail_controller_test", function(){
    var scope,
        location,
        ctrl,
        expectedUri = 'http://dbpedia.com/sample/uri';

    beforeEach(module('gulp-ng'));

    beforeEach(inject(function($controller, $rootScope, _$location_) {
        scope = $rootScope.$new();
        location = _$location_;
        var routeParams = {
        	uri: expectedUri
        };
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
    	expect(false).toBe(true);
	});
});