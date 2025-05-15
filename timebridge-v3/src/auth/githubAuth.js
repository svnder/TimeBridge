import { fetchGithubUser } from '../api/github.js';
import { setLoaderVisible } from '../ui/status.js';

export let githubLoggedIn = false;
export let githubToken = null;

const githubLogin = async () => {
    const loginButton = document.getElementById('githubLoginButton');
    const githubStatusText = document.getElementById('githubStatusText');
    const tokenInput = document.getElementById('githubTokenInput');

    // Kuvame salvestatud staatuse (kui olemas)
    const savedGithubStatus = localStorage.getItem('githubStatus');
    if (savedGithubStatus) {
        githubStatusText.innerHTML = savedGithubStatus;
    } else {
        githubStatusText.innerHTML = "<strong>GitHub Status: Pole sisse logitud</strong><br><br>";
    }

    // Proovime automaatselt kontrollida sisselogimist
    const stored = await browser.storage.local.get(['githubToken', 'githubStatus']);
    if (stored.githubToken && stored.githubStatus) {
        try {
            const response = await fetchGithubUser(stored.githubToken);
            const user = response.data;

            githubLoggedIn = true;
            githubToken = stored.githubToken;

            tokenInput.setAttribute('readonly', true);
            loginButton.setAttribute('disabled', true);
            githubStatusText.innerHTML = `
                ✅ Oled juba sisse loginud GitHubi!<br>
                <strong>${user.login}</strong><br>
                <img src="${user.avatar_url}" alt="GitHub Avatar" style="width: 50px; height: 50px; border-radius: 50%;">
            `;
            return true;
        } catch (err) {
            console.warn("Salvestatud GitHub token on aegunud või kehtetu.");
        }
    }

    // Kui vajutatakse login-nuppu
    loginButton.addEventListener('click', async () => {
        if (githubLoggedIn) return;

        const token = tokenInput.value.trim();
        if (!token || token.length < 40) {
            githubStatusText.textContent = "Palun sisesta kehtiv GitHub token (vähemalt 40 tähemärki).";
            return;
        }

        githubStatusText.textContent = "";
        setLoaderVisible(true);

        try {
            const response = await fetchGithubUser(token);
            const user = response.data;

            githubLoggedIn = true;
            githubToken = token;

            tokenInput.setAttribute('readonly', true);
            loginButton.setAttribute('disabled', true);
            githubStatusText.innerHTML = `
                ✅ GitHub login õnnestus!<br>
                <strong>${user.login}</strong><br>
                <img src="${user.avatar_url}" alt="GitHub Avatar" style="width: 50px; height: 50px; border-radius: 50%;">
            `;

            localStorage.setItem('githubStatus', githubStatusText.innerHTML);

            await browser.storage.local.set({
                githubToken: token,
                githubStatus: "✅ GitHub login õnnestus!",
                githubUser: user.login,
                githubUserAvatar: user.avatar_url
            });

            // checkBothLogins(); ← Lisa kui soovid kohe UI uuendada
        } catch (error) {
            githubStatusText.textContent = "⚠️ Viga GitHub loginis: " + (error?.response?.data?.message || error.message);
        } finally {
            setLoaderVisible(false);
        }
    });

    return false;
};

const getGithubToken = async () => {
    const stored = await browser.storage.local.get(['githubToken']);
    return stored.githubToken || null;
};

const isGithubLoggedIn = async () => {
    const token = await getGithubToken();
    return !!token;
};

export default { githubLogin, getGithubToken , isGithubLoggedIn };
