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
                    '<div class="pager">' + 
                        '<a class="prev" ng-if="hasPrevious()" ng-click="showPrevious()">Prev</a>' + 
                        '<a class="next" ng-if="hasNext()" ng-click="showNext()">Next</a>' + 
                    '</div>' +
                    '<div ng-class="getSectionClasses()" class="generic-facts">' +
                        '<label class="group-header">About</label>' +
                        '<p class="content">' +
                            '{{ resource.comment }}' +
                        '</p>' +
                    '</div>' +
                    '<dbpedia-grouped-facts facts="groupedFacts" ng-repeat="groupedFacts in resource.facts" ng-class="getSectionClasses(groupedFacts.id)">' +
                    '</dbpedia-grouped-facts>' +
                '</div>',
            scope: {
                resource: '='       //two-way parent scope binding
            },
            link: function (scope) {
                scope.activeSection = 'About';

                scope.hasPrevious = function () {
                    return scope.activeSection !== 'About';
                }

                scope.hasNext = function () {
                    var hasNext = false;
                    var lastItem;
                    if (scope.resource.facts.length) {
                        lastItem = scope.resource.facts[scope.resource.facts.length -1];
                        hasNext = scope.activeSection !== lastItem.id;
                    }
                    return hasNext;
                };

                scope.showPrevious = function () {
                    if (scope.activeIndex === 0) {
                        scope.activeSection = 'About'
                    }
                    else
                    {
                        scope.activeIndex--;
                        scope.activeSection = scope.resource.facts[scope.activeIndex].id;
                    }
                }

                scope.showNext = function () {
                    if (scope.activeSection === 'About') {
                        scope.activeIndex = 0;
                        scope.activeSection = scope.resource.facts[0].id;
                    }
                    else
                    {
                        scope.activeIndex++;
                        scope.activeSection = scope.resource.facts[scope.activeIndex].id;
                    }
                }

                scope.getSectionClasses = function (id) {
                    id = id || 'About';

                    return {
                        'active-facts': scope.activeSection === id
                    };
                }
            }
        };
    }

    angular.module('gulp-ng')
        .directive('dbpediaResourceView', dbpediaResourceView);
})();