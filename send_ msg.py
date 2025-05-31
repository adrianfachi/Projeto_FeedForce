import os
from twilio.rest import Client

# Load credentials from env vars
account_sid = os.getenv('TWILIO_ACCOUNT_SID')
auth_token = os.getenv('TWILIO_AUTH_TOKEN')

client = Client(account_sid, auth_token)

message = client.messages.create(
    from_='whatsapp:+14155238886',    # Twilio Sandbox WhatsApp number
    to='whatsapp:+555191732286',        # Your WhatsApp number with country code
    body='Hello! This is a proactive message from your Python bot.'
)

print(f"Message sent with SID: {message.sid}")
