from tornado.gen import coroutine
import string
from DBpediaEndpoint import DBpediaEndpoint

class FactService(object):
    """docstring for DBpediaEndpoint"""
    
    def __init__(self, endpoint = DBpediaEndpoint()):
        self.endpoint = endpoint

    @coroutine
    def get_resource(self, uri):
        facts = yield self.endpoint.fetch(uri)

        labelNode = [node["o"]["value"] for node in facts if node["p"]["value"] == "http://www.w3.org/2000/01/rdf-schema#label"]
        depectionNode = [node["o"]["value"] for node in facts if node["p"]["value"] == "http://xmlns.com/foaf/0.1/depiction"]
        thumbnailNode = [node["o"]["value"] for node in facts if node["p"]["value"] == "http://dbpedia.org/ontology/thumbnail"]

        return {
            "label": labelNode[0],
            "depiction": depectionNode[0],
            "thumbnail": thumbnailNode[0]
        }