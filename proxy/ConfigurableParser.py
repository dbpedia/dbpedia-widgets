import json

class ConfigurableParser(object):
    """docstring for ConfigurableParser"""
    def __init__(self, facts):
        self.facts = facts
        
    def parse(self):
        type_nodes = [node["o"]["value"] for node in self.facts if node["p"]["value"] == "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"]
        return [self.process_type(rdf_type) for rdf_type in type_nodes]

    def process_type(self, rdf_type):
        config_location = rdf_type.replace('http://', 'configurations/') + ".json"
        result = {}
        with open(config_location) as f:
            config = f.read()
            result = self.generate_results(json.loads(config))
        return result

    def generate_results(self, configuration):
        # print(configuration.keys())
        label = list(configuration.keys())[0]
        output = {
            "id": label,
            "facts": []
        }

        specs = list(configuration.values())[0]

        for spec in specs:
            specLabel = spec['label']
            specBinding = spec['from']

            matching_facts = [fact for fact in self.facts if fact['p']['value'] == specBinding]

            print('matching_facts', set([fact['p']['value'] for fact in matching_facts]))

            objects = []

            for fact in matching_facts:
                obj = fact['o']
                objects.append(obj)

            spec_result = {
                'predicate': {
                    'value': [fact['p']['value'] for fact in matching_facts],
                    'label': specLabel
                }
                'objects': objects
            }

            output['facts'].append(spec_result)

            # print('spec_result', spec_result)

            # print(output['facts'])


        return output
