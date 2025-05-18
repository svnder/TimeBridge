import { fetchGithubUser } from '../api/github.js';
import { setLoaderVisible } from '../ui/status.js';

let githubLoggedIn = false;

const isGithubLoggedIn = () => {
    return !!localStorage.getItem('githubToken');
}

const initGithubLogin = () => {
    const githubTokenInput = document.getElementById('githubTokenInput');
    const loginButtonGithub = document.getElementById('githubLoginButton');
    const githubStatusText = document.getElementById('githubStatusText');

    loginButtonGithub.addEventListener('click', () => {
        if (githubLoggedIn) return;

        const githubToken = githubTokenInput.value.trim();

        if (!githubToken || githubToken.length < 40) {
            githubStatusText.textContent = "Please provide a valid GitHub token (at least 40 characters).";
            return;
        }

        githubStatusText.textContent = "";
        setLoaderVisible(true);

        fetchGithubUser(githubToken)
            .then(response => {
                const user = response.data;
                githubLoggedIn = true;

                githubTokenInput.setAttribute('readonly', true);
                loginButtonGithub.setAttribute('disabled', true);

                githubStatusText.innerHTML = `
                    GitHub login successful!<br><strong>${user.login}</strong>
                    <br><img src="${user.avatar_url}" alt="GitHub Avatar" style="width: 50px; height: 50px; border-radius: 50%;">
                `;

                localStorage.setItem('githubToken', githubToken);
                localStorage.setItem('githubStatus', githubStatusText.innerHTML);

                browser.storage.local.set({
                    githubToken,
                    githubUser: user.login,
                    githubUserId: user.id,
                    githubUserAvatar: user.avatar_url,
                    githubStatus: "✅ GitHub login successful!"
                });

                checkBothLogins();
            })
            .catch(error => {
                githubStatusText.textContent = "⚠️ GitHub API error: " + error.message;
            })
            .finally(() => {
                setLoaderVisible(false);
            });
    });
};

const checkBothLogins = () => {
    const githubToken = localStorage.getItem('githubToken');
    const togglStatus = localStorage.getItem('togglStatus');

    const loginContainer = document.getElementById('loginContainer');
    const popupContent = document.getElementById('popupContent');
    const bottomButtons = document.getElementById('bottomButtons');
    const leftSide = document.getElementById('leftSide');
    const rightSide = document.getElementById('rightSide');

    const bothLoggedIn = githubToken && togglStatus && togglStatus.includes("õnnestus");

    loginContainer.classList.toggle('hidden', bothLoggedIn);
    popupContent.classList.toggle('hidden', !bothLoggedIn);
    bottomButtons.classList.toggle('hidden', !bothLoggedIn);
    leftSide.classList.toggle('hidden', !bothLoggedIn);
    rightSide.classList.toggle('hidden', !bothLoggedIn);
};

export default initGithubLogin;
export { checkBothLogins, isGithubLoggedIn };