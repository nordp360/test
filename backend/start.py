import os
import uvicorn
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("start_script")

if __name__ == "__main__":
    # Get port from environment variable, default to 8000
    port_env = os.environ.get("PORT", "8000")
    
    # Handle cases where PORT might be an empty string or literal "${PORT}"
    if not port_env or port_env == "${PORT}":
        logger.info("PORT environment variable is empty or literal '${PORT}', using default 8000")
        port = 8000
    else:
        try:
            port = int(port_env)
            logger.info(f"Using PORT: {port}")
        except ValueError:
            logger.warning(f"Invalid PORT value '{port_env}', falling back to 8000")
            port = 8000
            
    # Run uvicorn
    # Note: we use the string "app.main:app" so that reload and other features work correctly
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, log_level="info")
