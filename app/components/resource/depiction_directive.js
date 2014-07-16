(function(){
	'use strict';

	function dbpediaDepiction() {
		return {
			restrict: 'A',
			scope: {
				resource: '='
			},
			link: function (scope, element) {
				//try to list first the thumbnail
				var image = new Image();

				//the event handlers should be defined before
				//attempting to load the image. This will cause the event to fire event for 
				//cached images
				//http://fragged.org/preloading-images-using-javascript-the-right-way-and-without-frameworks_744.html
				image.onload = function () {
					element.attr('src', scope.resource.thumbnail);
				};

				image.onerror = function () {
				};

				image.src = scope.resource.thumbnail;
				// im
				//if that fails load the full depiction

				//if all fails remove image completely
			}
		};
	}

	angular.module('gulp-ng')
		.directive('dbpediaDepiction', dbpediaDepiction);

})();