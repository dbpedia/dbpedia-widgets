import json
from tornado.gen import coroutine

class ConfigurableParser(object):
    """docstring for ConfigurableParser"""
    def __init__(self, facts, ranker=None):
        self.facts = facts
        self.ranker = ranker
        
    @coroutine
    def parse(self):
        type_nodes = [node["o"]["value"] for node in self.facts if node["p"]["value"] == "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"]
        # results = [self.process_type(rdf_type) for rdf_type in type_nodes]
        results = []
        for rdf_type in type_nodes:
            result = yield self.process_type(rdf_type)
            results += [result]

        return [r for r in results if r] #remove any empty dicts

    @coroutine
    def process_type(self, rdf_type):
        config_location = rdf_type.replace('http://', 'configurations/') + ".json"
        result = {}

        #try to open the configuration file
        #if one is not found, return an empty result and continue one
        try:
            with open(config_location) as f:
                config = f.read()
                result = yield self.generate_results(json.loads(config))
        except FileNotFoundError:
            pass

        return result

    @coroutine
    def generate_results(self, configuration):
        label = list(configuration.keys())[0]
        output = {
            "id": label,
            "facts": []
        }

        specs = list(configuration.values())[0]

        for spec in specs:
            specLabel = spec['label']
            specBinding = spec['from']

            matching_facts = [fact for fact in self.facts if fact['p']['value'] == specBinding or fact['p']['value'] in specBinding]

            objects = []
            for fact in matching_facts:
                obj = fact['o']

                if 'object_label' in fact:
                    obj['label'] = fact['object_label']['value']

                if obj['type'] == 'uri' and 'label' not in obj:
                    continue
                
                if obj not in objects:
                    objects.append(obj)

            spec_result = {
                'predicate': {
                    'value': specBinding,
                    'label': specLabel
                },
                'objects': objects
            }

            if self.ranker:
                spec_result = yield self.ranker.rank(spec_result)

            if 'limit' in spec:
                spec_result['objects'] = spec_result['objects'][:spec['limit']]

            if spec_result['objects']:
                output['facts'].append(spec_result)

        return output
