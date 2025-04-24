import os
import requests
from dotenv import load_dotenv

load_dotenv()

TOGGL_API_KEY = os.getenv("TOGGL_API_TOKEN")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_REPO = os.getenv("GITHUB_REPO")

def get_last_time_entry():
    url = 'https://api.track.toggl.com/api/v9/me/time_entries'
    res = requests.get(url, auth=(TOGGL_API_KEY, 'api_token'))
    res.raise_for_status()
    entries = res.json()
    return entries[0] if entries else None

    #Creates a new issue in the specified GitHub repository with the time entry details.
def create_github_issue(title, body):
    url = f'https://api.github.com/repos/{GITHUB_REPO}/issues'
    headers = {
        'Authorization': f'token {GITHUB_TOKEN}',
        'Accept': 'application/vnd.github.v3+json'
    }
    data = {
        'title': title,
        'body': body,
        'labels': ['time-entry']
    }
    res = requests.post(url, headers=headers, json=data)
    res.raise_for_status()
    issue = res.json()
    print(f"Issue created: {issue['html_url']}")

    #formats the time entry details into a string for posting to GitHub.
def format_entry(entry):
    description = entry['description'] if entry['description'] else "No description"
    duration = entry['duration'] if entry['duration'] else 0
    
    message = f"""
    **Time Entry Details:** {entry['description']}
    **Duration:** {duration / 60} minutes
    """
    return message

    # Posts the time entry details to a GitHub issue in the specified repository.
def post_to_github(issue_number, message):
    url = f'https://api.github.com/repos/{GITHUB_REPO}/issues'
    headers = {
        'Authorization': f'token {GITHUB_TOKEN}',
        'Accept': 'application/vnd.github.v3+json'
    }
    data = {'body': message}
    res = requests.post(url, headers=headers, json=data)
    res.raise_for_status()
    print("Comment posted to GitHub issue. Issue number:", issue_number)

if __name__ == "__main__":
    print("Fetching last time entry...")
    entry = get_last_time_entry()
    
    
    if entry:
        message = format_entry(entry)
        print("Posting to GitHub...")
        
        issue_number = entry.get('issue_number')
        
        if not issue_number:
            issue_title = 'Toggle aja log time'
            issue_body = 'Kulunud aja logi kuvamine'
            issue_number = create_github_issue(issue_title, issue_body)
            
        post_to_github(issue_number, message)
    else:
        print("No time entries found.")