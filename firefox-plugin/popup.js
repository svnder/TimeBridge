// Polyfill Firefox vs Chrome
if (typeof browser === "undefined") {
    var browser = chrome;
}

let loginTabId = null;
let loginCheckInterval = null;

const loginButton = document.getElementById('loginButton');
const checkStatusButton = document.getElementById('checkStatusButton');
const statusText = document.getElementById('statusText');
const loader = document.getElementById('loader');

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

checkStatusButton.addEventListener('click', () => {
    loader.style.display = 'block';
    checkLoginStatus(false);
});

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
                statusText.innerHTML = "<strong>Oled sisse loginud!</strong><br>";

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
            statusText.textContent = "❌ Pole veel sisse loginud. Palun logi sisse.";
        } else {
            loader.style.display = 'none';
            statusText.textContent = "⚠️ Tundmatu viga: " + response.status;
        }
    })
    .catch(error => {
        loader.style.display = 'none';
        statusText.textContent = "⚠️ Viga ühendamisel: " + error.message;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus(false);
});
