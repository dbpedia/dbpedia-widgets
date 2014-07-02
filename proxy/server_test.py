import unittest
from unittest.mock import Mock
from unittest.mock import MagicMock
from unittest.mock import patch
#from server import ProxyServer
from tornado.testing import AsyncHTTPTestCase
from tornado.testing import AsyncTestCase
import tornado.web
from server import ResourceHandler
from server import DBpediaEndpoint

class ResourceHandlerTest(AsyncHTTPTestCase):
    """docstring for ProxyServerTest"""

    def get_app(self):
        self._dbpedia_endpoint = DBpediaEndpoint()
        #return ProxyServer()
        return tornado.web.Application([
                (r'/resource/(\S*)', ResourceHandler, dict(dbpedia_endpoint = self._dbpedia_endpoint))
            ])

    def test_should_respond_with_the_resource_uri(self):
        response = self.fetch('/resource/http://dbpedia.org/resource/Sample')
        self.assertIn(b'"uri": "http://dbpedia.org/resource/Sample"', response.body)

    def test_should_call_dbpedia_endpoint_to_fetch_facts_for_the_given_uri(self):
        resourceURI = 'http://dbpedia.org/resource/Sample'
        
        self._dbpedia_endpoint.fetch = MagicMock()
        self.fetch('/resource/' + resourceURI)

        self._dbpedia_endpoint.fetch.assert_called_once_with(resourceURI)
        

if __name__ == '__main__':
    unittest.main()