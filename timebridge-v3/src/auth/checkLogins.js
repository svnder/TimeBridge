import { isTogglLoggedIn } from './togglAuth.js';
import { isGithubLoggedIn } from './githubAuth.js';

const checkBothLogins = async () => {
    const loginContainer = document.getElementById('loginContainer');
    const githubTokenInput = document.getElementById('githubTokenInput');
    const tokenGuide = document.getElementById('tokenGuide');
    const githubLoginButton = document.getElementById('githubLoginButton');
    const leftSide = document.getElementById('leftSide');
    const rightSide = document.getElementById('rightSide');
    const bottomButtons = document.getElementById('bottomButtons');

    const togglLoggedIn = isTogglLoggedIn();
    const githubLoggedIn = isGithubLoggedIn();

    console.log("Toggl login:", togglLoggedIn);
    console.log("GitHub login:", githubLoggedIn);

    const bothLoggedIn = togglLoggedIn && githubLoggedIn;
    console.log("Both logged in:", bothLoggedIn);
    loginContainer.classList.add('hidden', bothLoggedIn);
    loginContainer.style.display = bothLoggedIn ? 'none' : 'block';

    githubTokenInput.classList.toggle('hidden', bothLoggedIn);
    tokenGuide.classList.toggle('hidden', bothLoggedIn);
    githubLoginButton.classList.toggle('hidden', bothLoggedIn);
    leftSide.classList.toggle('hidden', !bothLoggedIn);
    rightSide.classList.toggle('hidden', !bothLoggedIn);
    bottomButtons.classList.toggle('hidden', !bothLoggedIn);
    if (bothLoggedIn) {
        console.log("Both logins successful");
    } else {
        console.log("One or both logins failed");
    }
};

export default checkBothLogins;
