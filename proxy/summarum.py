from tornado.httpclient import AsyncHTTPClient
from tornado.httpclient import HTTPError
from tornado.gen import coroutine

from rdflib import Graph
import string


class Endpoint(object):
    """
        The sole purpose of this class is to fetch the dbpedia pagerank rankings from
        summarum (http://km.aifb.kit.edu/services/summa/summarum). 
    """

    def __init__(self, http_client = AsyncHTTPClient()):
        self.http_client = http_client
            

    @coroutine
    def fetch(self, uri):
        """Retrieves rankings from summarum as a turtle dataset
        """
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
        """Generates SPARQL query to retrieve rankings

        This SPARQL query is executed against a graph created
        from a turtle dataset.

        The resource were looking for may be an object or subject so
        look for it as an object and subject individually and union
        the results.
        """
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
        """Parses turtle response from the summarum endpoint

        Parse will create a graph from the turtle response and query
        for the rankings. Once the rankings are retrieved, they will
        be converted to a list of tuples with primative values
        """
        #create a graph and parse the turtle dataset
        g = Graph()
        g.parse(data = turtle, format='n3')

        #generate the query
        sparql = self.get_query(uri)
        #get the results
        results = g.query(sparql)
        
        #simplify the results; remove the URINode wrappers
        return [(str(p), str(o), float(v)) for p, o, v in results]

    @coroutine
    def fetch_and_parse(self, uri):
        """Fetches pagerank dataset and parses it all in one.
        """
        turtle = yield self.fetch(uri)
        result = []
        if turtle:
            result = self.parse(uri, turtle)
        return result



class RankingService(object):
    """A service used to rank the facts of a resource.

    The facts are ranked according to the rankings from the summarum endpoint.
    """
    def __init__(self, uri, endpoint = Endpoint()):
        super(RankingService, self).__init__()
        self.uri = uri
        self.endpoint = endpoint

    @coroutine
    def rank(self, facts):
        """Ranks the given facts
        """
        #load the rankinds for the given resource
        #and cache for furture use
        if not hasattr(self, 'rankings'):
           self.rankings = yield self.endpoint.fetch_and_parse(self.uri)
        
        #return the sorted facts
        return self.sort(facts)

    def sort(self, facts):
        """Arranges the given facts to appear in order of importance
        """

        #get the predicates for this set of facts
        predicates = facts['predicate']['value']

        #remove the rankings that dont apply to the predicates
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

