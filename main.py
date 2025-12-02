import os
import requests
import time
import math
from dotenv import load_dotenv

# 1. SETUP
load_dotenv()
HF_TOKEN = os.getenv("HF_TOKEN")

# We use v0.2 because it is very stable on the free tier
API_URL = "https://router.huggingface.co/v1/chat/completions"
HEADERS = {
    "Authorization": f"Bearer {HF_TOKEN}",
    "Content-Type": "application/json"
}

def query_mistral(prompt):
    payload = {
        "model": "mistralai/Mistral-7B-Instruct-v0.2:featherless-ai",
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }

    response = requests.post(API_URL, headers=HEADERS, json=payload)

    """
    print("Status:", response.status_code)
    print("Response:", response.text)
    """

    try:
        data = response.json()
    except:
        return {"error": "Invalid JSON response from API"}

    if "choices" in data and len(data["choices"]) > 0:
        return data["choices"][0]["message"]["content"]

    return data




# 4. TOOL FUNCTIONS
def handle_math(equation):
    try:
        # Safe math evaluation
        allowed_names = {"sqrt": math.sqrt, "pi": math.pi, "sin": math.sin, "cos": math.cos, "tan": math.tan}
        result = eval(equation, {"__builtins__": None}, allowed_names)
        return f"🔢 Result: {result}"
    except Exception as e:
        return f"❌ Math Error: {e}"


# Global To-Do List
todo_list = []

def handle_todo(action, task_text):
    if action == "add":
        todo_list.append(task_text)
        return f"✅ Added: '{task_text}'"
    elif action == "list":
        if not todo_list: return "📂 Your list is empty."
        return "\n".join([f"{i+1}. {t}" for i, t in enumerate(todo_list)])
    
def handle_todo_remove(arg):
    if not todo_list:
        return "📂 Your list is empty."

    # If the user passed a number -> remove by index
    if arg.isdigit():
        idx = int(arg) - 1
        if 0 <= idx < len(todo_list):
            removed = todo_list.pop(idx)
            return f"🗑️ Removed: '{removed}'"
        return "⚠️ Invalid index."

    # Otherwise -> remove by matching text
    for t in todo_list:
        if t.lower() == arg.lower():
            todo_list.remove(t)
            return f"🗑️ Removed: '{t}'"
    
    return "⚠️ Task not found."




def handle_todo_edit(arg):
    if "|" not in arg:
        return "⚠️ Usage: /edit old text | new text"

    old, new = [x.strip() for x in arg.split("|", 1)]

    # If the user entered an index instead of old text
    if old.isdigit():
        idx = int(old) - 1
        if 0 <= idx < len(todo_list):
            old_text = todo_list[idx]
            todo_list[idx] = new
            return f"✏️ Updated: '{old_text}' → '{new}'"
        return "⚠️ Invalid index."

    # Edit by matching text
    for i, t in enumerate(todo_list):
        if t.lower() == old.lower():
            todo_list[i] = new
            return f"✏️ Updated: '{t}' → '{new}'"

    return "⚠️ Task not found."




# 5. THE CLI PARSER LOOP
def start_app():
    print("🎓 Student AI Assistant (Requests Version) Online.")
    print("Commands: /todo [task], /math [eq], or type a question.\n")

    while True:
        try:
            user_input = input("You > ").strip()
            
            if user_input.lower() in ["exit", "quit"]:
                print("👋 Bye!")
                break
            
            if not user_input: continue

            # --- PARSER LOGIC ---
            if user_input.startswith("/"):
                # Split "/command argument" into ["/command", "argument"]
                parts = user_input.split(" ", 1)
                cmd = parts[0].lower()
                arg = parts[1] if len(parts) > 1 else ""

                if cmd == "/todo":
                    if arg: 
                        print(handle_todo("add", arg))
                    else: 
                        print(handle_todo("list", ""))

                elif cmd == "/remove":
                    if arg:
                       print(handle_todo_remove(arg))
                    else:
                        print("⚠️ Usage: /remove 2   or   /remove task name")

                elif cmd == "/edit":
                    if arg:
                        print(handle_todo_edit(arg))
                    else:
                        print("⚠️ Usage: /edit old | new")

                elif cmd == "/math":
                    if arg:
                        print(handle_math(arg))
                    else:
                        print("⚠️ Usage: /math 22/7")
                
                else:
                    print(f"❓ Unknown command: {cmd}")



            # --- CHAT LOGIC ---
            else:
                # Send to Mistral via Requests
                answer = query_mistral(user_input)
                print(f"\nAI: {answer}\n")

        except KeyboardInterrupt:
            print("\n👋 Bye!")
            break

if __name__ == "__main__":
    start_app()