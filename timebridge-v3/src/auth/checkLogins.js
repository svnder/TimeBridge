import togglAuth from './togglAuth.js';
import githubAuth from './githubAuth.js';

const checkBothLogins = async () => {
    const loginContainer = document.getElementById('loginContainer');

    const githubTokenInput = document.getElementById('githubTokenInput');
    const tokenGuide = document.getElementById('tokenGuide');
    const githubLoginButton = document.getElementById('githubLoginButton');

    const leftSide = document.getElementById('leftSide');
    const rightSide = document.getElementById('rightSide');
    const bottomButtons = document.getElementById('bottomButtons');

    const togglLoggedIn = await togglAuth.togglLogin();
    const githubLoggedIn = await githubAuth.githubLogin();

    console.log("Toggl login:", togglLoggedIn);
    console.log("GitHub login:", githubLoggedIn);

    if (githubLoggedIn) {
        githubTokenInput.style.display = 'none';
        localStorage.setItem('githubTokenInput', 'none');
        tokenGuide.style.display = 'none';
        localStorage.setItem('tokenGuide', 'none');
        githubLoginButton.style.display = 'none';
        localStorage.setItem('githubLoginButton', 'none');
    }

    if (togglLoggedIn && githubLoggedIn) {
        loginContainer.style.display = 'none';
        leftSide.style.display = 'block';
        rightSide.style.display = 'block';
        bottomButtons.style.display = 'block';
    } else {
        loginContainer.classList.remove('hidden');
        leftSide.style.display = 'none';
        rightSide.style.display = 'none';
        bottomButtons.style.display = 'none';
    }
};

export default { checkBothLogins };