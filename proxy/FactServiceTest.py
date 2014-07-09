import unittest
from unittest.mock import Mock
from unittest.mock import MagicMock
from unittest.mock import patch
from unittest.mock import call

from io import BytesIO

from tornado.testing import AsyncTestCase
from tornado.testing import gen_test

import string
from DBpediaEndpoint import DBpediaEndpoint
from FactService import FactService
import json
from tornado.concurrent import Future


class FactServiceTest(AsyncTestCase):
    
    def setUp(self):
        AsyncTestCase.setUp(self)
        self.dbpedia_endpoint = DBpediaEndpoint()
        response = [
            {
                "o": {
                    "xml: lang": "en",
                    "type": "literal",
                    "value": "Sample Label"
                },
                "p": {
                    "type": "uri",
                    "value": "http://www.w3.org/2000/01/rdf-schema#label"
                },
                "predicate_label": {
                    "type": "literal",
                    "value": "label"
                }
            },
            {
                "o": {
                    "type": "uri",
                    "value": "http://upload.wikimedia.org/wikipedia/commons/sample_depiction.jpg"
                },
                "p": {
                    "type": "uri",
                    "value": "http://xmlns.com/foaf/0.1/depiction"
                },
                "predicate_label": {
                    "type": "literal",
                    "value": "depiction"
                }
            },
            {
                "o": {
                    "type": "uri",
                    "value": "http://upload.wikimedia.org/wikipedia/commons/sample_thumbnail.jpg"
                },
                "p": {
                    "type": "uri",
                    "value": "http://dbpedia.org/ontology/thumbnail"
                },
                "predicate_label": {
                    "type": "literal",
                    "value": "depiction"
                }
            }
        ]

        future = Future()
        future.set_result(response)

        self.dbpedia_endpoint.fetch = Mock(return_value=future)
        self.fact_service = FactService(endpoint = self.dbpedia_endpoint)

    def test_get_resource_should_call_the_endpoint_for_the_facts(self):
        resourceURI = 'http://dbpedia.org/resource/Sample'

        self.fact_service.get_resource(resourceURI)
        self.dbpedia_endpoint.fetch.assert_called_once_with(resourceURI)

    @gen_test
    def test_get_resource_retrieves_the_label(self):
        resourceURI = 'http://dbpedia.org/resource/Sample'

        resource = yield self.fact_service.get_resource(resourceURI)
        expectedLabel = 'Sample Label'
        self.assertEqual(expectedLabel, resource['label'])


    @gen_test
    def test_get_resource_retrieves_the_depiction(self):
        resourceURI = 'http://dbpedia.org/resource/Sample'

        resource = yield self.fact_service.get_resource(resourceURI)
        expectedLabel = 'http://upload.wikimedia.org/wikipedia/commons/sample_depiction.jpg'
        self.assertEqual(expectedLabel, resource['depiction'])

    @gen_test
    def test_get_resource_retrieves_the_thumbnail(self):
        resourceURI = 'http://dbpedia.org/resource/Sample'

        resource = yield self.fact_service.get_resource(resourceURI)
        expectedLabel = 'http://upload.wikimedia.org/wikipedia/commons/sample_thumbnail.jpg'
        self.assertEqual(expectedLabel, resource['thumbnail'])

        

if __name__ == '__main__':
    unittest.main()