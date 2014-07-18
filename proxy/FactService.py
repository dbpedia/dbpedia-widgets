from tornado.gen import coroutine
import string
from DBpediaEndpoint import DBpediaEndpoint
from ConfigurableParser import ConfigurableParser

class FactService(object):
    """docstring for DBpediaEndpoint"""
    
    def __init__(self, endpoint = DBpediaEndpoint()):
        self.endpoint = endpoint

    def filter_facts(self, facts, uri):
        return [node["o"]["value"] for node in facts if node["p"]["value"] == uri]

    @coroutine
    def get_resource(self, uri):
        facts = yield self.endpoint.fetch(uri)

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

        result['facts'] = ConfigurableParser(facts).parse()
        return result
