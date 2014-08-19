(function(){
	'use strict';

	/**
	* Loads the thumbnail depiction of a given resource.
	*/
	function dbpediaDepiction() {
		return {
			restrict: 'A', //retrict to an attribute
			scope: {
				resource: '=' //bind the resource attribute
			},
			link: function (scope, element) {
				//try to load the resource thumbnail
				var image = new Image();

				//the event handlers should be defined before
				//attempting to load the image. This will cause the event to fire event for 
				//cached images
				//http://fragged.org/preloading-images-using-javascript-the-right-way-and-without-frameworks_744.html
				image.onload = function () {
					//loading the image was a success
					//set the image src on the actual element
					element.attr('src', scope.resource.thumbnail);
				};

				/**
				* @todo Load the fill depiction of the thumbnail fails
				*/
				image.onerror = function () {

				};

				//set the src of the image
				image.src = scope.resource.thumbnail;

			}
		};
	}

	angular.module('gulp-ng')
		.directive('dbpediaDepiction', dbpediaDepiction);

})();