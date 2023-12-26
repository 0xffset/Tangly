from redis import Redis
from redis.exceptions import ConnectionError
import os


try:
    redis_client = Redis(
        host=os.environ.get("REDIS_HOST"),
        port=os.environ.get("REDIS_PORT"),
        password=os.environ.get("REDIS_PASSWORD"),
        ssl=True,
    )

    print("REDIS CONNECTED")
except ConnectionError as e:
    print(e)
