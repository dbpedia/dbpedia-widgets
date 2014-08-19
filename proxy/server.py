import tornado.ioloop
import tornado.web
from dbpedia import FactService
from dbpedia import ResourceRedirect
from tornado.gen import coroutine
import json
import globals

class ResourceHandler(tornado.web.RequestHandler):
    """Handles a request for a dbpedia resource.

    The resource handler offloads most of the work to the 
    FactService. 
    """
    def initialize(self, fact_service = FactService()):
        self.fact_service = fact_service

    @coroutine
    def get(self, uri):
        
        self.add_header('Access-Control-Allow-Origin', '*')
        try:
            #try to get the facts for the given resource
            result = yield self.fact_service.get_resource(uri)
            #write result as JSON
            self.write(json.dumps(result))
        except ResourceRedirect as e:
            #redirect to correct resource
            self.add_header('Location', '/resource/' + e.redirect_resource)
            self.set_status(303) #See other
        except Exception as e:
            #something else went wrong
            #TODO: add logging
            self.write(json.dumps({}))
            self.set_status(502) #Bad Gateway



def main():
    #setup the global caching store
    globals.setup_caching_store()

    #start the application and IOLoop
    application = tornado.web.Application([
            #a single request argument, the resource URI, will be passed in the URL
            #regex will match any amount of non-whitespace characters
            #sample - /resource/http://dbpedia.org/resource/Sample
            (r'/resource/(\S*)', ResourceHandler)
        ])
    application.listen(8000)
    tornado.ioloop.IOLoop.instance().start()


if __name__ == '__main__':
    main()

