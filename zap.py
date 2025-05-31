import os
import json
from flask import Flask, request
from datetime import datetime
from twilio.twiml.messaging_response import MessagingResponse

app = Flask(__name__)
LOG_FILE = 'messages.json'

def save_message(data):
    # Overwrite the JSON file with only the latest message
    with open(LOG_FILE, 'w') as f:
        json.dump([data], f, indent=4)

@app.route("/", methods=["GET"])
def home():
    return "✅ WhatsApp bot is running! Send a message to your WhatsApp sandbox number."

@app.route("/bot", methods=["POST"])
def bot():
    incoming_msg = request.values.get("Body", "").strip()
    from_number = request.values.get("From", "")
    
    print(f"Received message from {from_number}: {incoming_msg}")

    timestamp = datetime.utcnow().isoformat()
    entry = {
        "timestamp": timestamp,
        "from": from_number,
        "message": incoming_msg
    }

    # Overwrite messages.json with only the latest message
    save_message(entry)

    resp = MessagingResponse()
    if "pedido" in incoming_msg.lower():
        reply = "Você quer fazer um pedido? Me diga o que deseja."
    elif "oi" in incoming_msg.lower():
        reply = "Oi! Como posso te ajudar hoje?"
    else:
        reply = "Desculpe, não entendi. Pode repetir?"
    return str(reply)

if __name__ == "__main__":
    app.run(debug=True)
