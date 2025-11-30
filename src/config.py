import os
from dotenv import load_dotenv
from huggingface_hub import InferenceClient

# 1. Load environment variables from .env
load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")

if HF_TOKEN is None:
    raise ValueError("HF_TOKEN not found. Please set it in the .env file.")

# 2. Hugging Face model name (Mistral v0.2)
MODEL_NAME = "mistralai/Mistral-7B-Instruct-v0.2"
# Agar tum Mixtral ya koi aur version use karna chaho:
# MODEL_NAME = "mistralai/Mixtral-8x7B-Instruct-v0.1"  # example

def get_client() -> InferenceClient:
    """
    Create and return a Hugging Face InferenceClient for Mistral.
    """
    return InferenceClient(model=MODEL_NAME, token=HF_TOKEN)
