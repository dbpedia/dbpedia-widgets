(function(){
    'use strict';

    function dbpediaResourceView() {
        return {
            restrict: 'E',
            template: 
            //'<div class="wrapper" ng-if="results">' +
                // '<img dbpedia-depiction resource="resource" />' +
                // '<a class="heading" href="{{ resource.wikipedia }}" target="_blank">{{ resource.label }}</a>'+
                // '<p class="comment">{{ resource.comment }}</p>' + 
                // '<div class="clear"></div>' + 

                '<div class="media" style="overflow:visible;">' +
                    '<div class="pull-left thumbnail" href="#">' +
                        '<img class="media-object" dbpedia-depiction resource="resource">' +
                    '</div>' +
                    '<div class="media-body" style="overflow:visible;">' +
                        '<h4 class="media-heading">' +
                            '<a class="heading" href="{{ resource.wikipedia }}" target="_blank">' +
                                '{{ resource.label }}' +
                            '</a>' +
                        '</h4>' +
                        '<p class="comment">{{ resource.comment }}</p>' + 
                    '</div>' +
                '</div>' +
                '<div class="clear"></div>' +
                '<ul>' +
                    '<li ng-repeat="groupedFacts in resource.facts">' + 
                        '<dbpedia-grouped-facts facts="groupedFacts">' +
                        '</dbpedia-grouped-facts>' +
                    '</li>' +
                '</ul>',
            //'</div>',
            scope: {
                resource: '='       //two-way parent scope binding
            }
        };
    }

    angular.module('gulp-ng')
        .directive('dbpediaResourceView', dbpediaResourceView);
})();