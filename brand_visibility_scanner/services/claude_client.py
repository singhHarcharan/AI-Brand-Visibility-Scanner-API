import os
import anthropic
from dotenv import load_dotenv

load_dotenv()


class ClaudeClient:
    """Thin wrapper around the Anthropic Claude API."""

    def __init__(self):
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise EnvironmentError(
                "ANTHROPIC_API_KEY is not set. Add it to your .env file."
            )
        self.client = anthropic.Anthropic(api_key=api_key)
        self.model = os.getenv("CLAUDE_MODEL", "claude-3-haiku-20240307")
        self.max_tokens = int(os.getenv("CLAUDE_MAX_TOKENS", "1024"))

    def complete(self, system_prompt: str, user_prompt: str) -> str:
        """
        Send a prompt to Claude and return the text response.

        Args:
            system_prompt: Instructions that define Claude's role/behavior.
            user_prompt: The actual query to send.

        Returns:
            The text content of Claude's response.
        """
        message = self.client.messages.create(
            model=self.model,
            max_tokens=self.max_tokens,
            system=system_prompt,
            messages=[
                {"role": "user", "content": user_prompt},
            ],
        )
        return message.content[0].text
