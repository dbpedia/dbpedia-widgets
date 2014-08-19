(function(){
	'use strict';

	/*
		Directive to create a textbox w/ dbpedia auto suggest functionality
	*/
	function dbpediaAutosuggest() {
		return {
			restrict: 'E', //restrict to an elemnt, TODO: change to attribute
			replace: true, //TODO: stop using replace, depricated.
			template: '<input type="text" placeholder="{{placeholder}}" class="form-control" style="height:45px;font-size: 1.3em;" />',
			scope: {
				placeholder: '@', 	//one-way attribute binding
				selection: '='		//two-way parent scope binding
			},
			link: function (scope, element) {

				//listen for a selection on the suggestions drop down list
				element.on('dbpedia.select', function (e, value) {
					//update the selection
					scope.$apply(function () {
						scope.selection = value;
					});
				});

				//start the jQuery plugin
				element.dbpediaAutosuggest();
			}
		};
	}

	angular.module('gulp-ng')
		.directive('dbpediaAutosuggest', dbpediaAutosuggest);
})();