from flask import Flask, render_template, request, session, redirect, url_for
import re

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # change for production

from flask_cors import CORS
CORS(app)

# Disaster Q&A knowledge base (question keywords and their answers)
knowledge_base = {
    "disaster management": "Disaster management is the process of preparing for, responding to, and recovering from disasters to minimize their impact.",
    "flood": "Move to higher ground immediately. Avoid walking or driving through floodwaters. Follow official instructions.",
    "earthquake": "Drop to the ground, take cover under any sturdy furniture, and hold on until shaking stops. Stay away from windows.",
    "fire": "Evacuate the building immediately using stairs. Do not use elevators. Call emergency services.",
    "cyclone": "Secure your home, keep emergency supplies ready, and follow evacuation orders when issued.",
    "emergency number": "In India, dial 112 for any emergency services like police, ambulance, or fire."
}

fallback_message = "Sorry, this is a Disaster Management platform. Please ask questions related to disaster preparedness or response."

# Preprocess user input for matching
def preprocess(text):
    return text.lower()

# Match user input keywords to knowledge base
def get_bot_response(user_input):
    user_input_processed = preprocess(user_input)
    for keyword, answer in knowledge_base.items():
        if re.search(r'\b' + re.escape(keyword) + r'\b', user_input_processed):
            return f"{answer} (Information source: Disaster Management FAQs)"
    return fallback_message

@app.route('/', methods=['GET', 'POST'])
def home():
    if 'conversation' not in session:
        session['conversation'] = []
    conversation = session['conversation']

    if request.method == 'POST':
        user_input = request.form.get('user_input', '').strip()
        if user_input:
            bot_reply = get_bot_response(user_input)
            conversation.append((user_input, bot_reply))
            session['conversation'] = conversation
        return redirect(url_for('home'))

    return render_template('index.html', conversation=conversation)

if __name__ == '__main__':
    app.run(debug=True)
