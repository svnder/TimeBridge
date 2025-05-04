import { fetchUserRepos, fetchRepoIssues } from '../api/github.js';

export function setupRepoAndIssueSelection() {
    const repoSelect = document.getElementById('repoSelect');
    const issueSelect = document.getElementById('issueSelect');

    const githubToken = localStorage.getItem('githubToken');
    if (!githubToken) return;

    fetchUserRepos(githubToken)
        .then(response => {
            const repos = response.data;
            repoSelect.innerHTML = '<option value="">Vali Repo</option>';
            repos.forEach(repo => {
                const option = document.createElement('option');
                option.value = repo.full_name;
                option.textContent = repo.name;
                repoSelect.appendChild(option);
            });
        });

    repoSelect.addEventListener('change', () => {
        const selectedRepo = repoSelect.value;
        if (selectedRepo) {
            issueSelect.disabled = false;
            loadIssuesForRepo(selectedRepo, githubToken);
        } else {
            issueSelect.disabled = true;
            issueSelect.innerHTML = '<option value="">Vali kõigepealt Repo</option>';
        }
    });

    issueSelect.disabled = true;
    issueSelect.innerHTML = '<option value="">Vali kõigepealt Repo</option>';
}

function loadIssuesForRepo(repoFullName, token) {
    const issueSelect = document.getElementById('issueSelect');

    fetchRepoIssues(token, repoFullName)
        .then(response => {
            const issues = response.data;
            issueSelect.innerHTML = '<option value="">Vali Issue</option>';

            if (issues.length > 0) {
                issues.forEach(issue => {
                    const option = document.createElement('option');
                    option.value = issue.number;
                    option.textContent = `#${issue.number} - ${issue.title}`;
                    issueSelect.appendChild(option);
                });
            } else {
                const option = document.createElement('option');
                option.textContent = "Issuesid pole.";
                option.disabled = true;
                issueSelect.appendChild(option);
            }
        });
}
