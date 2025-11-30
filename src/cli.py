from .assistant import StudentAssistant


def main():
    print("🎓 Student AI Assistant (Mistral v0.2 + Hugging Face)")
    print("Type your study doubts and press Enter.")
    print("Type 'exit' to quit.\n")

    assistant = StudentAssistant()

    while True:
        user_input = input("You (Student): ").strip()

        # Exit commands
        if user_input.lower() in {"exit", "quit", "bye"}:
            print("Assistant: Bye! All the best for your studies 😊")
            break

        # Empty input
        if not user_input:
            print("Assistant: Please type a question 🙂")
            continue

        try:
            reply = assistant.answer(user_input)
            print("\nAssistant:\n", reply, "\n")
        except Exception as e:
            print("\nAssistant: Sorry, something went wrong while contacting the model.")
            print(f"(Error: {e})\n")


if __name__ == "__main__":
    main()
