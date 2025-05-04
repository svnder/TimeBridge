import  togglAPI  from './api/toggl';
import  togglAUTH from './auth/togglAuth';
import githubAuth from './auth/githubAuth';

document.addEventListener('DOMContentLoaded', () => {
    console.log('📦 popup.js loadedsdsd');
    console.log("TogglAPI:", togglAPI.getTogglUser);
    console.log("TogglAUTH:", togglAUTH.togglLogin);
    console.log("GithubAUTH:", githubAuth.initGithubLogin);
    togglAUTH.togglLogin();         // Seob Toggl login nupu
    githubAuth.initGithubLogin();  // Seob GitHub login nupu
    getTogglUser();
    restoreLoginStatus();           // Näita varasemaid staatusi (kui on)
    initGithubLogin();             // Seob GitHub login nupu
    initTogglLogin();              // Seob Toggl login nupu
    setupRepoAndIssueSelection();  // Laeb repo/issue selectid
    setupCommenting();             // Seob kommenteerimisnupu
    checkBothLogins();             // Näita õiget UI osa vastavalt login staatusele
});


