from tornado.httpclient import AsyncHTTPClient
from tornado.gen import coroutine

import string
from tornado.httputil import url_concat

import json

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