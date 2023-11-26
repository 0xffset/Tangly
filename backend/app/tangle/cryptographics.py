from cryptography.fernet import Fernet
import os
import secrets
import hashlib

KEY = b"Ke0Ft_85-bXQ8GLOOsEI6JeT2mD-GeI8pkcP_re8wio="

DIRECTORY = os.path.dirname(__file__) + "/storage"
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

    return encrypted_path


def decrypt_file(input_file, file_extension):
    cipher = Fernet(KEY)
    
    with open(input_file, "rb") as file:
        data = file.read()
    decrypted_data = cipher.decrypt(data)
    decrypted_filename = f"decrypted_{secrets.token_hex(8)}{file_extension}"
    decrypted_path = f"{DIRECTORY}/{decrypted_filename}"

    with open(decrypted_path, "wb") as file:
        file.write(decrypted_data)

    return decrypted_path


def get_hash_file(file_path):
    return hashlib.sha256(file_path.encode("utf-8")).hexdigest()
