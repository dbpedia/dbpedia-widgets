(function () {
	'use strict';


	angular.module('gulp-ng')
		.config(function ($routeProvider) {
			$routeProvider
				.when('/detail', {
					templateUrl: 'detail/detail.html',
					controller: 'DetailCtrl'
				});
		})
		.controller('DetailCtrl', function ($scope, $routeParams, resource, $location, $sce) {
			$scope.uri = $routeParams.uri;
			resource.fetch($scope.uri).then(function (response) {
				$scope.resource = response.data;
			});
			$scope.modalOpen = false;
			$scope.toggleModal = function () {
				$scope.modalOpen = !$scope.modalOpen;
			};

			$scope.getEmbedCode = function () {
				var iframe = 
					'<iframe src="' + $scope.getWidgetURL() + '" ' + 
							'frameborder="0" ' + 
							'width="350"' +
							'height="400"' +
					'/>';
				return iframe;
			};

			$scope.sanitize = function (str) {
				return $sce.trustAsHtml(str);
			};

			$scope.getWidgetURL = function () {
				var p = $location.protocol();
				var h = $location.host();
				var port = $location.port();
				port = port !== 80 ? ":" + port : "";
				var url = $location.url();
				var path = 'embed.html';
				
				return p + "://" + h + port + "/" + path + "#" +  url;
			};

// 			$scope.resource = {
//     "thumbnail": "http://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Rakim_at_Paid_Dues_4.jpg/200px-Rakim_at_Paid_Dues_4.jpg",
//     "abstract": "William Michael Griffin Jr. (born January 28, 1968), known by his stage name Rakim, is an American rapper. One half of golden age hip hop duo Eric B. & Rakim, he is widely regarded as one of the most influential and most skilled MCs of all time. Eric B. & Rakim's classic album Paid in Full was named the greatest hip hop album of all time by MTV in 2006, while Rakim himself was ranked #4 on MTV's list of the Greatest MCs of All Time. Steve Huey of Allmusic stated that \"Rakim is near-universally acknowledged as one of the greatest MCs -- perhaps the greatest -- of all time within the hip-hop community. \" The editors of About. com ranked him #1 on their list of the Top 50 MCs of Our Time (1987–2007). Rakim began his career as the emcee of the rap duo Eric B. & Rakim, who in 2011 were nominated for induction into the Rock and Roll Hall of Fame. In 2012, The Source ranked him #1 on their list of the Top 50 Lyricists of All Time.",
//     "facts": [
//         {
//             "id": "Person",
//             "facts": [
//                 {
//                     "predicate": {
//                         "label": "Occupation",
//                         "value": "http://dbpedia.org/ontology/occupation"
//                     },
//                     "objects": [
//                         {
//                             "label": "Rapping",
//                             "type": "uri",
//                             "value": "http://dbpedia.org/resource/Rapping"
//                         }
//                     ]
//                 },
//                 {
//                     "predicate": {
//                         "label": "Birth Place",
//                         "value": "http://dbpedia.org/ontology/birthPlace"
//                     },
//                     "objects": [
//                         {
//                             "label": "Long Island",
//                             "type": "uri",
//                             "value": "http://dbpedia.org/resource/Long_Island"
//                         },
//                         {
//                             "label": "Wyandanch, New York",
//                             "type": "uri",
//                             "value": "http://dbpedia.org/resource/Wyandanch,_New_York"
//                         },
//                         {
//                             "label": "New York",
//                             "type": "uri",
//                             "value": "http://dbpedia.org/resource/New_York"
//                         }
//                     ]
//                 },
//                 {
//                     "predicate": {
//                         "label": "Birth Date",
//                         "value": "http://dbpedia.org/ontology/birthDate"
//                     },
//                     "objects": [
//                         {
//                             "type": "typed-literal",
//                             "value": "1968-01-27+02:00",
//                             "datatype": "http://www.w3.org/2001/XMLSchema#date"
//                         }
//                     ]
//                 }
//             ]
//         },
//         {
//             "id": "Musical Artist",
//             "facts": [
//                 {
//                     "predicate": {
//                         "label": "Genre",
//                         "value": [
//                             "http://dbpedia.org/ontology/genre",
//                             "http://dbpedia.org/property/genre"
//                         ]
//                     },
//                     "objects": [
//                         {
//                             "label": "Hip hop music",
//                             "type": "uri",
//                             "value": "http://dbpedia.org/resource/Hip_hop_music"
//                         }
//                     ]
//                 },
//                 {
//                     "predicate": {
//                         "label": "Record Label",
//                         "value": "http://dbpedia.org/ontology/recordLabel"
//                     },
//                     "objects": [
//                         {
//                             "label": "Island Records",
//                             "type": "uri",
//                             "value": "http://dbpedia.org/resource/Island_Records"
//                         },
//                         {
//                             "label": "4th & B'way Records",
//                             "type": "uri",
//                             "value": "http://dbpedia.org/resource/4th_&_B'way_Records"
//                         },
//                         {
//                             "label": "Aftermath Entertainment",
//                             "type": "uri",
//                             "value": "http://dbpedia.org/resource/Aftermath_Entertainment"
//                         },
//                         {
//                             "label": "MCA Records",
//                             "type": "uri",
//                             "value": "http://dbpedia.org/resource/MCA_Records"
//                         }
//                     ]
//                 },
//                 {
//                     "predicate": {
//                         "label": "Associated Artist",
//                         "value": [
//                             "http://dbpedia.org/ontology/associatedMusicalArtist",
//                             "http://dbpedia.org/property/associatedActs",
//                             "http://dbpedia.org/ontology/associatedBand"
//                         ]
//                     },
//                     "objects": [
//                         {
//                             "label": "DJ Premier",
//                             "type": "uri",
//                             "value": "http://dbpedia.org/resource/DJ_Premier"
//                         },
//                         {
//                             "label": "Pete Rock",
//                             "type": "uri",
//                             "value": "http://dbpedia.org/resource/Pete_Rock"
//                         },
//                         {
//                             "label": "Eric B. & Rakim",
//                             "type": "uri",
//                             "value": "http://dbpedia.org/resource/Eric_B._&_Rakim"
//                         },
//                         {
//                             "label": "Kool G Rap",
//                             "type": "uri",
//                             "value": "http://dbpedia.org/resource/Kool_G_Rap"
//                         },
//                         {
//                             "label": "Large Professor",
//                             "type": "uri",
//                             "value": "http://dbpedia.org/resource/Large_Professor"
//                         },
//                         {
//                             "label": "Big Daddy Kane",
//                             "type": "uri",
//                             "value": "http://dbpedia.org/resource/Big_Daddy_Kane"
//                         },
//                         {
//                             "label": "Marley Marl",
//                             "type": "uri",
//                             "value": "http://dbpedia.org/resource/Marley_Marl"
//                         },
//                         {
//                             "label": "Gang Starr",
//                             "type": "uri",
//                             "value": "http://dbpedia.org/resource/Gang_Starr"
//                         },
//                         {
//                             "label": "KRS-One",
//                             "type": "uri",
//                             "value": "http://dbpedia.org/resource/KRS-One"
//                         },
//                         {
//                             "label": "Clark Kent (producer)",
//                             "type": "uri",
//                             "value": "http://dbpedia.org/resource/Clark_Kent_(producer)"
//                         }
//                     ]
//                 }
//             ]
//         }
//     ],
//     "label": "Rakim",
//     "depiction": "http://upload.wikimedia.org/wikipedia/commons/7/78/Rakim_at_Paid_Dues_4.jpg",
//     "comment": "William Michael Griffin Jr. (born January 28, 1968), known by his stage name Rakim, is an American rapper. One half of golden age hip hop duo Eric B. & Rakim, he is widely regarded as one of the most influential and most skilled MCs of all time. Eric B. & Rakim's classic album Paid in Full was named the greatest hip hop album of all time by MTV in 2006, while Rakim himself was ranked #4 on MTV's list of the Greatest MCs of All Time."
// };
		});
})();