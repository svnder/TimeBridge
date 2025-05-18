import { postIssueComment } from '../api/github.js';
import { loadedTogglEntries } from '../auth/togglAuth.js';

const setupCommenting = () => {
    const addButton = document.getElementById('addTogglCommentButton');
    const issueSelect = document.getElementById('issueSelect');
    const githubStatusText = document.getElementById('githubStatusText');

    addButton.addEventListener('click', () => {
        const githubToken = localStorage.getItem('githubToken');
        const selectedIssueNumber = issueSelect.value;

        if (!githubToken) {
            githubStatusText.textContent = "❌ Please log in to GitHub before adding a comment.";
            return;
        }

        if (!selectedIssueNumber) {
            githubStatusText.textContent = "❌ Please select a GitHub issue.";
            return;
        }

        const selectedCheckboxes = document.querySelectorAll('.toggl-entry-checkbox:checked');
        if (selectedCheckboxes.length === 0) {
            githubStatusText.textContent = "❌ Please select at least one Toggl entry.";
            return;
        }

        let commentBody = '```text\n';
        let totalTime = 0;

        selectedCheckboxes.forEach(checkbox => {
            const entryIndex = parseInt(checkbox.getAttribute('data-entry-index'));
            const entry = loadedTogglEntries[entryIndex];
            if (!entry) return;

            const description = entry.description || "No description";
            const startDate = new Date(entry.start);
            const dateFormatted = startDate.toLocaleDateString();
            const startTimeFormatted = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            let endTimeFormatted = "Still running...";
            let durationFormatted = "Running";

            if (entry.duration > 0) {
                const endDate = new Date(startDate.getTime() + entry.duration * 1000);
                endTimeFormatted = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                const durationMinutesTotal = Math.floor(entry.duration / 60);
                const durationHours = Math.floor(durationMinutesTotal / 60);
                const durationMinutes = durationMinutesTotal % 60;

                durationFormatted = durationHours > 0
                    ? `${durationHours} hours${durationMinutes > 0 ? ` ${durationMinutes} minutes` : ''}`
                    : `${durationMinutes} minutes`;

                totalTime += entry.duration;
            }

            commentBody += `
🗓️ Date: ${dateFormatted}
📝 Description: ${description}
🕒 Start: ${startTimeFormatted}
🕒 End: ${endTimeFormatted}
⏱️ Duration: ${durationFormatted}

-------------------------------
`;
        });

        if (totalTime > 0) {
            const totalHours = Math.floor(totalTime / 3600);
            const totalMinutes = Math.floor((totalTime % 3600) / 60);
            commentBody += `**Total: ${totalHours} hours ${totalMinutes} minutes**\n`;
        }

        commentBody += '```';

        const repoFullName = document.getElementById('repoSelect').value;

        postIssueComment(githubToken, repoFullName, selectedIssueNumber, commentBody)
            .then(response => {
                if (response.status === 201) {
                    githubStatusText.textContent = "✅ Comment added successfully!";
                } else {
                    githubStatusText.textContent = "❌ Comment failed. Check your GitHub permissions.";
                }
            })
            .catch(error => {
                githubStatusText.textContent = "⚠️ GitHub API error: " + error.message;
            });
    });
};

export default setupCommenting;
