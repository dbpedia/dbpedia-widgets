(function(){
	'use strict';

	function dbpediaAutosuggest() {
		return {
			restrict: 'E',
			replace: true,
			template: '<input type="text" placeholder="{{placeholder}}" class="form-control" style="height:45px;font-size: 1.3em;" />',
			scope: {
				placeholder: '@', 	//one-way attribute binding
				selection: '='		//two-way parent scope binding
			},
			link: function (scope, element) {

				element.on('dbpedia.select', function (e, value) {
					scope.$apply(function () {
						scope.selection = value;
					});
				});

				element.dbpediaAutosuggest();
			}
		};
	}

	angular.module('gulp-ng')
		.directive('dbpediaAutosuggest', dbpediaAutosuggest);
})();