import togglAPI from './api/toggl';
import togglAUTH from './auth/togglAuth';
import githubAuth from './auth/githubAuth';
import checkLogins from './auth/checkLogins';
import githubRepoIssueUI from './ui/githubRepoIssueUI';
import togglEntries from './ui/togglEntries';
import toggl from './api/toggl';




document.addEventListener('DOMContentLoaded', () => {
    console.log('Toggl API:', togglAPI.fetchTogglEntries);
    console.log('togglEntriesTESTING:', togglEntries.testEntries);
    console.log('tooglAPI:', togglAPI.togglToken);
    console.log('tgfgafdgfa', togglEntries.getEntries)
    togglEntries.loadTogglEntries();
    togglEntries.showTogglEntries();
    togglAPI.getTogglUser();
    togglAPI.fetchTogglEntries();
    githubRepoIssueUI.loadRepos();
    githubRepoIssueUI.loadIssues();
    togglEntries.showTogglEntries();
    togglAUTH.togglLogin();
    githubAuth.githubLogin();
    checkLogins.checkBothLogins();
    console.log("Toggl entries LÄBI POPUPI:", togglEntries.showTogglEntries);
    togglEntries.showTogglEntries();
});


