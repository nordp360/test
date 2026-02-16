import json
from typing import List, Dict, Any
import redis

class ContextStore:
    def __init__(self, redis_url: str):
        self.redis = redis.Redis.from_url(redis_url, decode_responses=True)
        self.ttl = 3600  # 1 hour context lifetime

    def get_last_messages(self, session_id: str, limit: int = 5) -> List[Dict[str, Any]]:
        """
        Get the last N messages for a session.
        """
        key = f"context:{session_id}"
        # Redis list stores strings. We store JSON.
        # lrange returns the whole list or range.
        # We need last 'limit' items.
        # Redis lists are left-pushed or right-pushed.
        # Assuming we append to right (rpush), then lrange -limit -1 gives last N.
        
        # However, to be safe:
        try:
            raw_messages = self.redis.lrange(key, -limit, -1)
            return [json.loads(m) for m in raw_messages]
        except Exception:
            return []

    def append_message(self, session_id: str, role: str, text: str, keep_last: int = 10):
        """
        Append a message to the session context.
        """
        key = f"context:{session_id}"
        msg = json.dumps({"role": role, "parts": [text]})
        
        try:
            self.redis.rpush(key, msg)
            self.redis.ltrim(key, -keep_last, -1)
            self.redis.expire(key, self.ttl)
        except Exception:
            pass
