from functools import wraps
import tornadoredis
import tornado.gen
from tornado.gen import coroutine
import json
from tornado.httpclient import AsyncHTTPClient
import string
from tornado.httputil import url_concat
import globals
from ConfigurableParser import ConfigurableParser
from summarum import RankingService

def cache_facts(fn):
    
    @coroutine
    @wraps(fn)
    def wrapper(*args, **kargs):
        #call the wrapped function immediately when there is 
        #no caching store. This is mainly to keep FactService unit tests passing
        if not hasattr(globals, 'CACHING_STORE'):
            response = yield fn(*args, **kargs)
            return response

        uri = args[0]
        response = yield tornado.gen.Task(globals.CACHING_STORE.get, uri)
        
        if not response:
            response = yield fn(*args, **kargs)
            yield tornado.gen.Task(globals.CACHING_STORE.set, uri, json.dumps(response))
        else:
            response = json.loads(response)

        return response
    return wrapper




class DBpediaEndpoint(object):
    """docstring for DBpediaEndpoint"""
    @coroutine
    def fetch(self, uri):
        endpointURL = 'http://dbpedia.org/sparql'
        http_client = AsyncHTTPClient()
        headers = dict(accept = 'application/json')
        facts_response, inverse_facts_response = yield [
            http_client.fetch(self.facts_url(uri), headers = headers), 
            http_client.fetch(self.inverse_facts_url(uri), headers = headers)
        ]
        facts = self.parse_response(facts_response)
        inverse_facts = self.parse_response(inverse_facts_response)
        return facts + inverse_facts

    def parse_response(self, response):
        return json.loads(response.body.replace(b"\U", b"\u").decode())['results']['bindings']


    def facts_url(self, uri):
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
            ).substitute(resource=uri)

        return url_concat(endpointURL, dict(query=sparql))

    def inverse_facts_url(self, uri):
        endpointURL = 'http://dbpedia.org/sparql'

        #this query is similar to query to retrieve all the outgoing facts from a given resource
        #but it retrieves all the incoming facts where the resource is in the object field

        #since we are going to join the results from this query
        #with the results from the outgoing facts query, we will project the results using
        #the same names as the other query
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
            ).substitute(resource=uri)

        return url_concat(endpointURL, dict(query=sparql))



class ResourceRedirect(Exception):
    """docstring for ResourceRedirect"""
    def __init__(self, requested_resource, redirect_resource):
        Exception.__init__(self, "The resource requested redirects to another resource.")
        self.requested_resource = requested_resource
        self.redirect_resource = redirect_resource
        

class FactService(object):
    """docstring for DBpediaEndpoint"""
    
    def __init__(self, endpoint = DBpediaEndpoint()):
        self.endpoint = endpoint

    def filter_facts(self, facts, uri):
        return [node["o"]["value"] for node in facts if node["p"]["value"] == uri]

    @cache_facts
    @coroutine
    def get_resource(self, uri):
        # facts = []
        # try:
        #     pass
        # except Exception as e:
        #     #this is an error we cant recover for
        #     #the resource is not available
        #     raise

        facts = yield self.endpoint.fetch(uri)

        redirectNodes = self.filter_facts(facts, "http://dbpedia.org/ontology/wikiPageRedirects")

        if redirectNodes:
            raise ResourceRedirect(uri, redirectNodes[0])

        labelNode = self.filter_facts(facts, "http://www.w3.org/2000/01/rdf-schema#label")
        depectionNode = self.filter_facts(facts, "http://xmlns.com/foaf/0.1/depiction")
        thumbnailNode = self.filter_facts(facts, "http://dbpedia.org/ontology/thumbnail")
        abstractNode = self.filter_facts(facts, "http://dbpedia.org/ontology/abstract")
        commentNode = self.filter_facts(facts, "http://www.w3.org/2000/01/rdf-schema#comment")
        wikipediaNode = self.filter_facts(facts, "http://xmlns.com/foaf/0.1/isPrimaryTopicOf")

        result = {
            "label": labelNode[0],
            "abstract": abstractNode[0],
            "comment": commentNode[0],
            "wikipedia": wikipediaNode[0]
        }

        if thumbnailNode:
            result['thumbnail'] = thumbnailNode[0]

        if depectionNode:
            result['depiction'] = depectionNode[0]

        # turtle = yield PageRankEndpoint().fetch(uri)
        # ranker = PageRankRanker(turtle)

        ranking_service = RankingService(uri)
        print('ranking_service started')

        result['facts'] = yield ConfigurableParser(facts, ranker = ranking_service).parse()
        return result
