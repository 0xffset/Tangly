import ast
import json
import base64
import pickle
from types import NoneType


def json_to_dict(base64: str) -> dict:
    pass


def dict_to_json():
    pass


def dict_to_base64(dictionary: dict) -> str:
    encoded_dict = str(dictionary).encode("utf-8")
    base64_dict = base64.b64encode(encoded_dict)
    return base64_dict


# Get a base64 string and return a dict with the tangle
def base64_to_dict(base64_str) -> dict:
    decoded_data = {
        key.decode("utf-8"): value.decode("utf-8") for key, value in base64_str.items()
    }
    tangle = base64.b64decode(decoded_data["tangle"]).decode("utf-8")
    return ast.literal_eval(tangle)


# Get all nodes connected into the Tangle Network
def get_all_nodes(base64_str: str) -> dict:
    nodes = base64_to_dict(base64_str)["tangle"]
    return nodes


# Get all peers connected int othe Tangle network
def get_all_peers(base64_str: str) -> set:
    nodes = get_all_nodes(base64_str)
    peers = set(
        item["data"]["sender"]
        for item in nodes
        if "data" in item and item["data"] is not None and "sender" in item["data"]
    )
    return peers
