from redis import Redis
from redis.exceptions import ConnectionError
from os import getenv


try:
    redis_client = Redis(
        host="helpful-quetzal-46883.upstash.io",
        port=46883,
        password="a46c6ef3aacf49f2ad9dfca529393480",
        ssl=True,
    )

    print("REDIS CONNECTED")
except ConnectionError as e:
    print(e)
