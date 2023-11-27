from cryptography.fernet import Fernet
import os
import secrets
import hashlib
import dropbox
from dropbox.files import WriteMode
import boto3
import tempfile
from urllib.parse import urlparse

KEY = b"Ke0Ft_85-bXQ8GLOOsEI6JeT2mD-GeI8pkcP_re8wio="
DIRECTORY = os.path.dirname(__file__) + "/storage"
DROPBOX_PATH = "/tangly"


# Set up AWS credentials and create an S3 client
s3 = boto3.client(
    "s3",
    aws_access_key_id="AKIARE7WOK7X63RUGEGD",
    aws_secret_access_key="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",
)


# Verify is exist the store folder, otherwise, create it
if not os.path.exists("storage"):
    os.makedirs("storage")


def check_directory():
    if not os.path.exists("storage"):
        os.makedirs("storage")


def encrypt_file(input_file):
    cipher = Fernet(KEY)
    data = input_file.file.read()
    encrypted_data = cipher.encrypt(data)
    encrypted_filename = f"encrypted_{secrets.token_hex(8)}.bin"
    encrypted_path = f"{DIRECTORY}/{encrypted_filename}"
    with open(encrypted_path, "wb") as file:
        file.write(encrypted_data)
    try:
        s3.upload_file(encrypted_path, "tangly-bucket", encrypted_filename)
        os.remove(encrypted_path)
    except:
        raise ("Unable to upload the file")

    return f"s3://tangly-bucket/{encrypted_filename}"


def parse_s3_path(s3_path):
    parsed_url = urlparse(s3_path)
    bucket_name = parsed_url.netloc
    s3_file_name = parsed_url.path.lstrip("/")
    return bucket_name, s3_file_name


def decrypt_file(input_file, file_extension):
    cipher = Fernet(KEY)

    # Download the file
    bucket_name, s3_file_name = parse_s3_path(input_file)
    temp_dir = tempfile.mkdtemp()
    # Download the encrypted file from S3
    local_file_path = os.path.join(temp_dir, os.path.basename(s3_file_name))
    decrypted_path = s3.download_file(bucket_name, s3_file_name, local_file_path)

    with open(local_file_path, "rb") as file:
        data = file.read()
    decrypted_data = cipher.decrypt(data)
    decrypted_filename = f"decrypted_{secrets.token_hex(8)}{file_extension}"
    decrypted_path = os.path.join(temp_dir, decrypted_filename)
    with open(decrypted_path, "wb") as file:
        file.write(decrypted_data)

    return decrypted_path


def get_hash_file(file_path):
    return hashlib.sha256(file_path.encode("utf-8")).hexdigest()
