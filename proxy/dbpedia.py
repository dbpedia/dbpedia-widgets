from functools import wraps
import tornadoredis
import globals
import tornado.gen
from tornado.gen import coroutine
import json

def cache_facts(fn):
    
    @coroutine
    @wraps(fn)
    def wrapper(*args, **kargs):
        print('checking cache')
        uri = args[0]
        response = yield tornado.gen.Task(globals.CACHING_STORE.get, uri)
        
        if not response:
            print('not found in cache')
            response = yield fn(*args, **kargs)
            print('caching')
            yield tornado.gen.Task(globals.CACHING_STORE.set, uri, json.dumps(response))
        else:
            response = json.loads(response)

        return response
    return wrapper