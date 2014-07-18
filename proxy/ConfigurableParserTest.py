import unittest
from unittest.mock import *

from tornado.testing import AsyncTestCase

import string
from ConfigurableParser import ConfigurableParser
import json


class ConfigurableParserTest(AsyncTestCase):
    
    def setUp(self):
        AsyncTestCase.setUp(self)


    def test_parse_processes_each_type(self):
        facts = [
            {
                "p": {
                    "type": "uri",
                    "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
                },
                "predicate_label": {
                    "type": "literal",
                    "value": "type"
                },
                "o": {
                    "type": "uri",
                    "value": "http://www.w3.org/2002/07/owl#Thing"
                },
                "object_label": {
                    "type": "literal",
                    "value": "Thing"
                }
            },
            {
                "p": {
                    "type": "uri",
                    "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
                },
                "predicate_label": {
                    "type": "literal",
                    "value": "type"
                },
                "o": {
                    "type": "uri",
                    "value": "http://xmlns.com/foaf/0.1/Person"
                },
                "object_label": {
                    "type": "literal",
                    "value": "Person"
                }
            },
            {
                "p": {
                    "type": "uri",
                    "value": "http://dbpedia.org/ontology/hometown"
                },
                "predicate_label": {
                    "type": "literal",
                    "xml:lang": "en",
                    "value": "home town"
                },
                "o": {
                    "type": "uri",
                    "value": "http://dbpedia.org/resource/California"
                },
                "object_label": {
                    "type": "literal",
                    "xml:lang": "en",
                    "value": "California"
                },
                "rank": {
                    "datatype": "http://www.w3.org/2001/XMLSchema#float",
                    "type": "typed-literal",
                    "value": "733.00195"
                }
            },
            {
                "p": {
                    "type": "uri",
                    "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
                },
                "predicate_label": {
                    "type": "literal",
                    "value": "type"
                },
                "o": {
                    "type": "uri",
                    "value": "http://dbpedia.org/ontology/MusicalArtist"
                },
                "object_label": {
                    "type": "literal",
                    "xml:lang": "en",
                    "value": "musical artist"
                }
            },
            {
                "p": {
                    "type": "uri",
                    "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
                },
                "predicate_label": {
                    "type": "literal",
                    "value": "type"
                },
                "o": {
                    "type": "uri",
                    "value": "http://dbpedia.org/ontology/Person"
                },
                "object_label": {
                    "type": "literal",
                    "xml:lang": "en",
                    "value": "person"
                }
            }
        ]

        parser = ConfigurableParser(facts)
        parser.process_type = Mock()

        results = parser.parse()

        calls = [
            call('http://www.w3.org/2002/07/owl#Thing'),
            call('http://xmlns.com/foaf/0.1/Person'),
            call('http://dbpedia.org/ontology/MusicalArtist'),
            call('http://dbpedia.org/ontology/Person'),
        ]
        parser.process_type.assert_has_calls(calls)

    def test_parse_removes_any_empty_dicts_from_the_output_list(self):
        facts = [
            {
                "p": {
                    "type": "uri",
                    "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
                },
                "predicate_label": {
                    "type": "literal",
                    "value": "type"
                },
                "o": {
                    "type": "uri",
                    "value": "http://www.w3.org/2002/07/owl#Thing"
                },
                "object_label": {
                    "type": "literal",
                    "value": "Thing"
                }
            },
            {
                "p": {
                    "type": "uri",
                    "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
                },
                "predicate_label": {
                    "type": "literal",
                    "value": "type"
                },
                "o": {
                    "type": "uri",
                    "value": "http://xmlns.com/foaf/0.1/Person"
                },
                "object_label": {
                    "type": "literal",
                    "value": "Person"
                }
            },
            {
                "p": {
                    "type": "uri",
                    "value": "http://dbpedia.org/ontology/hometown"
                },
                "predicate_label": {
                    "type": "literal",
                    "xml:lang": "en",
                    "value": "home town"
                },
                "o": {
                    "type": "uri",
                    "value": "http://dbpedia.org/resource/California"
                },
                "object_label": {
                    "type": "literal",
                    "xml:lang": "en",
                    "value": "California"
                }
            },
            {
                "p": {
                    "type": "uri",
                    "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
                },
                "predicate_label": {
                    "type": "literal",
                    "value": "type"
                },
                "o": {
                    "type": "uri",
                    "value": "http://dbpedia.org/ontology/MusicalArtist"
                },
                "object_label": {
                    "type": "literal",
                    "xml:lang": "en",
                    "value": "musical artist"
                }
            },
            {
                "p": {
                    "type": "uri",
                    "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
                },
                "predicate_label": {
                    "type": "literal",
                    "value": "type"
                },
                "o": {
                    "type": "uri",
                    "value": "http://dbpedia.org/ontology/Person"
                },
                "object_label": {
                    "type": "literal",
                    "xml:lang": "en",
                    "value": "person"
                }
            }
        ]

        parser = ConfigurableParser(facts)
        parser.process_type = Mock(return_value={})
        results = parser.parse()
        self.assertEqual([], results)


    def test_process_type_opens_the_configuration_for_the_given_type(self):
        facts = [
            {
                "p": {
                    "type": "uri",
                    "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
                },
                "predicate_label": {
                    "type": "literal",
                    "value": "type"
                },
                "o": {
                    "type": "uri",
                    "value": "http://dbpedia.org/ontology/MusicalArtist"
                },
                "object_label": {
                    "type": "literal",
                    "xml:lang": "en",
                    "value": "musical artist"
                }
            }
        ]
        parser = ConfigurableParser(facts)
        rdfType = 'http://dbpedia.org/ontology/MusicalArtist'
        raw_configuration = '''{ "Sample": [] }'''
        m = mock_open(read_data=raw_configuration)

        #we need to pactch open on the global namespace
        #builtins == __builtin__ (python 2)
        with patch("builtins.open", m, create=True):
            parser.process_type(rdfType)

        m.assert_called_once_with('configurations/dbpedia.org/ontology/MusicalArtist.json')

    def test_process_type_generates_results_using_configuration(self):
        facts = [
            {
                "p": {
                    "type": "uri",
                    "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
                },
                "predicate_label": {
                    "type": "literal",
                    "value": "type"
                },
                "o": {
                    "type": "uri",
                    "value": "http://dbpedia.org/ontology/MusicalArtist"
                },
                "object_label": {
                    "type": "literal",
                    "xml:lang": "en",
                    "value": "musical artist"
                }
            }
        ]

        parser = ConfigurableParser(facts)
        rdfType = 'http://dbpedia.org/ontology/MusicalArtist'
        
        raw_configuration = '''{ "Sample": [] }'''

        m = mock_open(read_data=raw_configuration)
        parser.generate_results = Mock(name='generate_results')

        with patch('builtins.open', m, create=True):
            parser.process_type(rdfType)

        parser.generate_results.assert_called_once_with(json.loads(raw_configuration))

    def test_process_type_returns_an_empty_dict_when_a_configuration_is_not_found(self):
        facts = [
            {
                "p": {
                    "type": "uri",
                    "value": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
                },
                "predicate_label": {
                    "type": "literal",
                    "value": "type"
                },
                "o": {
                    "type": "uri",
                    "value": "http://dbpedia.org/ontology/MusicalArtist"
                },
                "object_label": {
                    "type": "literal",
                    "xml:lang": "en",
                    "value": "musical artist"
                }
            }
        ]

        parser = ConfigurableParser(facts)
        rdfType = 'http://dbpedia.org/ontology/MusicalArtist'
        
        m = mock_open()
        m.side_effect = FileNotFoundError()
        
        with patch('builtins.open', m, create=True):
            result = parser.process_type(rdfType)
            self.assertEqual({}, result)

    def test_generate_results_outputs_correct_id_based_on_the_configuration(self):
        facts = []
        parser = ConfigurableParser(facts)
        output = parser.generate_results({ "Sample": [] })
        self.assertEqual(output['id'], 'Sample')

    def test_generate_results_outputs_correct_facts_for_single_predicate_spec(self):
        facts = [
            {
                "p": { "type": "uri" , "value": "http://dbpedia.org/ontology/birthDate" } ,
                "predicate_label": { "type": "literal" , "xml:lang": "en" , "value": "birth date" } ,
                "o": { "datatype": "http://www.w3.org/2001/XMLSchema#date" , "type": "typed-literal" , "value": "1971-06-15+02:00" }
            }
        ]
        configuration = {
            "Sample": [
                # {
                #     "label": "Birth Place",
                #     "from": "http://dbpedia.org/ontology/birthPlace"
                # },
                {
                    "label": "Birth Date",
                    "from": "http://dbpedia.org/ontology/birthDate"
                }
            ]
        }
        
        parser = ConfigurableParser(facts)
        output = parser.generate_results(configuration)

        expectedOutput = {
            "id": "Sample",
            "facts": [
                {
                    'predicate': {
                        'value': 'http://dbpedia.org/ontology/birthDate',
                        'label': 'Birth Date'
                    },
                    'objects': [{
                        'type': 'typed-literal',
                        'datatype': 'http://www.w3.org/2001/XMLSchema#date',
                        'value': '1971-06-15+02:00'
                    }]
                }
            ]
        }
        self.assertEqual(output['facts'], expectedOutput['facts'])

    def test_generate_results_outputs_correct_facts_for_list_of_predicates_spec(self):
        facts = [
            {
                "p": { "type": "uri" , "value": "http://dbpedia.org/ontology/associatedBand" } ,
                "predicate_label": { "type": "literal" , "xml:lang": "en" , "value": "associated band" } ,
                "o": { "type": "uri" , "value": "http://dbpedia.org/resource/Dr._Dre" } ,
                "object_label": { "type": "literal" , "xml:lang": "en" , "value": "Dr. Dre" }
            },
            {
                "p": { "type": "uri" , "value": "http://dbpedia.org/property/associatedActs" },
                "predicate_label": { "type": "literal" , "xml:lang": "en" , "value": "associated acts" },
                "o": { "type": "uri" , "value": "http://dbpedia.org/resource/Snoop_Dogg" },
                "object_label": { "type": "literal" , "xml:lang": "en" , "value": "Snoop Dogg" }
            }
        ]
        configuration = {
            "Sample": [
                {
                    "label": "Related Artist",
                    "from": ["http://dbpedia.org/ontology/associatedBand", "http://dbpedia.org/property/associatedActs"]
                }
            ]
        }
        
        parser = ConfigurableParser(facts)
        output = parser.generate_results(configuration)

        expectedOutput = {
            "id": "Sample",
            "facts": [
                {
                    'predicate': {
                        'value': ["http://dbpedia.org/ontology/associatedBand", "http://dbpedia.org/property/associatedActs"],
                        'label': 'Related Artist'
                    },
                    'objects': [
                        {
                            "type": "uri" ,
                            "value": "http://dbpedia.org/resource/Dr._Dre",
                            "label": "Dr. Dre"
                        },
                        {
                            "type": "uri",
                            "value": "http://dbpedia.org/resource/Snoop_Dogg",
                            "label": "Snoop Dogg"
                        }
                    ]
                }
            ]
        }
        self.assertEqual(output['facts'], expectedOutput['facts'])

    def test_generate_results_outputs_a_list_of_unique_facts(self):
        facts = [
            {
                "p": { "type": "uri" , "value": "http://dbpedia.org/ontology/associatedBand" } ,
                "predicate_label": { "type": "literal" , "xml:lang": "en" , "value": "associated band" } ,
                "o": { "type": "uri" , "value": "http://dbpedia.org/resource/Dr._Dre" } ,
                "object_label": { "type": "literal" , "xml:lang": "en" , "value": "Dr. Dre" }
            },
            {
                "p": { "type": "uri" , "value": "http://dbpedia.org/property/associatedActs" },
                "predicate_label": { "type": "literal" , "xml:lang": "en" , "value": "associated acts" },
                "o": { "type": "uri" , "value": "http://dbpedia.org/resource/Dr._Dre" } ,
                "object_label": { "type": "literal" , "xml:lang": "en" , "value": "Dr. Dre" }
            }
        ]
        configuration = {
            "Sample": [
                {
                    "label": "Related Artist",
                    "from": ["http://dbpedia.org/ontology/associatedBand", "http://dbpedia.org/property/associatedActs"]
                }
            ]
        }
        
        parser = ConfigurableParser(facts)
        output = parser.generate_results(configuration)

        expectedOutput = {
            "id": "Sample",
            "facts": [
                {
                    'predicate': {
                        'value': ["http://dbpedia.org/ontology/associatedBand", "http://dbpedia.org/property/associatedActs"],
                        'label': 'Related Artist'
                    },
                    'objects': [
                        {
                            "type": "uri" ,
                            "value": "http://dbpedia.org/resource/Dr._Dre",
                            "label": "Dr. Dre"
                        }
                    ]
                }
            ]
        }
        self.assertEqual(output['facts'], expectedOutput['facts'])


    def test_generate_results_outputs_a_list_with_non_relevant_facts_stripped_out(self):
        facts = [
            {
                "p": { "type": "uri" , "value": "http://dbpedia.org/ontology/birthDate" } ,
                "predicate_label": { "type": "literal" , "xml:lang": "en" , "value": "birth date" } ,
                "o": { "datatype": "http://www.w3.org/2001/XMLSchema#date" , "type": "typed-literal" , "value": "1971-06-15+02:00" }
            }
        ]
        configuration = {
            "Sample": [
                #irrelevant fact since its not found in the facts
                {
                    "label": "Death Date",
                    "from": "http://dbpedia.org/ontology/deathDate"
                }
            ]
        }
        
        parser = ConfigurableParser(facts)
        output = parser.generate_results(configuration)

        expectedOutput = {
            "id": "Sample",
            "facts": []
        }
        self.assertEqual(output['facts'], expectedOutput['facts'])


if __name__ == '__main__':
    unittest.main()