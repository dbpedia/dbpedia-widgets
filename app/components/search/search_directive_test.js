'use strict';

describe("search_directive_test", function(){
    var elm, scope;

    beforeEach(module('gulp-ng'));

    beforeEach(inject(function($rootScope, $compile) {
        elm = jQuery(
            '<header>' +
                '<dbpedia-autosuggest placeholder="{{placeholder}}" selection="selectedResource">' + 
                '</dbpedia-autosuggest>' +
            '</header>'
        );

        scope = $rootScope.$new();
        scope.placeholder = 'placeholder text';
        $compile(elm)(scope);
        scope.$digest();
    }));

    it('should create an input field type text', function() {
    	var input = elm.find('input[type="text"]');
        expect(input.length).toBe(1);
	});

    it('should create an input field with the given placeholder text', function() {
        var input = elm.find('input[type="text"]');
        expect(input.attr('placeholder')).toBe('placeholder text');
    });

    it('should instantiate the dbpedia-autosuggest jQuery plugin', function() {
        var input = elm.find('input[type="text"]');
        var dbpediaAutosuggestData = input.data('plugin_dbpediaAutosuggest');
        expect(dbpediaAutosuggestData).toBeDefined();
    });

    it('should update the model when an item is selected', function() {
        var input = elm.find('input[type="text"]');
        var expectedValue = { label: "test", uri: 'http://dbpedia.com/resource/test' };
        //trigger the event manually
        input.trigger("dbpedia.select", expectedValue);
        expect(scope.selectedResource).toBe(expectedValue);
    });
});