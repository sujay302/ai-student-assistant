import os
import requests
import math
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS 
from dotenv import load_dotenv

# --- 1. SETUP & CONFIGURATION ---
load_dotenv()

# Variable ko PEHLE define karein
HF_TOKEN = os.getenv("HF_TOKEN")

# Phir check ya print karein
if HF_TOKEN:
    print(f"Token Loaded: {HF_TOKEN[:5]}***")
    print("✅ Success! .env file se token mil gaya hai.")
else:
    print("❌ Error: .env file nahi mil rahi ya token galat hai.")

app = Flask(__name__,
            template_folder='frontend/chatting', 
            static_folder='frontend/chatting',
            static_url_path='')

CORS(app)

API_URL = "https://router.huggingface.co/v1/chat/completions"
HEADERS = {
    "Authorization": f"Bearer {HF_TOKEN}", 
    "Content-Type": "application/json"
}

# --- 2. MISTRAL QUERY FUNCTION ---
def query_mistral(prompt):
    payload = {
        "model": "mistralai/Mistral-7B-Instruct-v0.2",
        "messages": [{"role": "user", "content": prompt}],
        "parameters": {"max_new_tokens": 500}
    }
    try:
        response = requests.post(API_URL, headers=HEADERS, json=payload)
        data = response.json()
        
        # Unauthorized error handle karein
        if response.status_code == 401:
            return "⚠️ API Error: Invalid Token. Hugging Face par naya token banayein."

        # Chat Completion format
        if isinstance(data, dict) and "choices" in data:
            return data["choices"][0]["message"]["content"]
            
        # Text Generation format
        if isinstance(data, list) and len(data) > 0:
            return data[0].get('generated_text', '⚠️ Response blank hai.')
            
        # Error messages
        if isinstance(data, dict) and "error" in data:
            return f"⚠️ API Error: {data['error']}"

        return "⚠️ Unexpected response format from AI."
    except Exception as e:
        return f"⚠️ Connection Error: {str(e)}"

# --- 3. WEB ROUTES ---
@app.route('/')
def index():
    return render_template('chat.html')

@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    if not data or "message" not in data:
        return jsonify({"reply": "⚠️ No message received."})
    
    user_data = data.get("message")
    
    # Math command check
    if user_data.startswith("/math"):
        equation = user_data.replace("/math", "").strip()
        try:
            allowed_names = {"sqrt": math.sqrt, "pi": math.pi, "sin": math.sin}
            result = eval(equation, {"__builtins__": None}, allowed_names)
            return jsonify({"reply": f"🔢 Result: {result}"})
        except Exception as e:
            return jsonify({"reply": f"❌ Math Error: {str(e)}"})

    # AI call
    bot_reply = query_mistral(user_data)
    return jsonify({"reply": bot_reply})

# --- 4. SERVER START ---
if __name__ == "__main__":
    app.run(debug=True, port=5000)