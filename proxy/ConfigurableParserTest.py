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

        #https://code.google.com/p/mock/issues/detail?id=204#c4
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



if __name__ == '__main__':
    unittest.main()