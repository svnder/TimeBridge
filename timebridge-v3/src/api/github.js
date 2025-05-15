import axios from 'axios';

export async function fetchGithubUser(token) {
    return axios.get('https://api.github.com/user', {
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });
}

const fetchUserRepos = async (token) => {
    return axios.get('https://api.github.com/user/repos?sort=updated&per_page=100', {
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });
}

const fetchRepoIssues = async (token, repoFullName) => {
    return axios.get(`https://api.github.com/repos/${repoFullName}/issues`, {
        headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
            
        }
    });
};


export async function postIssueComment(token, repoFullName, issueNumber, body) {
    return axios.post(`https://api.github.com/repos/${repoFullName}/issues/${issueNumber}/comments`, {
        body: body
    }, {
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });
}

export default { fetchUserRepos, fetchRepoIssues };