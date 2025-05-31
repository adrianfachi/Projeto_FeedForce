import os
from flask import Flask, request
from twilio.twiml.messaging_response import MessagingResponse
from twilio.rest import Client

app = Flask(__name__)

# Get your Twilio credentials from environment variables
account_sid = os.getenv('TAC51ef73732fc61fe62e0f3e5a4bffd689')
auth_token = os.getenv('04590fb8cfec0dcce59a4851dd11c3bb')

# Initialize Twilio client (for sending messages proactively if needed)
client = Client(account_sid, auth_token)

@app.route("/bot", methods=["POST"])
def bot():
    incoming_msg = request.values.get("Body", "").strip().lower()
    resp = MessagingResponse()
    msg = resp.message()

    if incoming_msg == 'menu':
        response_text = show_menu()
    elif incoming_msg == '1':
        response_text = get_info()
    elif incoming_msg == '2':
        response_text = run_analysis()
    elif incoming_msg == '3':
        response_text = goodbye()
    else:
        response_text = "Please type 'menu' to see options."

    msg.body(response_text)
    return str(resp)

def show_menu():
    return (
        "Welcome! Please choose an option:\n"
        "1. Get Info\n"
        "2. Run Analysis\n"
        "3. Exit"
    )

def get_info():
    # Your real info logic here
    return "Here is the info you requested."

def run_analysis():
    # Your real analysis code here
    return "Analysis complete successfully."

def goodbye():
    return "Goodbye! Have a great day."

# Example function for sending proactive message (not used in webhook)
def send_proactive_message(to_whatsapp_number, message_body):
    message = client.messages.create(
        from_='whatsapp:+14155238886',
        to=to_whatsapp_number,
        body=message_body
    )
    return message.sid

if __name__ == "__main__":
    app.run(debug=True)
