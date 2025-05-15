import GITAPI from '../api/github';

const loadRepos = async (token) => {
    const result = await browser.storage.local.get(['githubToken']);
    token = result.githubToken;
    if (!token) {
        console.error("GitHub token not found in storage.");
        return;
    }
    const repoSelect = document.getElementById('repoSelect');

    const response = await GITAPI.fetchUserRepos(token);
    const repos = response.data;

    repoSelect.innerHTML = '<option value="">Vali Repositoorium</option>';
    console.log("Valitud väärtus:", repoSelect.value);

    repos.forEach(repo => {
        const option = document.createElement('option');
        option.value = repo.full_name;
        option.textContent = repo.name;
        console.log("Valitud väärtus:", repoSelect.value);
        repoSelect.appendChild(option);
    });
    repoSelect.addEventListener('change', async (event) => {
        const selectedRepo = event.target.value;
        console.log("Valitud repositoorium:", selectedRepo);
        if (selectedRepo) {
            await loadIssues(token, selectedRepo);
        }
    });
    repoSelect.value = ""; // Reset the selected value
    console.log("Valitud väärtus:", repoSelect.value);
};

const loadIssues = async (token, repoFullName) => {
    const response = await GITAPI.fetchRepoIssues(token, repoFullName);
    repoFullName = repoFullName;
    const issues = response.data;

    const issueSelect = document.getElementById('issueSelect');
    issueSelect.innerHTML = '<option value="">Vali Probleem</option>';

    issues.forEach(issue => {
        const option = document.createElement('option');
        option.value = issue.number;
        option.textContent = issue.title;
        issueSelect.appendChild(option);
    });
}

export default { loadRepos, loadIssues };
