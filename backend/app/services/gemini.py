import requests
import logging

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self, api_key: str):
        self.api_key = api_key
        # Default model
        self.model = "gemini-1.5-flash" 
        self.url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent"

    def generate(self, prompt: str, context: list = None) -> str:
        if not self.api_key:
            return "Gemini API key is not configured."

        messages = []
        if context:
            # Context is expected to be list of {"role": "user"/"model", "parts": ["text"]}
            # But the stored format in ContextStore is {"role": "...", "parts": ["..."]}
            # We need to adapt if needed. Assuming context store saves compatible format.
            # But wait, ContextStore saves `{"role": role, "parts": [text]}` which is not quite Google format (parts object list).
            # Google format: `{"role": "user", "parts": [{"text": "Hello"}]}`.
            # Let's fix ContextStore format in this service or assume simple format.
            
            # Let's adjust to be safe: context items are dictionaries.
            for item in context:
                # If item['parts'] is list of strings, convert to list of dicts for API
                parts = []
                for p in item.get('parts', []):
                    if isinstance(p, str):
                        parts.append({"text": p})
                    elif isinstance(p, dict) and 'text' in p:
                        parts.append(p)
                
                role = item.get('role', 'user')
                # Map 'assistant' to 'model' just in case
                if role == 'assistant':
                    role = 'model'
                    
                messages.append({"role": role, "parts": parts})

        # Add current prompt
        messages.append({"role": "user", "parts": [{"text": prompt}]})

        try:
            response = requests.post(
                self.url,
                headers={"Content-Type": "application/json"},
                params={"key": self.api_key},
                json={"contents": messages}
            )
            response.raise_for_status()
            data = response.json()
            
            # Extract text
            # Response: candidates[0].content.parts[0].text
            if 'candidates' in data and data['candidates']:
                candidate = data['candidates'][0]
                if 'content' in candidate and 'parts' in candidate['content']:
                    parts = candidate['content']['parts']
                    text = "".join([p.get('text', '') for p in parts])
                    return text
            
            return "No response generated."

        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            return "Error calling Gemini API."
