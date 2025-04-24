from flask import Flask, request, redirect
import requests
import os
from dotenv import load_dotenv

load_dotenv()

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")

app = flask(__name__)

@app.route('/')
def home():
    return "Welcome to the OAuth Server!"

@app.route('/callback')
def callback():
    code = request.args.get('code')
    if not code:
        return 'No code provided', 400
    
    token_url = 'https://github.com/login/oauth/access_token'
    headers = {'accept': 'application/json'}
    data = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'code': code
    }
    
    response = requests.post(token_url, headers=headers, data=data)
    response_data = response.json()
    
    access_token = response_data.get('access_token')
    if not access_token:
        return 'Failed to retrieve access token', 400
if __name__ == '__main__':
    app.run(debug=True, port=5000)
    print("OAuth server is running on http://localhost:5000")
    print("Please visit http://localhost:5000/callback to authenticate.")
