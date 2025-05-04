import { fetchGithubUser } from '../api/github.js';
import { fetchUserRepos } from '../api/github.js'; // Kui vaja
import { setLoaderVisible } from '../ui/status.js';
import { checkBothLogins } from '../auth/checkLogins.js';

export let githubLoggedIn = false;

const initGithubLogin = () => {
    const githubTokenInput = document.getElementById('githubTokenInput');
    const loginButtonGithub = document.getElementById('githubLoginButton');
    const githubStatusText = document.getElementById('githubStatusText');

    loginButtonGithub.addEventListener('click', async () => {
        console.log("GitHub login nupp vajutatud");
        if (githubLoggedIn) return;

        const githubToken = githubTokenInput.value.trim();

        if (!githubToken || githubToken.length < 40) {
            githubStatusText.textContent = "Palun kontrolli GitHubi tokenit. See peab olema vähemalt 40 tähemärki pikk.";
            return;
        }

        githubStatusText.textContent = "";
        setLoaderVisible(true);

        try {
            const response = await fetchGithubUser(githubToken);
            const user = response.data;
            githubLoggedIn = true;

            githubTokenInput.setAttribute('readonly', true);
            loginButtonGithub.setAttribute('disabled', true);

            githubStatusText.innerHTML = `GitHub login õnnestus!<br><strong>${user.login}</strong>`;
            githubStatusText.innerHTML += `<br><img src="${user.avatar_url}" alt="GitHub Avatar" style="width: 50px; height: 50px; border-radius: 50%;">`;

            // Salvestame info
            localStorage.setItem('githubToken', githubToken);
            localStorage.setItem('githubStatus', githubStatusText.innerHTML);

            await browser.storage.local.set({
                githubToken: githubToken,
                githubUser: user.login,
                githubUserId: user.id,
                githubUserAvatar: user.avatar_url,
                githubStatus: "✅ GitHub login õnnestus!"
            });

            checkBothLogins(); // Kontrolli, kas mõlemad loginid tehtud
        } catch (error) {
            console.error("GitHub login error:", error);
            githubStatusText.textContent = "⚠️ Viga GitHub API-ga: " + (error?.response?.data?.message || error.message);
        } finally {
            setLoaderVisible(false);
        }
    });
}

export default { initGithubLogin };