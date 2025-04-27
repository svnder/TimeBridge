// Polyfill Firefox vs Chrome
if (typeof browser === "undefined") {
    var browser = chrome;
}

let loginTabId = null;
let loginCheckInterval = null;
let selectRepoFullName = null;

const loginButton = document.getElementById('loginButton');
const loginButtonGithub = document.getElementById('githubLoginButton');
const checkStatusButton = document.getElementById('checkStatusButton');
const statusText = document.getElementById('statusText');
const githubStatusText = document.getElementById('githubStatusText');
const loader = document.getElementById('loader');

// Toggl login functionality
loginButton.addEventListener('click', () => {
    browser.tabs.create({ url: "https://track.toggl.com/login" }).then((tab) => {
        loginTabId = tab.id;
        loader.style.display = 'block';
        statusText.textContent = "";

        loginCheckInterval = setInterval(() => {
            checkLoginStatus(true);
        }, 3000);
    });
});

// GitHub login functionality
loginButtonGithub.addEventListener('click', () => {
    const githubToken = document.getElementById('githubTokenInput').value.trim();

    if (!githubToken) {
        githubStatusText.textContent = "❌ Palun sisesta GitHub token.";
        return;
    }

    loader.style.display = 'block';
    githubStatusText.textContent = "";

    fetch('https://api.github.com/user', {
        method: 'GET',
        headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    })
        .then(response => {
            loader.style.display = 'none';
            if (response.status === 200) {
                response.json().then(user => {
                    githubStatusText.innerHTML = `✅ GitHub login õnnestus!<br><strong>${user.login}</strong>`;
                    localStorage.setItem('githubToken', githubToken);
                    localStorage.setItem('githubUser', user.login);
                    localStorage.setItem('githubUserId', user.id);
                    localStorage.setItem('githubUserAvatar', user.avatar_url);
                    browser.storage.local.set({ githubToken: githubToken, githubUser: user.login, githubUserId: user.id, githubUserAvatar: user.avatar_url });

                    document.getElementById('githubTokenInput').style.display = 'none';
                    loginButtonGithub.style.display = 'none';
                });
            } else {
                githubStatusText.textContent = "❌ GitHub ühendus ebaõnnestus. Kontrolli tokenit või õigusi.";
            }
        })
        .catch(error => {
            loader.style.display = 'none';
            githubStatusText.textContent = "⚠️ Viga GitHub API-ga: " + error.message;
        });
});

// Kontrollib Toggl login staatust
function checkLoginStatus(autoClose) {
    fetch('https://api.track.toggl.com/api/v9/me/time_entries', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.status === 200) {
                response.json().then(entries => {
                    loader.style.display = 'none';
                    statusText.innerHTML = "<strong>Toggl Status: Oled sisse loginud!</strong><br>";

                    if (entries.length > 0) {
                        const maxEntries = Math.min(entries.length, 2);
                        for (let i = 0; i < maxEntries; i++) {
                            const entry = entries[i];
                            const description = entry.description || "Kirjeldus puudub";
                            const startTime = new Date(entry.start);
                            const startFormatted = startTime.toLocaleString();

                            let endFormatted = "Kestab veel...";
                            if (entry.duration > 0) {
                                const endTime = new Date(startTime.getTime() + (entry.duration * 1000));
                                endFormatted = endTime.toLocaleString();
                            }

                            statusText.innerHTML += `<p><strong>${i + 1}. Logi</strong><br>
                        Kirjeldus: ${description}<br>
                        Algus: ${startFormatted}<br>
                        Lõpp: ${endFormatted}</p>`;
                        }
                    } else {
                        statusText.innerHTML += "Aja logisid ei leitud.";
                    }

                    loginButton.style.display = 'none';
                    checkStatusButton.style.display = 'none';

                    if (autoClose && loginTabId !== null) {
                        browser.tabs.remove(loginTabId);
                        loginTabId = null;
                    }

                    if (loginCheckInterval) {
                        clearInterval(loginCheckInterval);
                        loginCheckInterval = null;
                    }
                });
            } else if (response.status === 401) {
                loader.style.display = 'none';
                statusText.textContent = "❌ Pole veel sisse loginud Togglisse.";
            } else {
                loader.style.display = 'none';
                statusText.textContent = "⚠️ Tundmatu viga: " + response.status;
            }
        })
        .catch(error => {
            loader.style.display = 'none';
            statusText.textContent = "⚠️ Viga Toggl API-ga: " + error.message;
        });
}
// laebib GitHub issue'de valiku

addTogglCommentButton.addEventListener('click', () => {
    const selectIssueNumber = issueSelect.value;
    const githubToken = localStorage.getItem('githubToken');

    if (!githubToken) {
        githubStatusText.textContent = "❌ Palun logi sisse GitHubi enne kommentaari lisamist.";
        return;
    }
    if (!selectIssueNumber) {
        githubStatusText.textContent = "❌ Palun vali GitHubi issue enne kommentaari lisamist.";
        return;
    }

    // 🔥 Fetchime viimase Toggl logi enne kommentaari postitamist
    fetch('https://api.track.toggl.com/api/v9/me/time_entries', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(entries => {
            if (entries.length > 0) {
                const lastEntry = entries[0];
                const description = lastEntry.description || "Kirjeldus puudub";

                const startDate = new Date(lastEntry.start);
                const dateFormatted = startDate.toLocaleDateString(); // nt 26.04.2025
                const startTimeFormatted = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // nt 14:00

                let endTimeFormatted = "Kestab veel...";
                let durationFormatted = "Kestab";

                if (lastEntry.duration > 0) {
                    const endDate = new Date(startDate.getTime() + lastEntry.duration * 1000);
                    endTimeFormatted = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // nt 15:00

                    const durationMinutesTotal = Math.floor(lastEntry.duration / 60); // sekundid → minutid
                    const durationHours = Math.floor(durationMinutesTotal / 60);
                    const durationMinutes = durationMinutesTotal % 60;

                    if (durationMinutes > 0) {
                        durationFormatted = `${durationHours} tundi ${durationMinutes} minutit`;
                    } else {
                        durationFormatted = `${durationHours} tundi`;
                    }
                }

                const commentBody = `
                🗓️ Kuupäev: ${dateFormatted}\n
                📝 Kirjeldus: ${description}\n
                🕒 Algus: ${startTimeFormatted}\n
                🕒 Lõpp: ${endTimeFormatted}\n
                ⏱️ Kestus: ${durationFormatted}
                `;



                postCommentToGithub(githubToken, selectIssueNumber, commentBody);
            } else {
                githubStatusText.textContent = "❌ Ei leitud ühtegi Toggl logi.";
            }
        })
        .catch(error => {
            githubStatusText.textContent = "⚠️ Viga Toggl API ühendamisel: " + error.message;
        });
});

function postCommentToGithub(token, issueNumber, comment) {
    const repoFullName = 'svnder/timebridge';

    fetch(`https://api.github.com/repos/${repoFullName}/issues/${issueNumber}/comments`, {
        method: 'POST',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            body: comment
        })
    })
        .then(response => {
            if (response.status === 201) {
                githubStatusText.textContent = "✅ Kommenteerimine õnnestus!";
            } else {
                githubStatusText.textContent = "❌ Kommenteerimine nurjus. Kontrolli õigusi.";
            }
        })
        .catch(error => {
            githubStatusText.textContent = "⚠️ Viga GitHub API ühendamisel: " + error.message;
        });
}



// Repositooriumide valik
const repoSelect = document.getElementById('repoSelect');
const issueSelect = document.getElementById('issueSelect');

// Fetch kasutaja repositooriumid
function fetchUserRepositories(token) {
    fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
        method: 'GET',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    })
    .then(response => response.json())
    .then(repos => {
        repoSelect.innerHTML = '<option value="">Vali Repo</option>';
        repos.forEach(repo => {
            const option = document.createElement('option');
            option.value = repo.full_name;  // nt "svnder/timebridge"
            option.textContent = repo.name; // nt "timebridge"
            repoSelect.appendChild(option);
        });
    });
}

// Kui kasutaja valib repo
repoSelect.addEventListener('change', () => {
    const selectedRepo = repoSelect.value;
    if (selectedRepo) {
        issueSelect.disabled = false;
        loadIssuesForRepo(selectedRepo);
    } else {
        issueSelect.disabled = true;
        issueSelect.innerHTML = '<option value="">Vali kõigepealt Repo</option>';
    }
});

// Lae valitud repo issues
function loadIssuesForRepo(repoFullName) {
    const githubToken = localStorage.getItem('githubToken');
    fetch(`https://api.github.com/repos/${repoFullName}/issues`, {
        method: 'GET',
        headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    })
    .then(response => response.json())
    .then(issues => {
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



// Automaatne kontroll kui leht laetakse
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus(false);
    const token = localStorage.getItem('githubToken');
    const user = localStorage.getItem('githubUser');
    const avatar = localStorage.getItem('githubUserAvatar');
    
    issueSelect.disabled = true;
    issueSelect.innerHTML = '<option value="">Vali kõigepealt Repo</option>';

    if (token && user) {
        document.getElementById('githubTokenInput').style.display = 'none';
        loginButtonGithub.style.display = 'none';

        githubStatusText.innerHTML = `✅ GitHub login õnnestus!<br><strong>${user}</strong><br>`;
        if (avatar) {
            githubStatusText.innerHTML += `<img src="${avatar}" alt="GitHub Avatar" style="width: 60px; height: 60px"><br><br>`;
        }
        fetchUserRepositories(token);
    }
});