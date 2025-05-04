export function setLoaderVisible(visible) {
    const loader = document.getElementById('loader');
    if (!loader) return;
    loader.classList.toggle('hidden', !visible);
}

export function restoreLoginStatus() {
    const githubStatusText = document.getElementById('githubStatusText');
    const togglStatusText = document.getElementById('togglStatusText');

    const githubStatus = localStorage.getItem('githubStatus');
    const togglStatus = localStorage.getItem('togglStatus');

    if (githubStatus && githubStatusText) {
        githubStatusText.innerHTML = githubStatus;
    }

    if (togglStatus && togglStatusText) {
        togglStatusText.textContent = togglStatus;
    }
}
