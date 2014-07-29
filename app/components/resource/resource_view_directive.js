(function(){
    'use strict';

    function dbpediaResourceView() {
        return {
            restrict: 'E',
            template: 
                //'<div class="card" style="height: 100%;">' +
                    '<div class="resource-depiction">' +
                        '<img class="media-object img-thumbnail" dbpedia-depiction resource="resource">' +
                    '</div>' +
                    // '<div class="media-body" style="overflow:visible;">' +
                    //     '<h4 class="media-heading">' +
                    //         '<a class="heading" href="{{ resource.wikipedia }}" target="_blank">' +
                    //             '{{ resource.label }}' +
                    //         '</a>' +
                    //     '</h4>' +
                    //     '<p class="comment">{{ resource.comment }}</p>' + 
                    // '</div>' +
                    '<div class="resource-header">' +
                        '<a class="heading" href="{{ resource.wikipedia }}" target="_blank">' +
                            '{{ resource.label }}' +
                        '</a>' +
                        '<p class="comment">{{ resource.comment }}</p>' + 
                    '</div>' +
                    '<div class="grouped-facts-container card-copy">' +
                        '<div class="generic-facts">' +
                            '<label class="group-header">About</label>' +
                            '<p class="content">' +
                                '{{ resource.comment }}' +
                            '</p>' +
                        '</div>' +
                        '<dbpedia-grouped-facts facts="groupedFacts" ng-repeat="groupedFacts in resource.facts">' +
                        '</dbpedia-grouped-facts>' +
                    '</div>',// +
                //'</div>',
            scope: {
                resource: '='       //two-way parent scope binding
            }
        };
    }

    angular.module('gulp-ng')
        .directive('dbpediaResourceView', dbpediaResourceView);
})();