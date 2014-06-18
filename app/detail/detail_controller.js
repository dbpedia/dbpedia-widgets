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
            },
            {
              "p": { "type": "uri" , "value": "http://dbpedia.org/ontology/occupation" } ,
              "predicate_label": { "type": "literal" , "xml:lang": "en" , "value": "occupation" } ,
              "o": { "type": "uri" , "value": "http://dbpedia.org/resource/Rapping" } ,
              "object_label": { "type": "literal" , "xml:lang": "en" , "value": "Rapping" } ,
              "rank": { "datatype": "http://www.w3.org/2001/XMLSchema#float" , "type": "typed-literal" , "value": "75.50723" }
            },
            {
              "p": { "type": "uri" , "value": "http://dbpedia.org/ontology/occupation" } ,
              "predicate_label": { "type": "literal" , "xml:lang": "en" , "value": "occupation" } ,
              "o": { "type": "uri" , "value": "http://dbpedia.org/resource/Actor" } ,
              "object_label": { "type": "literal" , "xml:lang": "en" , "value": "Actor" } ,
              "rank": { "datatype": "http://www.w3.org/2001/XMLSchema#float" , "type": "typed-literal" , "value": "303.58078" }
            },
            {
              "p": { "type": "uri" , "value": "http://dbpedia.org/ontology/birthDate" } ,
              "predicate_label": { "type": "literal" , "xml:lang": "en" , "value": "birth date" } ,
              "o": { "datatype": "http://www.w3.org/2001/XMLSchema#date" , "type": "typed-literal" , "value": "1971-06-15+02:00" }
            },
            {
              "p": { "type": "uri" , "value": "http://dbpedia.org/ontology/deathDate" } ,
              "predicate_label": { "type": "literal" , "xml:lang": "en" , "value": "death date" } ,
              "o": { "datatype": "http://www.w3.org/2001/XMLSchema#date" , "type": "typed-literal" , "value": "1996-09-12+02:00" }
            },
            {
              "p": { "type": "uri" , "value": "http://dbpedia.org/ontology/birthPlace" } ,
              "predicate_label": { "type": "literal" , "xml:lang": "en" , "value": "birth place" } ,
              "o": { "type": "uri" , "value": "http://dbpedia.org/resource/New_York_City" } ,
              "object_label": { "type": "literal" , "xml:lang": "en" , "value": "New York City" } ,
              "rank": { "datatype": "http://www.w3.org/2001/XMLSchema#float" , "type": "typed-literal" , "value": "813.0256" }
            },
            {
              "p": { "type": "uri" , "value": "http://dbpedia.org/ontology/birthPlace" } ,
              "predicate_label": { "type": "literal" , "xml:lang": "en" , "value": "birth place" } ,
              "o": { "type": "uri" , "value": "http://dbpedia.org/resource/New_York" } ,
              "object_label": { "type": "literal" , "xml:lang": "en" , "value": "New York" } ,
              "rank": { "datatype": "http://www.w3.org/2001/XMLSchema#float" , "type": "typed-literal" , "value": "625.0301" }
            },
            {
              "p": { "type": "uri" , "value": "http://dbpedia.org/ontology/deathPlace" } ,
              "predicate_label": { "type": "literal" , "xml:lang": "en" , "value": "death place" } ,
              "o": { "type": "uri" , "value": "http://dbpedia.org/resource/Las_Vegas" } ,
              "object_label": { "type": "literal" , "xml:lang": "en" , "value": "Las Vegas" } ,
              "rank": { "datatype": "http://www.w3.org/2001/XMLSchema#float" , "type": "typed-literal" , "value": "57.24966" }
            },
            {
              "p": { "type": "uri" , "value": "http://dbpedia.org/ontology/deathPlace" } ,
              "predicate_label": { "type": "literal" , "xml:lang": "en" , "value": "death place" } ,
              "o": { "type": "uri" , "value": "http://dbpedia.org/resource/Nevada" } ,
              "object_label": { "type": "literal" , "xml:lang": "en" , "value": "Nevada" } ,
              "rank": { "datatype": "http://www.w3.org/2001/XMLSchema#float" , "type": "typed-literal" , "value": "115.70988" }
            }
          ]
        }
      };


    });

})();