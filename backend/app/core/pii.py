import re

def sanitize_pii(text: str) -> str:
    """
    Simple PII sanitizer that masks emails and phone numbers.
    """
    if not text:
        return text
        
    # Mask emails
    text = re.sub(r'[\w\.-]+@[\w\.-]+', '[EMAIL PROTECTED]', text)
    
    # Mask phone numbers (simple pattern)
    text = re.sub(r'\+?\d{9,15}', '[PHONE REMOVED]', text)
    
    # Mask PESEL (11 digits)
    text = re.sub(r'\b\d{11}\b', '[PESEL REMOVED]', text)
    
    return text
