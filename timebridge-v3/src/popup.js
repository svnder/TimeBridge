import initGithubLogin from './auth/githubAuth.js';
import checkBothLogins from './auth/checkLogins.js';
import { initTogglLogin } from './auth/togglAuth.js';
import { restoreLoginStatus } from './ui/status.js';
import setupRepoAndIssueSelection from './ui/githubRepoIssueUI.js';
import setupCommenting from './ui/comment.js';

document.addEventListener('DOMContentLoaded', () => {
    restoreLoginStatus();          // restore saved status
    checkBothLogins();             // show correct UI state
    initGithubLogin();             // bind GitHub login button
    initTogglLogin();              // bind Toggl login button
    setupRepoAndIssueSelection();  // load repo/issue selects
    setupCommenting();             // bind “add comment” button
});
