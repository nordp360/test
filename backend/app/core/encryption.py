from cryptography.fernet import Fernet
from app.core.config import settings

class EncryptionService:
    def __init__(self, key: str = None):
        if not key:
            # Generate a key if not provided (in production this should be persistent!)
            # Here we derive it from SECRET_KEY or use a fallback
            if settings.secret_key and len(settings.secret_key) >= 32:
                 # Simple derivation for demo purposes - in real app use KDF
                 import base64
                 import hashlib
                 digest = hashlib.sha256(settings.secret_key.encode()).digest()
                 self.key = base64.urlsafe_b64encode(digest)
            else:
                 self.key = Fernet.generate_key()
        else:
            self.key = key.encode() if isinstance(key, str) else key
            
        self.cipher_suite = Fernet(self.key)

    def encrypt(self, data: str) -> str:
        if not data:
            return None
        return self.cipher_suite.encrypt(data.encode()).decode()

    def decrypt(self, token: str) -> str:
        if not token:
            return None
        try:
            return self.cipher_suite.decrypt(token.encode()).decode()
        except Exception:
            return None

# Singleton instance
encryption_service = EncryptionService()
