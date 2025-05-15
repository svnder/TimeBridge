

import toggl from "../api/toggl";
import togglAPI from "../api/toggl";
export let togglLoggedIn = false;
export let loadedTogglEntries = [];
export let togglToken = null;


const togglLogin = async () => {
    const loginButton = document.getElementById('togglLoginButton');
    const togglStatusText = document.getElementById('togglStatusText');

    const savedTogglStatus = localStorage.getItem('togglStatus');
    if (savedTogglStatus) {
        togglStatusText.innerHTML = savedTogglStatus;
    } else {
        togglStatusText.innerHTML = "<strong>Toggl Status: Pole sisse logitud</strong><br><br>";
    }

    try {
        const user = await togglAPI.getTogglUser();
        if (user) {
            togglLoggedIn = true;
            togglToken = user.api_token;
            loginButton.style.display = 'none';
            localStorage.setItem('loginButton', 'none');
            togglStatusText.innerHTML = `
                ✅ Oled juba sisse loginud!<br>
                <strong>${user.fullname}</strong><br>
                <img src="${user.image_url}" alt="Toggl Avatar"
                    style="width: 50px; height: 50px; border-radius: 50%;">
            `;
            localStorage.setItem('togglStatus', togglStatusText.innerHTML);
            console.log("Toggl sisselogimine õnnestus:", user.api_token);
            return true;
        }
    } catch (err) {
        console.log("Ei ole veel sisse loginud või sessioon aegunud.");
    }


    loginButton.style.display = 'block';


    loginButton.addEventListener('click', async () => {
        loginButton.style.display = 'none';
        localStorage.setItem('loginButton', 'none');
        togglStatusText.innerHTML = 'Login Togglisse...<br><br>';

        try {
            const togglPopUp = await browser.tabs.create({
                url: 'https://track.toggl.com/login',
                active: true,
            });

            if (togglPopUp) {
                loginTabId = togglPopUp.id;
                togglStatusText.innerHTML = "⏳ Ootan sisselogimist...<br><br>";
                localStorage.setItem('togglStatus', togglStatusText.innerHTML);
            }
        } catch (error) {
            console.error("Tabi avamisel tekkis viga:", error);
            togglStatusText.innerHTML = "❌ Ei saanud login-akent avada.<br><br>";
            return;
        }

        let tries = 0;
        const maxTries = 20;
        const pollLogin = setInterval(async () => {
            try {
                const user = await togglAPI.getTogglUser();
                if (user) {
                    clearInterval(pollLogin);
                    togglLoggedIn = true;
                    loginButton.style.display = 'none';
                    localStorage.setItem('loginButton', 'none');
                    togglStatusText.innerHTML = `
                        ✅ Toggl login õnnestus!<br>
                        <strong>${user.fullname}</strong><br>
                        <img src="${user.image_url}" alt=""
                            style="width: 50px; height: 50px; border-radius: 50%;">
                    `;
                    localStorage.setItem('togglStatus', togglStatusText.innerHTML);
                }
            } catch (err) {

                tries++;
                if (tries >= maxTries) {
                    clearInterval(pollLogin);
                    togglStatusText.innerHTML = "❌ Sisselogimine ei õnnestunud (timeout).<br><br>";
                    console.error("Sisselogimise timeout:", err);
                }
            }
        }, 3000);
    });
}


export default { togglLogin };