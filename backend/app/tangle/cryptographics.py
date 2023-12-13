from cryptography.fernet import Fernet
import os
import secrets
import hashlib
import boto3
from urllib.parse import urlparse
from io import BytesIO

KEY = b"Ke0Ft_85-bXQ8GLOOsEI6JeT2mD-GeI8pkcP_re8wio="
S3_BUCKET = "tangly-bucket"

# Set up AWS credentials and create an S3 client
session = boto3.session.Session(region_name="us-east-2")

s3 = session.client(
    "s3",
    aws_access_key_id="AKIARE7WOK7XQV2KZBED",
    aws_secret_access_key="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",
    config=boto3.session.Config(signature_version="s3v4"),
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
    # Create an in-memory file-like object
    encrypted_file_obj = BytesIO(encrypted_data)

    try:
        s3.upload_fileobj(encrypted_file_obj, S3_BUCKET, encrypted_filename)
    except Exception as e:
        raise f"Unable to upload the file to S3: {str(e)}"
    finally:
        # Close the in-memory file-like object
        encrypted_file_obj.close()

    return f"s3://tangly-bucket/{encrypted_filename}"


def parse_s3_path(s3_path):
    parsed_url = urlparse(s3_path)
    bucket_name = parsed_url.netloc
    s3_file_name = parsed_url.path.lstrip("/")
    return bucket_name, s3_file_name


def generate_presigned_url(bucket_name, s3_file_name, expiration=3600):
    # Generate a pre-signed URL for the file with the specified expiration time (in seconds)
    presigned_url = s3.generate_presigned_url(
        "get_object",
        Params={"Bucket": bucket_name, "Key": s3_file_name},
        ExpiresIn=expiration,
    )

    return presigned_url


def decrypt_file(input_file, file_extension, file_name):
    cipher = Fernet(KEY)

    # Download the file
    bucket_name, s3_file_name = parse_s3_path(input_file)
    s3_encrypted_file = s3.get_object(Bucket=bucket_name, Key=s3_file_name)
    encrypted_data = s3_encrypted_file["Body"].read()
    # Decrypt the data
    decrypted_data = cipher.decrypt(encrypted_data)
    # Create an in-memory file-like object for decrypted data
    decrypted_file_obj = BytesIO(decrypted_data)

    decrypted_filename = f"{file_name}"
    try:
        # Upload the decrypted data directly to S3
        s3.upload_fileobj(decrypted_file_obj, S3_BUCKET, decrypted_filename)
    except Exception as e:
        raise f"Unable to upload the decrypted file to S3: {str(e)}"
    finally:
        # Close the in-memory file-like object
        decrypted_file_obj.close()

    # Generate a presigned URL for the uploaded file
    download_path = generate_presigned_url(S3_BUCKET, decrypted_filename)
    return download_path


def get_hash_file(file_path):
    return hashlib.sha256(file_path.encode("utf-8")).hexdigest()
