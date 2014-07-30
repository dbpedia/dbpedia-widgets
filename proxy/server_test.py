import unittest
from unittest.mock import Mock
from unittest.mock import MagicMock
from unittest.mock import patch
#from server import ProxyServer
from tornado.testing import AsyncHTTPTestCase
from tornado.testing import AsyncTestCase
import tornado.web
from server import ResourceHandler

import json

# from server import DBpediaEndpoint

from FactService import FactService
from FactService import ResourceRedirect

from tornado.concurrent import Future
from tornado.testing import gen_test

class ResourceHandlerTest(AsyncHTTPTestCase):
    """docstring for ProxyServerTest"""

    def get_app(self):
        self._fact_service = FactService()
        return tornado.web.Application([
                (r'/resource/(\S*)', ResourceHandler, dict(fact_service = self._fact_service))
            ])

    # def test_should_respond_with_the_resource_uri(self):
    #     response = self.fetch('/resource/http://dbpedia.org/resource/Sample')
    #     self.assertIn(b'"uri": "http://dbpedia.org/resource/Sample"', response.body)

    @gen_test
    def test_should_call_fact_service_to_get_resource_facts_for_the_given_uri(self):
        resourceURI = 'http://dbpedia.org/resource/Sample'
        future = Future()
        future.set_result(None)

        self._fact_service.get_resource = Mock(return_value=future)
        self.fetch('/resource/' + resourceURI)

        self._fact_service.get_resource.assert_called_once_with(resourceURI)
       

    @gen_test
    def test_should_add_the_cors_headers(self):
        resourceURI = 'http://dbpedia.org/resource/Sample'
        future = Future()
        future.set_result(None)

        self._fact_service.get_resource = Mock(return_value=future)
        response = self.fetch('/resource/' + resourceURI)
        
        self.assertEqual(response.headers['Access-Control-Allow-Origin'], '*')

    @gen_test
    def test_should_respond_with_redirect_error_when_resource_redirect_exception(self):
        resourceURI = 'http://dbpedia.org/resource/Sample'
        # future = Future()
        # future.set_result(None)

        self._fact_service.get_resource = Mock(side_effect = ResourceRedirect('a', 'b'))#return_value=future)
        response = self.fetch('/resource/' + resourceURI)
        
        self.assertEqual(response.code, 303)
        self.assertEqual(response.headers['Location'], "/resource/b")


    @gen_test
    def test_should_respond_with_bad_gateway_response_when_fact_service_raises_exception(self):
        resourceURI = 'http://dbpedia.org/resource/Sample'
        # future = Future()
        # future.set_result(None)

        self._fact_service.get_resource = Mock(side_effect = Exception('error'))#return_value=future)
        response = self.fetch('/resource/' + resourceURI)
        
        self.assertEqual(json.loads(response.body.decode()), {})
        self.assertEqual(response.code, 502)
        
        

if __name__ == '__main__':
    unittest.main()