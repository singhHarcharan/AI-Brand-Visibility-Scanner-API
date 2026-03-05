import os
import requests
import json
import logging
import time
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)


class OllamaClient:
    """Client for Ollama local AI inference."""

    def __init__(self):
        self.base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        self.model = os.getenv("OLLAMA_MODEL", "llama3.1:8b")
        self.timeout = int(os.getenv("OLLAMA_TIMEOUT", "30"))

    def complete(self, system_prompt: str, user_prompt: str) -> str:
        """
        Send a prompt to Ollama and return the text response.

        Args:
            system_prompt: Instructions that define the AI's role/behavior.
            user_prompt: The actual query to send.

        Returns:
            The text content of the AI's response.
        """
        start_time = time.time()
        combined_prompt = f"{system_prompt}\n\n{user_prompt}"
        
        logger.debug(f"🔄 Sending request to Ollama model '{self.model}'")
        logger.debug(f"📤 Prompt length: {len(combined_prompt)} chars")
        
        payload = {
            "model": self.model,
            "prompt": combined_prompt,
            "stream": False,
            "options": {
                "temperature": 0.7,
                "top_p": 0.9,
                "max_tokens": 1024
            }
        }

        try:
            response = requests.post(
                f"{self.base_url}/api/generate",
                json=payload,
                timeout=self.timeout
            )
            response.raise_for_status()
            
            result = response.json()
            response_text = result.get("response", "")
            
            elapsed_time = time.time() - start_time
            logger.debug(f"📥 Received response in {elapsed_time:.2f}s (length: {len(response_text)} chars)")
            
            return response_text
            
        except requests.exceptions.Timeout:
            elapsed_time = time.time() - start_time
            logger.error(f"⏰ Ollama request timed out after {elapsed_time:.2f}s")
            raise Exception(f"Ollama API timeout after {self.timeout}s")
        except requests.exceptions.ConnectionError:
            logger.error(f"🔌 Failed to connect to Ollama at {self.base_url}")
            raise Exception(f"Cannot connect to Ollama service at {self.base_url}")
        except requests.exceptions.RequestException as e:
            elapsed_time = time.time() - start_time
            logger.error(f"❌ Ollama API error after {elapsed_time:.2f}s: {str(e)}")
            raise Exception(f"Ollama API error: {str(e)}")
        except json.JSONDecodeError as e:
            logger.error(f"🔧 Invalid JSON response from Ollama: {str(e)}")
            raise Exception(f"Invalid JSON response from Ollama: {str(e)}")

    def health_check(self) -> bool:
        """Check if Ollama service is running and model is available."""
        try:
            logger.debug(f"🏥 Checking Ollama health at {self.base_url}")
            response = requests.get(f"{self.base_url}/api/tags", timeout=5)
            response.raise_for_status()
            
            models = response.json().get("models", [])
            model_names = [model["name"] for model in models]
            
            if self.model in model_names:
                logger.debug(f"✅ Model '{self.model}' is available")
                return True
            else:
                logger.warning(f"⚠️  Model '{self.model}' not found. Available: {model_names}")
                return False
            
        except requests.exceptions.RequestException as e:
            logger.error(f"❌ Ollama health check failed: {str(e)}")
            return False
