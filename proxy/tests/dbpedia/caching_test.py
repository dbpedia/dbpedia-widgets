import unittest
from unittest.mock import Mock
from unittest.mock import MagicMock
from unittest.mock import patch
from unittest.mock import call
from unittest.mock import ANY

from tornado.concurrent import Future
from tornado.testing import AsyncTestCase
from tornado.testing import gen_test


#add the root proxy directory to the sys.path
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), '../..'))


import tornadoredis
import globals
from dbpedia import cache_facts

class CachingTest(AsyncTestCase):
    
    def setUp(self):
        AsyncTestCase.setUp(self)

        return_value = {
            'label': 'A Label',
            'comment': 'A Comment',
            'depiction': 'A URL'
        }
        future = Future()
        future.set_result(return_value)
        self._wrapped_fn = Mock(return_value=future)
        self._decorated_fn = cache_facts(self._wrapped_fn)
        
        #setup a function with a value to be cached
        #and decorate it with the decorated under test
        @cache_facts
        def intense_fact_processing(uri):
            return {
                'label': 'A Label',
                'comment': 'A Comment',
                'depiction': 'A URL',
                'uri': uri
            }

        self.intense_fact_processing =  intense_fact_processing

    def tearDown(self):
        AsyncTestCase.tearDown(self)

    @patch.object(tornadoredis, 'Client')
    def test_the_global_redis_client_is_created(self, redis_client):
        globals.setup_caching_store()
        
        self.assertTrue(redis_client.called)
        self.assertIsNotNone(globals.CACHING_STORE)

    @patch.object(tornadoredis, 'Client')
    def test_the_global_redis_client_connects(self, redis_client):
        #set the return value to the mock Client constructor
        #it should return a mock client with a mock connect function
        mock_client = Mock()
        mock_client.connect = Mock()
        redis_client.return_value = mock_client

        globals.setup_caching_store()
        self.assertTrue(mock_client.connect.called)


    @gen_test
    @patch.object(tornadoredis, 'Client')
    def test_decorator_checks_global_cache_store_for_given_resource(self, redis_client):
        globals.setup_caching_store()

        def execute_get_callback(*args, **kargs):
            kargs['callback'](None)

        globals.CACHING_STORE.get.side_effect = execute_get_callback

        resource_uri = 'http://dbpedia.org/resource/Sample'

        self._decorated_fn(resource_uri)
        globals.CACHING_STORE.get.assert_called_once_with(resource_uri, callback=ANY)


    @gen_test
    def test_decorator_returns_cache_entry_for_uri(self):
        tornadoredis.Client = Mock()
        globals.setup_caching_store()

        expected_response = {
            'label': 'A Sample Label'
        }
        def execute_get_callback(*args, **kargs):
            kargs['callback'](expected_response)

        globals.CACHING_STORE.get.side_effect = execute_get_callback

        resource_uri = 'http://dbpedia.org/resource/Sample'

        response = yield self._decorated_fn(resource_uri)
        self.assertEquals(expected_response, response)


    @patch.object(tornadoredis, 'Client')
    def test_decorator_doesnt_call_wrapped_fn_when_cache_entry_found(self, redis_client):
        globals.setup_caching_store()

        expected_response = {
            'label': 'A Sample Label'
        }
        def execute_get_callback(*args, **kargs):
            kargs['callback'](expected_response)

        globals.CACHING_STORE.get.side_effect = execute_get_callback

        resource_uri = 'http://dbpedia.org/resource/Sample'

        self._decorated_fn(resource_uri)
        self.assertFalse(self._wrapped_fn.called)



    @patch.object(tornadoredis, 'Client')
    def test_decorator_caches_result_from_wrapped_fn_if_no_cache_entry_found(self, redis_client):
        globals.setup_caching_store()

        def execute_get_callback(*args, **kargs):
            kargs['callback'](None)

        def execute_set_callback(*args, **kargs):
            kargs['callback']()

        globals.CACHING_STORE.set.side_effect = execute_set_callback
        globals.CACHING_STORE.get.side_effect = execute_get_callback

        resource_uri = 'http://dbpedia.org/resource/Sample'

        self._decorated_fn(resource_uri)
        globals.CACHING_STORE.set.assert_called_once_with(resource_uri, ANY, callback=ANY)



