import { postIssueComment } from '../api/github.js';
import { loadedTogglEntries } from '../auth/togglAuth.js';

export function setupCommenting() {
    const addButton = document.getElementById('addTogglCommentButton');
    const issueSelect = document.getElementById('issueSelect');
    const githubStatusText = document.getElementById('githubStatusText');

    addButton.addEventListener('click', () => {
        const githubToken = localStorage.getItem('githubToken');
        const selectedIssueNumber = issueSelect.value;

        if (!githubToken) {
            githubStatusText.textContent = "❌ Palun logi sisse GitHubi enne kommentaari lisamist.";
            return;
        }

        if (!selectedIssueNumber) {
            githubStatusText.textContent = "❌ Palun vali GitHubi issue enne kommentaari lisamist.";
            return;
        }

        const selectedCheckboxes = document.querySelectorAll('.toggl-entry-checkbox:checked');
        if (selectedCheckboxes.length === 0) {
            githubStatusText.textContent = "❌ Palun vali vähemalt üks Toggl sissekanne.";
            return;
        }

        let commentBody = '```tekst\n';
        let totalTime = 0;

        selectedCheckboxes.forEach(checkbox => {
            const entryIndex = parseInt(checkbox.getAttribute('data-entry-index'));
            const entry = loadedTogglEntries[entryIndex];
            if (!entry) return;

            const description = entry.description || "Kirjeldus puudub";
            const startDate = new Date(entry.start);
            const dateFormatted = startDate.toLocaleDateString();
            const startTimeFormatted = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            let endTimeFormatted = "Kestab veel...";
            let durationFormatted = "Kestab";

            if (entry.duration > 0) {
                const endDate = new Date(startDate.getTime() + entry.duration * 1000);
                endTimeFormatted = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                const durationMinutesTotal = Math.floor(entry.duration / 60);
                const durationHours = Math.floor(durationMinutesTotal / 60);
                const durationMinutes = durationMinutesTotal % 60;

                durationFormatted = durationHours > 0
                    ? `${durationHours} tundi${durationMinutes > 0 ? ` ${durationMinutes} minutit` : ''}`
                    : `${durationMinutes} minutit`;

                totalTime += entry.duration;
            }

            commentBody += `
🗓️ Kuupäev: ${dateFormatted}
📝 Kirjeldus: ${description}
🕒 Algus: ${startTimeFormatted}
🕒 Lõpp: ${endTimeFormatted}
⏱️ Kestus: ${durationFormatted}

-------------------------------
`;
        });

        if (totalTime > 0) {
            const totalHours = Math.floor(totalTime / 3600);
            const totalMinutes = Math.floor((totalTime % 3600) / 60);
            commentBody += `**Kokku: ${totalHours} tundi ${totalMinutes} minutit**\n`;
        }

        commentBody += '```';

        const repoFullName = document.getElementById('repoSelect').value;

        postIssueComment(githubToken, repoFullName, selectedIssueNumber, commentBody)
            .then(response => {
                if (response.status === 201) {
                    githubStatusText.textContent = "✅ Kommenteerimine õnnestus!";
                } else {
                    githubStatusText.textContent = "❌ Kommenteerimine nurjus. Kontrolli õigusi.";
                }
            })
            .catch(error => {
                githubStatusText.textContent = "⚠️ Viga GitHub API ühendamisel: " + error.message;
            });
    });
}
