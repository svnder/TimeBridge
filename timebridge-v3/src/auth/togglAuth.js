import { fetchTogglEntries } from '../api/toggl.js';
import { checkBothLogins } from './githubAuth.js';
import showTogglEntries from '../ui/togglEntries.js';
import { setLoaderVisible } from '../ui/status.js';

let loginTabId = null;
let loginCheckInterval = null;

let togglLoggedIn = false;


let loadedTogglEntries = [];

const isTogglLoggedIn = () => {
    const status = localStorage.getItem('togglStatus');
    return status && status.startsWith('✅');
}

const initTogglLogin = () => {
    const loginButton = document.getElementById('togglLoginButton');
    const togglStatusText = document.getElementById('togglStatusText');

    loginButton.addEventListener('click', () => {
        browser.tabs.create({ url: "https://track.toggl.com/login" }).then((tab) => {
            loginTabId = tab.id;
            togglStatusText.textContent = "Logging in to Toggl...";
            loginCheckInterval = setInterval(() => {
                checkTogglLogin(true);
            }, 3000);
        });
    });
};

const checkTogglLogin = (autoClose = false) => {
    const togglStatusText = document.getElementById('togglStatusText');
    setLoaderVisible(true);

    fetchTogglEntries()
        .then(response => {
            if (response.status === 200) {
                togglLoggedIn = true;
                loadedTogglEntries = response.data;

                localStorage.setItem('togglStatus', "✅ Toggl login successful!");
                setLoaderVisible(false);
                showTogglEntries(loadedTogglEntries);

                if (autoClose && loginTabId !== null) {
                    browser.tabs.remove(loginTabId);
                    loginTabId = null;
                }
                if (loginCheckInterval) {
                    clearInterval(loginCheckInterval);
                    loginCheckInterval = null;
                }

                checkBothLogins();
            } else if (response.status === 401) {
                togglStatusText.textContent = "❌ Not logged in to Toggl yet.";
            } else {
                togglStatusText.textContent = "⚠️ Unknown error: " + response.status;
            }
        })
        .catch(error => {
            setLoaderVisible(false);
            togglStatusText.textContent = "⚠️ Toggl API error: " + error.message;
        });
};
export {
    initTogglLogin, checkTogglLogin, isTogglLoggedIn,
    togglLoggedIn, loadedTogglEntries
};
