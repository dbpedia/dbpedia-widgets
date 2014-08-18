(function(){
    'use strict';

    /**
    * Displays all the facts of the resource given and handles paging
    * between sections in the embed mode.
    *
    * This directive is in charge of starting the process of 
    * displaying all the facts. It renders the generic facts like
    * depiction, label, wikipedia link, and comment. This directive
    * then calls the dbpedia-grouped-facts directive to render the facts
    * that are grouped together.
    *
    * @example resource = { label: 'A label', ..., facts: ['list of grouped facts'] }
    */
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
                //set the default section
                scope.activeSection = 'About';

                /**
                * Checks if there is a previous section to display
                * @returns {Boolean}
                */
                scope.hasPrevious = function () {
                    //check the active section is not the 'About' section
                    return scope.activeSection !== 'About';
                };

                /**
                * Checks if there is a next section to display
                * @returns {Boolean}
                */
                scope.hasNext = function () {
                    var hasNext = false;
                    var lastItem;
                    //check if there is another section to 
                    //go to
                    if (scope.resource.facts.length) {
                        //get the section 
                        lastItem = scope.resource.facts[scope.resource.facts.length -1];
                        //check if the the last section is the active one
                        hasNext = scope.activeSection !== lastItem.id;
                    }
                    return hasNext;
                };

                /**
                * Activates/displays the previous section
                */
                scope.showPrevious = function () {
                    if (scope.activeIndex === 0) {
                        //move to the 'About' section
                        scope.activeSection = 'About';
                    }
                    else
                    {
                        //move to the previous section
                        scope.activeIndex--;
                        scope.activeSection = scope.resource.facts[scope.activeIndex].id;
                    }
                };

                /**
                * Activates/displays the next section
                */
                scope.showNext = function () {
                    if (scope.activeSection === 'About') {
                        //move to the first section of grouped facts
                        scope.activeIndex = 0;
                        scope.activeSection = scope.resource.facts[0].id;
                    }
                    else
                    {
                        //move to the next section of grouped facts
                        scope.activeIndex++;
                        scope.activeSection = scope.resource.facts[scope.activeIndex].id;
                    }
                };

                /**
                * generate the classes for a section
                * @params {string} id - the id of the section for which we are generating the classes for
                * @returns {object}
                */
                scope.getSectionClasses = function (id) {
                    id = id || 'About'; //default to the 'About' section

                    //set the active-facts class to true if 
                    //the id matches the activeSection
                    return {
                        'active-facts': scope.activeSection === id
                    };
                };
            }
        };
    }

    angular.module('gulp-ng')
        .directive('dbpediaResourceView', dbpediaResourceView);
})();