import tornado.ioloop
import tornado.web
from FactService import FactService
from FactService import ResourceRedirect
from tornado.gen import coroutine
import json

class ResourceHandler(tornado.web.RequestHandler):
    """
        Handles a request for a dbpedia resource.
        It requests all the facts for a given resource
        and generates a formatted JSON response
    """
    def initialize(self, fact_service = FactService()):
        self.fact_service = fact_service

    @coroutine
    def get(self, uri):
        
        try:
            result = yield self.fact_service.get_resource(uri)
        except ResourceRedirect as e:
            print("redirect")

            result = {
                "status": "redirect",
                "data": {
                    "requested": e.requested_resource,
                    "redirect": e.redirect_resource
                }
            }
            self.add_header('Location', '/resource/' + e.redirect_resource)
            self.set_status(303)

        #raw = yield self.dbpedia_endpoint.fetch(uri)
        


        self.add_header('Access-Control-Allow-Origin', '*')
        self.write(json.dumps(result))



def main():
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