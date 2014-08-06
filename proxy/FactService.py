from tornado.gen import coroutine
import string
from DBpediaEndpoint import DBpediaEndpoint
from ConfigurableParser import ConfigurableParser

from summarum import RankingService

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
