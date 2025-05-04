export function checkBothLogins() {
    const githubToken = localStorage.getItem('githubToken');
    const githubStatus = localStorage.getItem('githubStatus');
    const togglStatus = localStorage.getItem('togglStatus');

    const loginContainer = document.getElementById('loginContainer');
    const popupContent = document.getElementById('popupContent');
    const bottomButtons = document.getElementById('bottomButtons');
    const leftSide = document.getElementById('leftSide');
    const rightSide = document.getElementById('rightSide');

    const githubLoggedIn = githubToken && githubStatus;
    const togglLoggedIn = togglStatus;

    if (githubLoggedIn && togglLoggedIn) {
        loginContainer.style.display = "none";
        popupContent.classList.remove('hidden');
        bottomButtons.classList.remove('hidden');
        leftSide.classList.remove('hidden');
        rightSide.classList.remove('hidden');
    } else {
        loginContainer.classList.remove('hidden');
        popupContent.classList.add('hidden');
        bottomButtons.classList.add('hidden');
        leftSide.classList.add('hidden');
        rightSide.classList.add('hidden');
    }
}

