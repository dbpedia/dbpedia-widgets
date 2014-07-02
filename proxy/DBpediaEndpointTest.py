import unittest
from unittest.mock import Mock
from unittest.mock import MagicMock
from unittest.mock import patch

from tornado.testing import AsyncTestCase
from tornado.httpclient import AsyncHTTPClient
from tornado.httputil import url_concat
import string
from DBpediaEndpoint import DBpediaEndpoint


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
            SELECT DISTINCT ?p ?predicate_label ?o ?object_label WHERE {
                ?o ?p <$resource>.
                ?p rdfs:label ?predicate_label.
                OPTIONAL { ?o rdfs:label ?object_label. }

                FILTER((LANG(?predicate_label) = "" || langMatches(lang(?predicate_label), "EN")))
                FILTER(LANG(?object_label) = "" || langMatches(lang(?object_label), "EN"))
            }"""
            ).substitute(resource=resourceURI)


        expectedURI = url_concat(endpointURL, dict(query=sparql))
        actualURI = self.dbpedia_endpoint.inverse_facts_url(resourceURI)
        self.assertEqual(actualURI, expectedURI)


    @patch.object(AsyncHTTPClient, 'fetch')
    def test_should_request_the_subject_facts_from_the_dbpedia_endpoint(self, fetch):
        resourceURI = 'http://dbpedia.org/resource/Sample'
        self.dbpedia_endpoint.fetch(resourceURI)
        fetch.assert_called_once_with(self.dbpedia_endpoint.facts_url(resourceURI))


    @patch.object(AsyncHTTPClient, 'fetch')
    def test_should_request_the_inverse_subject_facts_from_the_dbpedia_endpoint(self, fetch):
        resourceURI = 'http://dbpedia.org/resource/Sample'
        self.dbpedia_endpoint.fetch(resourceURI)
        fetch.assert_called_once_with(self.dbpedia_endpoint.inverse_facts_url(resourceURI))


    # def test_should_return_both_sets_of_facts(self):
    #   pass
        

if __name__ == '__main__':
    unittest.main()