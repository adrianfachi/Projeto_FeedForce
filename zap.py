import json
from datetime import datetime

LOG_FILE = "messages.json"

def save_message(message):
    
    data = [{
        "timestamp": datetime.utcnow().isoformat(),
        "message": message
    }]


    with open(LOG_FILE, "w") as f:
        json.dump(data, f, indent=4)

def main():
    print("Type your message. Type 'exit' to quit.")
    while True:
        user_input = input(">> ").strip()
        if user_input.lower() == 'exit':
            print("Goodbye!")
            break
        save_message(user_input)
        print("Message saved and previous messages erased.")

if __name__ == "__main__":
    main()
