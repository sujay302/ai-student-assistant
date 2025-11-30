from typing import Optional
from huggingface_hub import InferenceClient

from .config import get_client
from .prompts import BASE_SYSTEM_PROMPT


class StudentAssistant:
    """
    Wrapper around the Mistral model for student Q&A.
    """

    def __init__(self, client: Optional[InferenceClient] = None):
        self.client = client or get_client()

    def build_prompt(self, question: str) -> str:
        """
        Combine system instructions + student question into a single prompt.
        """
        return f"""{BASE_SYSTEM_PROMPT}

Student question:
{question}

Answer:
"""

    def answer(self, question: str) -> str:
        """
        Send the question to the model and return the generated answer text.
        """
        prompt = self.build_prompt(question)

        # Call Hugging Face Inference API
        raw_response = self.client.text_generation(
            prompt,
            max_new_tokens=512,
            temperature=0.7,
            top_p=0.9,
            repetition_penalty=1.1,
        )

        # Most recent huggingface_hub returns a plain string for text_generation()
        if isinstance(raw_response, str):
            return raw_response.strip()

        # Safety fallback: if it's some object with 'generated_text'
        generated = getattr(raw_response, "generated_text", None)
        if isinstance(generated, str):
            return generated.strip()

        # Last fallback: convert to string
        return str(raw_response).strip()
