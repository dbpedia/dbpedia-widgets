(function(){
    'use strict';

    function dbpediaResourceView() {
        return {
            restrict: 'E',
            template: 
                '<div class="resource-depiction">' +
                    '<img class="media-object img-thumbnail" dbpedia-depiction resource="resource">' +
                '</div>' +
                '<div class="resource-header">' +
                    '<a class="heading" href="{{ resource.wikipedia }}" target="_blank">' +
                        '{{ resource.label }}' +
                    '</a>' +
                    '<p class="comment">{{ resource.comment }}</p>' + 
                '</div>' +
                '<div class="grouped-facts-container">' +
                    '<div class="generic-facts">' +
                        '<label class="group-header">About</label>' +
                        '<p class="content">' +
                            '{{ resource.comment }}' +
                        '</p>' +
                    '</div>' +
                    '<dbpedia-grouped-facts facts="groupedFacts" ng-repeat="groupedFacts in resource.facts">' +
                    '</dbpedia-grouped-facts>' +
                '</div>',
            scope: {
                resource: '='       //two-way parent scope binding
            }
        };
    }

    angular.module('gulp-ng')
        .directive('dbpediaResourceView', dbpediaResourceView);
})();