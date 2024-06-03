import pyotp

def generate_totp_key():
    return pyotp.random_base32()

def get_totp_uri(user, key):
    return pyotp.totp.TOTP(key).provisioning_uri(name=user.email, issuer_name="User")

def verify_totp_code(key, code):
    totp = pyotp.TOTP(key)
    return totp.verify(code)