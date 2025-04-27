from flask import Flask, request, redirect, session
import requests
import os
from dotenv import load_dotenv

load_dotenv()

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
REDIRECT_URI = 'http://localhost:5000/callback'
GITHUB_API_URL = 'https://api.github.com/user'


app = Flask(__name__)
app.secret_key = os.urandom(24)

@app.route('/')
def home():
    return '<a href="/login">Logi sisse GitHubiga</a>'

@app.route('/login')
def login():
    return redirect(f"https://github.com/login/oauth/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&scope=repo")

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
        'redirect_uri': REDIRECT_URI
    }
    
    response = requests.post(token_url, headers=headers, data=data)
    response_data = response.json()
    print(response_data)
    
    access_token = response_data.get('access_token')
    if not access_token:
        return 'Failed to retrieve access token', 400
    
    session['access_token'] = access_token
    return redirect('/dashboard')


@app.route('/dashboard')
def dashboard():
    access_token = session.get('access_token')
    if not access_token:
        return 'Not authenticated', 400
    
    user_url = GITHUB_API_URL
    headers = {'Authorization': f'token {access_token}'}
    response = requests.get(user_url, headers=headers)
    user_data = response.json()
    return '''

    <h1>Dashboard</h1>
    <p>Welcome, {}</p>
    <img src="{}" alt="User Avatar" width="100" height="100">
    <p><a href="/logout">Logout</a></p>
    '''.format(user_data['login'], user_data['id'], user_data['avatar_url'])


@app.route('/logout')
def logout():
    session.pop('access_token', None)
    return redirect('/')

if __name__ == '__main__':
    print("OAuth server is running on http://localhost:5000")
    print("Please visit http://localhost:5000/callback to authenticate.")
    app.run(debug=True, port=8000)
