from datetime import datetime
from time import time
from requests import request
import requests
from app.redis_client import redis_util
from app.tangle.utils import (
    dict_to_base64,
    get_all_nodes,
    get_all_peers,
    base64_to_dict,
)
import base64
import hashlib
import json
from app.tangle.props import REQUIRED_PROOF, NUMBER_OF_VALIDATION_NODES
from app.schema import TangleGetNodeDetailsSchema
from app.tangle.cryptographics import decrypt_file, encrypt_file, get_hash_file

HASH_NAME = "tangle"


class TangleService:
    def __init__(self) -> None:
        self.nodes = get_all_nodes(redis_util.get_hash("tangle"))
        self.peers = get_all_peers(redis_util.get_hash("tangle"))

    @staticmethod
    async def get_tangle():
        base64_str_tangle = redis_util.get_hash("tangle")
        tangle = base64_to_dict(base64_str_tangle)
        return tangle

    @staticmethod
    async def get_nodes():
        base64_str_tangle = redis_util.get_hash("tangle")
        nodes = get_all_nodes(base64_str_tangle)
        return nodes

    @staticmethod
    async def get_peers():
        base64_str_tangle = redis_util.get_hash("tangle")
        peers = get_all_peers(base64_str_tangle)
        return peers

    @staticmethod
    async def get_node_detail(index):
        base64_str_tangle = redis_util.get_hash("tangle")
        nodes = get_all_nodes(base64_str_tangle)
        return next((item for item in nodes if item.get("index") == index), None)

    @staticmethod
    async def get_all_transactions_by_sender(sender):
        base64_str_tangle = redis_util.get_hash("tangle")
        nodes = get_all_nodes(base64_str_tangle)
        return list(
            item
            for item in nodes
            if item["data"] is not None and item["data"]["sender"] == sender
        )

    @staticmethod
    async def get_all_transactions_user(id):
        base64_str_tangle = redis_util.get_hash("tangle")
        nodes = get_all_nodes(base64_str_tangle)
        # placeholder
        output_info = []
        # We get all nodes by the id (sender)
        sender_info = list(
            item
            for item in nodes
            if item["data"] is not None
            and (item["data"]["sender"] == id or item["data"]["recipient"] == id)
        )
        for item in sender_info:
            if "data" in item and item["data"] is not None:
                if item["data"]["sender"] == id:
                    output_info.append(
                        {
                            "type": "sender",
                            "timestamp": item["timestamp"],
                            "recipient": item["data"]["recipient"],
                        }
                    )
                elif item["data"]["recipient"] == id:
                    output_info.append(
                        {
                            "type": "recipient",
                            "timestamp": item["timestamp"],
                            "sender": item["data"]["sender"],
                        }
                    )
        output_info = sorted(output_info, key=lambda x: x["timestamp"], reverse=True)
        return output_info[:5]

    @staticmethod
    async def get_graphs(id):
        base64_str_tangle = redis_util.get_hash("tangle")
        nodes = get_all_nodes(base64_str_tangle)
        info_output = {
            "labels": [],
            "transactions_sended_per_day": [],
            "transactions_received_per_day": [],
        }

        # We get all nodes by the id (sender)
        sender_info = list(
            item
            for item in nodes
            if item["data"] is not None
            and (item["data"]["sender"] == id or item["data"]["recipient"] == id)
        )
        transacations_sended_per_day = {}
        transacations_received_per_day = {}
        labels = set()
        for item in sender_info:
            dt_object = datetime.utcfromtimestamp(item["timestamp"])
            formatted_date = dt_object.strftime("%d %b %Y")
            labels.add(formatted_date)
            if item["data"] is not None and item["data"]["recipient"] == id:
                if transacations_received_per_day.get(formatted_date) != None:
                    transacations_received_per_day[formatted_date] = (
                        transacations_received_per_day.get(formatted_date, 0) + 1
                    )
                else:
                    transacations_received_per_day[formatted_date] = 0
            elif item["data"] is not None and item["data"]["sender"] == id:
                if transacations_sended_per_day.get(formatted_date) != None:
                    transacations_sended_per_day[formatted_date] = (
                        transacations_sended_per_day.get(formatted_date, 0) + 1
                    )
                else:
                    transacations_sended_per_day[formatted_date] = 0
        recieved = []
        sended = []
        labels = list(labels)
        for i in range(len(labels)):
            if transacations_received_per_day.get(labels[i]) == None:
                recieved.append(0)
            else:
                recieved.append(transacations_received_per_day.get(labels[i]))

            if transacations_sended_per_day.get(labels[i]) == None:
                recieved.append(0)
            else:
                sended.append(transacations_sended_per_day.get(labels[i]))

        info_output["transactions_received_per_day"] = recieved
        info_output["transactions_sended_per_day"] = sended
        info_output["labels"] = labels
        return info_output

    @staticmethod
    async def get_user_statistics(id):
        base64_str_tangle = redis_util.get_hash("tangle")
        nodes = get_all_nodes(base64_str_tangle)
        statistics = {
            "total_sended_transactions": 0,
            "total_received_transactions": 0,
            "total_transactions": 0,
        }

        # Total of sended's transactions by the user
        total_sended_transactions = len(
            list(
                item
                for item in nodes
                if item["data"] is not None and item["data"]["sender"] == id
            )
        )
        # Total of received's transactions
        total_received_transactions = len(
            list(
                item
                for item in nodes
                if item["data"] is not None and item["data"]["recipient"] == id
            )
        )
        # Total of transactions
        total_of_transactions = len(nodes)
        statistics["total_sended_transactions"] = total_sended_transactions
        statistics["total_received_transactions"] = total_received_transactions
        statistics["total_transactions"] = total_of_transactions
        return statistics

    @staticmethod
    async def make_new_transaction(sender, recipient, file):
        TangleService.resolve_conflicts()

        values = {"sender": sender, "recipient": recipient}
        # Get the file extension
        file_extension = "." + file.filename.split(".")[1]
        values["file_extension"] = file_extension
        # Encrypt the file
        encrypted_path = encrypt_file(file)
        # Get the signature
        sha256_signature = get_hash_file(encrypted_path)
        # Save the file encrypted in a location
        values["signature"] = sha256_signature
        values["file"] = encrypted_path
        TangleService.send_transaction(values)

    @staticmethod
    def send_transaction(data):
        base64_str_tangle = redis_util.get_hash("tangle")
        nodes = get_all_nodes(base64_str_tangle)
        nodes_to_attch = []
        nodes_indexes = []
        new_index = len(nodes)
        worst_cases_scinario = []
        worst_cases_scinario_indexes = []

        for i in range(len(nodes) - 1, -1, -1):
            node = nodes[i]
            if node["validity"] < REQUIRED_PROOF:
                nodes_to_attch.append(node)
                nodes_indexes.append(node["index"])
            else:
                if (
                    worst_cases_scinario == []
                    or len(worst_cases_scinario_indexes) < NUMBER_OF_VALIDATION_NODES
                ):
                    worst_cases_scinario.append(node)
                    worst_cases_scinario_indexes.append(node["index"])
            if len(nodes_to_attch) == NUMBER_OF_VALIDATION_NODES:
                break

        while len(nodes_to_attch) < NUMBER_OF_VALIDATION_NODES:
            nodes_to_attch.append(worst_cases_scinario.pop())
            nodes_indexes.append(worst_cases_scinario_indexes.pop())

        for node in nodes_to_attch:
            TangleService.validate_node(node)

        # Add new node to tangle
        new_node = TangleService.create_node(data, nodes_indexes, new_index)
        print(new_index)
        nodes.insert(new_index, new_node)
        TangleService.update_tangle(nodes)
        return new_index

    async def resolve_conflicts():
        base64_str_tangle = redis_util.get_hash("tangle")
        neighbours = get_all_peers(base64_str_tangle)
        nodes = get_all_nodes(base64_str_tangle)
        new_tangle = None

        max_length = len(nodes)

        for peer in neighbours:
            response = requests.get("http://" + str(peer) + "/tangle_content")
            if response.status_code == 200:
                length = response.json()["length"]
                tangle = response.json()["tangle"]

                if length > max_length and TangleService.valid_tangle(tangle):
                    max_length = length
                    new_tangle = tangle
        if new_tangle:
            nodes = new_tangle
            return True
        return False

    async def valid_tangle(tangle):
        for node in tangle:
            if node["index"] >= NUMBER_OF_VALIDATION_NODES:
                validity_of_node = node["validity"]
                next_nodes = node["next_nodes"]
                if validity_of_node < len(next_nodes):
                    return False
            for n_node in next_nodes:
                if node["index"] not in tangle[n_node]["previous_nodes"]:
                    return False
        return True

    @staticmethod
    def validate_node(node):
        base64_str_tangle = redis_util.get_hash("tangle")
        nodes = get_all_nodes(base64_str_tangle)
        if nodes[node["index"]]["validity"] < REQUIRED_PROOF:
            last_proof = nodes[node["index"]]["proof"]  # This nodes proof
            last_hash = ""

            for prev_hash in nodes[node["index"]]["previous_hashs"]:
                last_hash += prev_hash  # the hashes of the nodes his node connects
                nodes[node["index"]]["proof"] = TangleService.proof_of_work(
                    last_proof, last_hash
                )
                nodes[node["index"]]["validity"] = +1

    @staticmethod
    async def valid_proof(last_proof, last_hash, proof):
        guess = (str(last_proof) + str(last_hash) + str(proof)).encode()
        guess_hash = hashlib.sha256(guess).hexdigest()
        return guess_hash[:4] == "0000"

    async def proof_of_work(last_proof, last_hash):
        proof = 0
        while TangleService.valid_proof(last_proof, last_hash, proof) is False:
            proof += 1
        return proof

    def create_node(data, prev_nodes, new_index, validity=0):
        base64_string = redis_util.get_hash("tangle")
        nodes = get_all_nodes(base64_string)
        prev_hashes = []
        """
		Se podría agregar una futura actualización para
  		que actualize cada nodo para que actualize aquellos 
    	nodos que apuntes a esta transacción.
		"""
        for i in prev_nodes:
            prev_hashes.append(TangleService.hash(nodes[i]))
            # Ahora les decimos a los nodos a los que estamos apuntando que les estamos apuntando
            nodes[i]["next_nodes"].append(new_index)
        Node = {
            "index": new_index,
            "timestamp": time(),
            "data": data,
            "proof": 0,
            "previous_hashs": prev_hashes,
            "previous_nodes": prev_nodes,
            "next_nodes": [],
            "validity": validity,
        }
        return Node

    @staticmethod
    def hash(node):
        node_string = json.dumps(node, sort_keys=True).encode()
        return hashlib.sha256(node_string).hexdigest()

    @staticmethod
    def update_tangle(nodes):
        redis_util.delete_hash("tangle")
        data_dict = {"tangle": nodes}
        base64_dict = dict_to_base64(data_dict)
        tangle = {"tangle": base64_dict}
        print(data_dict)
        redis_util.save_hash("tangle", tangle)


"""
Generate tangle template
"""


async def generate_tangle_template():
    _already_exist_template = redis_util.get_hash("tangle")
    if not _already_exist_template:
        data_dict = {
            "tangle": [
                {
                    "index": 0,
                    "timestamp": time(),
                    "data": None,
                    "proof": 0,
                    "previous_hashs": [],
                    "previous_nodes": [],
                    "next_nodes": [2],
                    "validity": 2,
                },
                {
                    "index": 1,
                    "timestamp": time(),
                    "data": None,
                    "proof": 0,
                    "previous_hashs": [],
                    "previous_nodes": [],
                    "next_nodes": [2],
                    "validity": 2,
                },
            ],
            "length": 2,
        }
        base64_dict = dict_to_base64(data_dict)
        tangle = {"tangle": base64_dict}
        redis_util.save_hash("tangle", tangle)
