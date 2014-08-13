from tornado.httpclient import AsyncHTTPClient
from tornado.httpclient import HTTPError
from tornado.gen import coroutine

from rdflib import Graph
import string


class Endpoint(object):
    """
        The sole purpose of this class is to fetch the dbpedia pagerank datasets from
        summarum (http://km.aifb.kit.edu/services/summa/summarum). 
    """

    def __init__(self, http_client = AsyncHTTPClient()):
        self.http_client = http_client
            

    @coroutine
    def fetch(self, uri):
        endpoint_url = "http://km.aifb.kit.edu/services/summa/summarum"
        result = None

        try:
            #the topK parameter should be limited to 200
            #anything bigger makes the endpoint freakout and respond with an 
            #error
            url = endpoint_url + "?entity=" + uri + "&topK=200"
            headers = dict(accept = 'text/turtle')
            response = yield self.http_client.fetch(url, headers = headers)
            result = response.body
        except HTTPError as e:
            ## TODO: Log exception
            pass

        return result

    def get_query(self, uri):
        return string.Template(
            """
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX vrank: <http://purl.org/voc/vrank#>
            SELECT ?p ?s ?v WHERE {
                {
                    ?st rdf:object <$resource>.
                    ?st rdf:predicate ?p.
                    ?st rdf:subject ?s.
                    ?st vrank:hasRank ?r.
                    ?r vrank:rankValue ?v.
                }
                UNION
                {
                    ?st rdf:subject <$resource>.
                    ?st rdf:predicate ?p.
                    ?st rdf:object ?s.
                    ?st vrank:hasRank ?r.
                    ?r vrank:rankValue ?v.
                }
            }
            ORDER BY DESC(?v)""").substitute(resource=uri)

    def parse(self, uri, turtle):
        g = Graph()
        g.parse(data = turtle, format='n3')

        sparql = self.get_query(uri)
        results = g.query(sparql)
        return [(str(p), str(o), float(v)) for p, o, v in results]

    @coroutine
    def fetch_and_parse(self, uri):
        turtle = yield self.fetch(uri)
        result = []
        if turtle:
            result = self.parse(uri, turtle)
        return result

class RankingService(object):
    """docstring for RankingService"""
    def __init__(self, uri, endpoint = Endpoint()):
        super(RankingService, self).__init__()
        self.uri = uri
        self.endpoint = endpoint

    @coroutine
    def rank(self, facts):
        if not hasattr(self, 'rankings'):
           self.rankings = yield self.endpoint.fetch_and_parse(self.uri)
        
        return self.sort(facts)

    def sort(self, facts):
        #get the predicates for this set of facts
        predicates = facts['predicate']['value']

        #remove the rankings that dont apply.
        matches = [(p, o, v) for (p, o, v) in self.rankings if p == predicates or p in predicates]

        #reverse the list of matches
        #this is so we process the objects of least importance 
        #first and therefore get placed lower in the ranked output
        matches.reverse()

        #iterate over all the rankings that matched
        for (p, o, v) in matches:
            #find the object w/ the matching value inside the objects list
            o_matches = [obj for obj in facts['objects'] if obj['value'] == o]
            if o_matches:
                #iterate through the object matches, there should only be 1
                for m in o_matches:
                    #find its original location
                    old_location = facts['objects'].index(m)
                    #remove it
                    facts['objects'].pop(old_location)
                    #insert it at the beginning of the list
                    facts['objects'].insert(0, m)

        return facts

