(function(){
  'use strict';


  angular.module('gulp-ng')
    .config(function ($routeProvider) {
      $routeProvider
        .when('/detail', {
          templateUrl: 'detail/detail.html',
          controller: 'DetailCtrl'
        });
    })
    .controller('DetailCtrl', function ($scope, $routeParams) {
      $scope.uri = $routeParams.uri;
    });

})();