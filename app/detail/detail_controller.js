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
      $scope.resource = {};
      $scope.resource.facts = {
        "head": {
          "vars": [ "p" , "predicate_label" , "o" , "object_label" , "rank" ]
        },
        "results": {
          "bindings": [
            {
              "p": { "type": "uri" , "value": "http://www.w3.org/2000/01/rdf-schema#label" },
              "predicate_label": { "type": "literal" , "value": "label" },
              "o": { "type": "literal" , "xml:lang": "en" , "value": "A Sample Label" }
            },
            {
              "p": { "type": "uri" , "value": "http://dbpedia.org/ontology/abstract" },
              "predicate_label": { "type": "literal" , "value": "has abstract" },
              "o": { "type": "literal" , "xml:lang": "en" , "value": "A Sample Abstract" }
            },
            {
              "p": { "type": "uri" , "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" },
              "predicate_label": { "type": "literal" , "value": "type" },
              "o": { "type": "uri" , "value": "http://xmlns.com/foaf/0.1/Person" },
              "object_label": { "type": "literal" , "value": "Person" }
            },
            {
              "p": { "type": "uri" , "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" },
              "predicate_label": { "type": "literal" , "value": "type" },
              "o": { "type": "uri" , "value": "http://dbpedia.org/ontology/Artist" },
              "object_label": { "type": "literal" , "xml:lang": "en" , "value": "artist" }
            },
            {
              "p": { "type": "uri" , "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type" },
              "predicate_label": { "type": "literal" , "value": "type" },
              "o": { "type": "uri" , "value": "http://dbpedia.org/class/yago/Rapper110507482" }
            }
          ]
        }
      };


    });

})();