'use strict';

describe("app_controller_test", function(){
    var scope,
        location,
        ctrl,
        $window;

    beforeEach(module('gulp-ng'));

    beforeEach(inject(function($controller, $rootScope, _$location_, _$window_) {
        scope = $rootScope.$new();
        location = _$location_;
        $window = _$window_;

        ctrl = $controller('ApplicationCtrl', {
                    $scope: scope,
                    $location: location,
                    $window: $window
                });

        //https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$watch
        //triggers the call to $watch listeners triggered on the inital run
        //eventhough they watched value didnt actually change.
        //Do this so the unit test behaves like the real app
        scope.$digest();
    }));

    it("should start with no resource selected", function() {
    	expect(scope.resourceSelected).toBeUndefined();
	});
    
    it("should redirect to the /detail page when the resource selected changes", function() {

    	//change the resource selected
    	scope.resourceSelected = {
    		uri: 'http://dbpedia.org/resource/Tupac_Shakur'
    	};
    	//digest the change
    	scope.$digest();

    	//check that the path changed to - /detail?uri=http://dbpedia.org/resource/Tupac_Shakur
    	expect(location.path()).toBe("/detail");
    	expect(location.search().uri).toBe("http://dbpedia.org/resource/Tupac_Shakur");
	});

    it('should notify google analytics on every routeChangeSuccess event', function () {
        $window.ga = function () {};
        spyOn($window, 'ga');
        
        //mock the path fn output
        location.url = function () {
            return "#/detail?uri=http://dbpedia.org/resource/Sample";
        };

        scope.$emit('$routeChangeSuccess');
        expect($window.ga).toHaveBeenCalledWith('send', 'pageview', location.url());
    });
});