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
from tornado.httpclient import HTTPError

from rdflib import Graph
from rdflib.term import URIRef, Literal


#add the root proxy directory to the sys.path
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), '../..'))

from summarum import Endpoint

class EndpointTest(AsyncTestCase):
    
    def setUp(self):
        AsyncTestCase.setUp(self)
        self.summarum_endpoint = Endpoint()

    def tearDown(self):
        AsyncTestCase.tearDown(self)
        self.summarum_endpoint = None


    @patch.object(AsyncHTTPClient, 'fetch')
    def test_should_request_the_top_200_rankings_for_the_given_resource(self, fetch):
        resource_uri = 'http://dbpedia.org/resource/Sample'
        self.summarum_endpoint.fetch(resource_uri)
        
        endpoint_url = "http://km.aifb.kit.edu/services/summa/summarum"
        url = endpoint_url + "?entity=" + resource_uri + "&topK=200"
        fetch.assert_called_once_with(url, headers= ANY)


    @patch.object(AsyncHTTPClient, 'fetch')
    def test_should_request_the_rankings_as_turtle(self, fetch):
        resourceURI = 'http://dbpedia.org/resource/Sample'
        self.summarum_endpoint.fetch(resourceURI)
        
        headers = dict(accept = 'text/turtle')
        fetch.assert_called_once_with(ANY, headers = headers)


    @gen_test
    def test_should_return_the_body_from_the_response(self):
        resourceURI = 'http://dbpedia.org/resource/Sample'

        expected_result = b"""
            @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
            @prefix vrank: <http://purl.org/voc/vrank#>.
            @prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
            [ rdf:type rdf:Statement ;
                rdf:subject <http://dbpedia.org/resource/Snoop_Dogg> ;
                rdf:predicate <http://purl.org/dc/terms/subject> ;
                rdf:object <http://dbpedia.org/resource/Category:Living_people> ;
                vrank:hasRank [ vrank:rankValue "5564.412"^^xsd:float ] ] .
        """

        response = Mock()
        response.body = expected_result

        future = Future()
        future.set_result(response)

        client = Mock()
        client.fetch = Mock(return_value=future)

        self.summarum_endpoint = Endpoint(http_client=client)
        
        result = yield self.summarum_endpoint.fetch(resourceURI)
        self.assertEquals(result, expected_result)

    @gen_test
    def test_fetch_returns_none_when_request_fails(self):
        uri = 'http://dbpedia.com/resource/Sample'

        client = Mock()
        client.fetch = Mock(side_effect=HTTPError(500))

        self.summarum_endpoint = Endpoint(http_client=client)
        response = yield self.summarum_endpoint.fetch(uri)
        self.assertEquals(response, None)

    def test_get_query_generates_sparql_for_given_resource(self):
        uri = 'http://dbpedia.com/resource/Sample'
        query = self.summarum_endpoint.get_query(uri)
        self.assertIn(uri, query)

    @patch.object(Graph, 'parse')
    def test_parse_loads_the_given_data_into_an_rdf_graph(self, parse):
        uri = 'http://dbpedia.com/resource/Sample'
        seed_data = ""
        self.summarum_endpoint.parse(uri, seed_data)
        parse.assert_called_once_with(data = seed_data, format = 'n3')


    # def test_parse_calls_get_query_with_the_given_uri(self):
    #     uri = 'http://dbpedia.com/resource/Sample'
    #     seed_data = ""
    #     self.summarum_endpoint.get_query = Mock()
    #     self.summarum_endpoint.parse(uri, seed_data)
        
    #     assert(self.summarum_endpoint.get_query.called)

    @patch.object(Graph, 'query')
    def test_parse_queries_the_graph_using_sparql_from_get_query(self, query):
        uri = 'http://dbpedia.com/resource/Sample'
        seed_data = ""
        # expected_query = self.summarum_endpoint.get_query(uri)
        expected_query = "SELECT * WHERE { ?s ?p ?o }"
        self.summarum_endpoint.get_query = Mock(return_value=expected_query)
        self.summarum_endpoint.parse(uri, seed_data)
        
        query.assert_called_once_with(expected_query)


    @patch.object(Graph, 'query')
    def test_parse_return_results_from_query_after_removing_uri_node_wrappers(self, query):
        uri = 'http://dbpedia.com/resource/Sample'
        seed_data = ""
        p_occupation = "http://dbpedia.org/resource/occupation"
        o_rapper = "http://dbpedia.org/resource/Rapper"
        o_actor = "http://dbpedia.org/resource/Actor"
        type_float = URIRef('http://www.w3.org/2001/XMLSchema#float')
        v_rapper = 13.756689
        v_actor = 13.756689
        #Literal(v_rapper, datatype=type_float)
        query.return_value = [
            (URIRef(p_occupation), URIRef(o_rapper), Literal(v_rapper)),
            (URIRef(p_occupation), URIRef(o_actor), Literal(v_actor))
        ]
        result = self.summarum_endpoint.parse(uri, seed_data)
        expected_result = [
            (p_occupation, o_rapper, v_rapper),
            (p_occupation, o_actor, v_actor)
        ]
        self.assertEqual(result, expected_result)


    @gen_test
    def test_fetch_and_parse_returns_an_empty_list_when_parse_returns_none(self):
        uri = 'http://dbpedia.com/resource/Sample'

        future = Future()
        future.set_result(None)
        self.summarum_endpoint.fetch = Mock(return_value=future)

        response = yield self.summarum_endpoint.fetch_and_parse(uri)
        self.assertEquals(response, [])

    @gen_test
    def test_fetch_and_parse_returns_the_output_from_parse(self):
        uri = 'http://dbpedia.com/resource/Sample'

        future = Future()
        #any truthy value should be set as the result
        #fetch_and_parse checks that there's a response before calling parse
        future.set_result("turtle")
        self.summarum_endpoint.fetch = Mock(return_value=future)


        expected_result = [1, 2, 3]
        self.summarum_endpoint.parse = Mock(return_value=expected_result)

        response = yield self.summarum_endpoint.fetch_and_parse(uri)
        self.assertEquals(response, expected_result)


