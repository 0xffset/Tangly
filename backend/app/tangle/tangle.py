class Tangle(object):
    def __init__(self):
        super(Tangle, self).__init__()
        self.nodes = []
        self.peers = set()
        
        
    def create_new_node(self, data, prev_nodes, new_index, validity=0):
        pass