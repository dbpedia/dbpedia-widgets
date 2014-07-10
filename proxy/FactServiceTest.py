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
                    "value": "thumbnail"
                }
            },
            {
                "o": {
                    "xml: lang": "en",
                    "type": "literal",
                    "value": "Sample Abstract"
                },
                "p": {
                    "type": "uri",
                    "value": "http://dbpedia.org/ontology/abstract"
                },
                "predicate_label": {
                    "xml: lang": "en",
                    "type": "literal",
                    "value": "has abstract"
                }
            },
            {
                "o": {
                    "xml: lang": "en",
                    "type": "literal",
                    "value": "Sample Comment"
                },
                "p": {
                    "type": "uri",
                    "value": "http://www.w3.org/2000/01/rdf-schema#comment"
                },
                "predicate_label": {
                    "xml: lang": "en",
                    "type": "literal",
                    "value": "comment"
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


    @gen_test
    def test_get_resource_retrieves_the_abstract(self):
        resourceURI = 'http://dbpedia.org/resource/Sample'

        resource = yield self.fact_service.get_resource(resourceURI)
        expected = 'Sample Abstract'
        self.assertEqual(expected, resource['abstract'])

    @gen_test
    def test_get_resource_retrieves_the_comment(self):
        resourceURI = 'http://dbpedia.org/resource/Sample'

        resource = yield self.fact_service.get_resource(resourceURI)
        expected = 'Sample Comment'
        self.assertEqual(expected, resource['comment'])


    @gen_test
    def test_get_resource_doesnt_retrieve_the_thumbnail_when_missing(self):
        resourceURI = 'http://dbpedia.org/resource/Sample'

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
                    "xml: lang": "en",
                    "type": "literal",
                    "value": "Sample Abstract"
                },
                "p": {
                    "type": "uri",
                    "value": "http://dbpedia.org/ontology/abstract"
                },
                "predicate_label": {
                    "xml: lang": "en",
                    "type": "literal",
                    "value": "has abstract"
                }
            },
            {
                "o": {
                    "xml: lang": "en",
                    "type": "literal",
                    "value": "Sample Comment"
                },
                "p": {
                    "type": "uri",
                    "value": "http://www.w3.org/2000/01/rdf-schema#comment"
                },
                "predicate_label": {
                    "xml: lang": "en",
                    "type": "literal",
                    "value": "comment"
                }
            }
        ]

        future = Future()
        future.set_result(response)

        self.dbpedia_endpoint.fetch = Mock(return_value=future)

        resource = yield self.fact_service.get_resource(resourceURI)
        self.assertTrue('thumbnail' not in resource)


    @gen_test
    def test_get_resource_doesnt_retrieve_the_depiction_when_missing(self):
        resourceURI = 'http://dbpedia.org/resource/Sample'

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
                    "xml: lang": "en",
                    "type": "literal",
                    "value": "Sample Abstract"
                },
                "p": {
                    "type": "uri",
                    "value": "http://dbpedia.org/ontology/abstract"
                },
                "predicate_label": {
                    "xml: lang": "en",
                    "type": "literal",
                    "value": "has abstract"
                }
            },
            {
                "o": {
                    "xml: lang": "en",
                    "type": "literal",
                    "value": "Sample Comment"
                },
                "p": {
                    "type": "uri",
                    "value": "http://www.w3.org/2000/01/rdf-schema#comment"
                },
                "predicate_label": {
                    "xml: lang": "en",
                    "type": "literal",
                    "value": "comment"
                }
            }
        ]

        future = Future()
        future.set_result(response)

        self.dbpedia_endpoint.fetch = Mock(return_value=future)

        resource = yield self.fact_service.get_resource(resourceURI)
        self.assertTrue('depiction' not in resource)
        

if __name__ == '__main__':
    unittest.main()