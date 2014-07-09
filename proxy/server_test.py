import unittest
from unittest.mock import Mock
from unittest.mock import MagicMock
from unittest.mock import patch
#from server import ProxyServer
from tornado.testing import AsyncHTTPTestCase
from tornado.testing import AsyncTestCase
import tornado.web
from server import ResourceHandler
# from server import DBpediaEndpoint

from FactService import FactService
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
        

if __name__ == '__main__':
    unittest.main()