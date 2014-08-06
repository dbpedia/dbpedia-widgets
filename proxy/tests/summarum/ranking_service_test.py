import unittest
from unittest.mock import Mock
from unittest.mock import MagicMock
from unittest.mock import patch
from unittest.mock import call
from unittest.mock import ANY

from tornado.concurrent import Future
from tornado.httpclient import AsyncHTTPClient
from tornado.gen import coroutine
from tornado.testing import AsyncTestCase
from tornado.testing import gen_test

from rdflib import Graph

#add the root proxy directory to the sys.path
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), '../..'))

from summarum import RankingService

class RankingServiceTest(AsyncTestCase):
    
    def setUp(self):
        AsyncTestCase.setUp(self)
        self.uri = 'http://dbpedia.com/resource/Sample'
        self.endpoint = Mock()
        self.ranking_service = RankingService(self.uri, endpoint=self.endpoint)

    @gen_test
    def test_rank_calls_fetch_and_parse_on_the_summarum_endpoint(self):
        future = Future()
        future.set_result([])
        self.endpoint.fetch_and_parse = Mock(return_value=future)
        facts = {
            'predicate': {
                'value': 'http://dbpedia.com/resource/occupation'
            },
            'objects': []
        }
        yield self.ranking_service.rank(facts)
        self.endpoint.fetch_and_parse.assert_called_once_with(self.uri)

    @gen_test
    def test_rank_stores_the_summarum_rankings(self):
        expected_result = [
            ('a', 'b', 10.0),
            ('c', 'd', 1.0)
        ]
        future = Future()
        future.set_result(expected_result)
        
        self.endpoint.fetch_and_parse = Mock(return_value=future)

        facts = {
            'predicate': {
                'value': 'http://dbpedia.com/resource/occupation'
            },
            'objects': []
        }
        yield self.ranking_service.rank(facts)
        self.assertEquals(self.ranking_service.rankings, expected_result)

    @gen_test
    def test_rank_calls_sort_and_returns_output(self):
        #setup the response from the summarum endpoint
        expected_result = [
            ('a', 'b', 10.0),
            ('c', 'd', 1.0)
        ]
        future = Future()
        future.set_result(expected_result)
        self.endpoint.fetch_and_parse = Mock(return_value=future)
        
        #setup the response return value from the sort call
        expected_ranked_facts = {
            'predicate': {},
            'objects': []
        }
        self.ranking_service.sort = Mock(return_value = expected_ranked_facts)
        
        #call the function under test
        facts = {}
        ranked_facts = yield self.ranking_service.rank(facts)

        #check that sort was called
        self.ranking_service.sort.assert_called_once_with(facts)
        #check that rank returns the output from sort
        self.assertEquals(ranked_facts, expected_ranked_facts)


    def test_sort_sorts_given_facts_based_on_rankings(self):
        self.ranking_service.rankings = [
            ('http://dbpedia.org/ontology/occupation', 'http://dbpedia.org/resource/Rapping', 12.01),
            ('http://dbpedia.org/ontology/occupation', 'http://dbpedia.org/resource/Actor', 5.01),
        ]

        facts = {
            'objects': [
                {
                    'label': "Actor",
                    'value': "http://dbpedia.org/resource/Actor",
                    'type': "uri"
                },
                {
                    'label': "Rapping",
                    'value': "http://dbpedia.org/resource/Rapping",
                    'type': "uri"
                }
            ],
            'predicate': {
                'label': "Occupation",
                'value': "http://dbpedia.org/ontology/occupation"
            }
        }

        result = self.ranking_service.sort(facts)
        expected_result = {
            'objects': [
                {
                    'label': "Rapping",
                    'value': "http://dbpedia.org/resource/Rapping",
                    'type': "uri"
                },
                {
                    'label': "Actor",
                    'value': "http://dbpedia.org/resource/Actor",
                    'type': "uri"
                }
            ],
            'predicate': {
                'label': "Occupation",
                'value': "http://dbpedia.org/ontology/occupation"
            }
        }

        self.assertEqual(result, expected_result)

    def test_sort_leaves_facts_with_no_rankings_at_the_end_of_the_list(self):
        self.ranking_service.rankings = [
            ('http://dbpedia.org/ontology/occupation', 'http://dbpedia.org/resource/Rapping', 12.01),
            ('http://dbpedia.org/ontology/occupation', 'http://dbpedia.org/resource/Actor', 5.01),
        ]

        facts = {
            'objects': [
                {
                    'label': "Actor",
                    'value': "http://dbpedia.org/resource/Actor",
                    'type': "uri"
                },
                {
                    'label': "Rapping",
                    'value': "http://dbpedia.org/resource/Rapping",
                    'type': "uri"
                },
                {
                    'label': "Politician",
                    'value': "http://dbpedia.org/resource/Politician",
                    'type': "uri"
                },
                {
                    'label': "Doctor",
                    'value': "http://dbpedia.org/resource/Doctor",
                    'type': "uri"
                }
            ],
            'predicate': {
                'label': "Occupation",
                'value': "http://dbpedia.org/ontology/occupation"
            }
        }

        result = self.ranking_service.sort(facts)
        expected_result = {
            'objects': [
                {
                    'label': "Rapping",
                    'value': "http://dbpedia.org/resource/Rapping",
                    'type': "uri"
                },
                {
                    'label': "Actor",
                    'value': "http://dbpedia.org/resource/Actor",
                    'type': "uri"
                },
                #the below facts should be left unsorted
                {
                    'label': "Politician",
                    'value': "http://dbpedia.org/resource/Politician",
                    'type': "uri"
                },
                {
                    'label': "Doctor",
                    'value': "http://dbpedia.org/resource/Doctor",
                    'type': "uri"
                }
            ],
            'predicate': {
                'label': "Occupation",
                'value': "http://dbpedia.org/ontology/occupation"
            }
        }

        self.assertEqual(result, expected_result)


if __name__ == '__main__':
    unittest.main()

