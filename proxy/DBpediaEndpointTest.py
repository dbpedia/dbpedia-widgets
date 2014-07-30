import unittest
from unittest.mock import Mock
from unittest.mock import MagicMock
from unittest.mock import patch
from unittest.mock import call

from io import BytesIO

from tornado.testing import AsyncTestCase
from tornado.httpclient import *
from tornado.httputil import url_concat
from tornado.testing import gen_test
from tornado.concurrent import Future

import string
from DBpediaEndpoint import DBpediaEndpoint
import json


class DBpediaEndpointTest(AsyncTestCase):
    
    def setUp(self):
        AsyncTestCase.setUp(self)
        self.dbpedia_endpoint = DBpediaEndpoint()


    def test_facts_query_returns_correct_url_with_sparql_query(self):
        resourceURI = 'http://dbpedia.org/resource/Sample'
        endpointURL = 'http://dbpedia.org/sparql'

        sparql = string.Template(
            """
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            SELECT DISTINCT ?p ?predicate_label ?o ?object_label WHERE {
                <$resource> ?p ?o.
                ?p rdfs:label ?predicate_label.
                OPTIONAL { ?o rdfs:label ?object_label. }

                FILTER(isURI(?o) || (LANG(?o) = "" || langMatches(lang(?o), "EN")))
                FILTER((LANG(?predicate_label) = "" || langMatches(lang(?predicate_label), "EN")))
                FILTER(LANG(?object_label) = "" || langMatches(lang(?object_label), "EN"))
            }"""
            ).substitute(resource=resourceURI)


        expectedURI = url_concat(endpointURL, dict(query=sparql))
        actualURI = self.dbpedia_endpoint.facts_url(resourceURI)
        self.assertEqual(actualURI, expectedURI)


    def test_inverse_facts_query_returns_correct_url_with_sparql_query(self):
        resourceURI = 'http://dbpedia.org/resource/Sample'
        endpointURL = 'http://dbpedia.org/sparql'

        sparql = string.Template(
            """
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX dbpedia: <http://dbpedia.org/ontology/>
            SELECT DISTINCT ?p ?predicate_label ?o ?object_label WHERE {
                ?o ?p <$resource>.
                ?p rdfs:label ?predicate_label.
                OPTIONAL { ?o rdfs:label ?object_label. }

                FILTER((LANG(?predicate_label) = "" || langMatches(lang(?predicate_label), "EN")))
                FILTER(LANG(?object_label) = "" || langMatches(lang(?object_label), "EN"))
                MINUS { ?o dbpedia:wikiPageRedirects ?r }
            }"""
            ).substitute(resource=resourceURI)


        expectedURI = url_concat(endpointURL, dict(query=sparql))
        actualURI = self.dbpedia_endpoint.inverse_facts_url(resourceURI)
        self.assertEqual(actualURI, expectedURI)


    @patch.object(AsyncHTTPClient, 'fetch')
    def test_should_request_the_subject_facts_as_json(self, fetch):
        resourceURI = 'http://dbpedia.org/resource/Sample'
        self.dbpedia_endpoint.fetch(resourceURI)
        headers = dict(accept = 'application/json')
        calls = [
            call(self.dbpedia_endpoint.facts_url(resourceURI), headers = headers),
            call(self.dbpedia_endpoint.inverse_facts_url(resourceURI), headers = headers)
        ]
        fetch.assert_has_calls(calls)

    @gen_test
    def test_should_return_both_sets_of_facts(self):
        resourceURI = 'http://dbpedia.org/resource/Sample'

        
        facts = b'''
        {
            "head": {
                "vars": [ "p" , "predicate_label" , "o" , "object_label" ]
            },
            "results": {
                "bindings": [
                    {
                        "p": { "type": "uri" , "value": "http://dbpedia.org/ontology/hometown" },
                        "predicate_label": { "type": "literal" , "xml:lang": "en" , "value": "home town" },
                        "o": { "type": "uri" , "value": "http://dbpedia.org/resource/California" },
                        "object_label": { "type": "literal" , "xml:lang": "en" , "value": "California" }
                    }
                ]
            }
        }
        '''

        facts_request = HTTPRequest(self.dbpedia_endpoint.facts_url(resourceURI))
        facts_buffer = BytesIO(facts)
        facts_response = HTTPResponse(facts_request, 200, buffer = facts_buffer)
        facts_future = Future()
        facts_future.set_result(facts_response)



        inverse_facts = b'''
        {
            "head": {
                "vars": [ "p" , "predicate_label" , "o" , "object_label" ]
            },
            "results": {
                "bindings": [
                    {
                        "p": { "type": "uri" , "value": "http://dbpedia.org/ontology/deathPlace" } ,
                        "predicate_label": { "type": "literal" , "xml:lang": "en" , "value": "death place" } ,
                        "o": { "type": "uri" , "value": "http://dbpedia.org/resource/Las_Vegas" } ,
                        "object_label": { "type": "literal" , "xml:lang": "en" , "value": "Las Vegas" }
                    }
                ]
            }
        }
        '''

        inverse_facts_request = HTTPRequest(self.dbpedia_endpoint.inverse_facts_url(resourceURI))
        inverse_facts_buffer = BytesIO(inverse_facts)
        inverse_facts_response = HTTPResponse(inverse_facts_request, 200, buffer = inverse_facts_buffer)
        inverse_facts_future = Future()
        inverse_facts_future.set_result(inverse_facts_response)

        retVals = [ facts_future, inverse_facts_future ]


        with patch.object(AsyncHTTPClient, 'fetch', side_effect=retVals):
            results = yield self.dbpedia_endpoint.fetch(resourceURI)

            expectedResults = [
                {
                    "p": { "type": "uri" , "value": "http://dbpedia.org/ontology/hometown" },
                    "predicate_label": { "type": "literal" , "xml:lang": "en" , "value": "home town" },
                    "o": { "type": "uri" , "value": "http://dbpedia.org/resource/California" },
                    "object_label": { "type": "literal" , "xml:lang": "en" , "value": "California" }
                },
                {
                    "p": { "type": "uri" , "value": "http://dbpedia.org/ontology/deathPlace" } ,
                    "predicate_label": { "type": "literal" , "xml:lang": "en" , "value": "death place" } ,
                    "o": { "type": "uri" , "value": "http://dbpedia.org/resource/Las_Vegas" } ,
                    "object_label": { "type": "literal" , "xml:lang": "en" , "value": "Las Vegas" }
                }
            ]
            self.assertEqual(results, expectedResults)
        
    def test_parse_response_replaces_invalid_unicode_from_response_body(self):
        body = b"""
        {
            "head": {
                "vars": [ "p" , "predicate_label" , "o" , "object_label" ]
            },
            "results": {
                "bindings": [
                    {
                        "unicode_field" : "\U00f8C",
                        "p": { "type": "uri" , "value": "http://dbpedia.org/ontology/hometown" },
                        "predicate_label": { "type": "literal" , "xml:lang": "en" , "value": "home town" },
                        "o": { "type": "uri" , "value": "http://dbpedia.org/resource/California" },
                        "object_label": { "type": "literal" , "xml:lang": "en" , "value": "California" }
                    }
                ]
            }
        }
        """
        response = Mock()
        response.body = body
        result = self.dbpedia_endpoint.parse_response(response)
        self.assertEqual(result[0]["unicode_field"], "\u00f8C")

if __name__ == '__main__':
    unittest.main()