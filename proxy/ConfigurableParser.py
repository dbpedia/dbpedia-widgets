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
        return None
