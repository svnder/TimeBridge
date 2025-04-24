from flask import Flask, request, redirect, session
import requests
import os
from dotenv import load_dotenv

load_dotenv()

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
GITHUB_API_URL = 'https://api.github.com/user'


app = Flask(__name__)
app.secret_key = os.urandom(24)

@app.route('/')
def home():

    return '<a href="https://github.com/login/oauth/authorize?client_id={}&scope=repo">Logi sisse GitHubiga</a>'.format(CLIENT_ID)

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
        'code': code,
        'redirect_uri': 'http://localhost:5000/callback'
    }
    
    response = requests.post(token_url, headers=headers, data=data)
    response_data = response.json()
    print(response_data)
    
    access_token = response_data.get('access_token')
    if not access_token:
        return 'Failed to retrieve access token', 400
    
    return 'Access token: {}'.format(access_token)

def dashboard():
    access_token = session.get('access_token')
    if not access_token:
        return 'Not authenticated', 400
    
    user_url = GITHUB_API_URL
    headers = {'Authorization': f'token {access_token}'}
    response = requests.get(user_url, headers=headers)
    user_data = response.json()
    
    return f'Hello, {user_data["login"]}! Your GitHub ID is {user_data["id"]}.'
    
if __name__ == '__main__':
    app.run(debug=True, port=8000)
    print("OAuth server is running on http://localhost:5000")
    print("Please visit http://localhost:5000/callback to authenticate.")
