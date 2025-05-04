

import { toggl } from "../api/toggl.js"

export  function showTogglEntries(entries) {
    console.log("Toggl entries:", entries);
    const togglStatusText = document.getElementById('togglStatusText');
    togglStatusText.innerHTML = "<strong>Toggl Status: Oled sisse loginud!</strong><br><br>";

    const githubLoggedIn = !!localStorage.getItem('githubToken');
    console.log(toggl.fetchTogglEntries)

    // Kui pole logisid või GitHubi login puudub, näita hoiatust
    if (!entries || entries.length === 0 || !githubLoggedIn) {
        togglStatusText.innerHTML += "⚠️ Logi järgmisena GitHubi sisse!";
        localStorage.setItem('togglStatusText', togglStatusText.innerHTML);
        return;
    }
    console.log("Toggl logid leitud:", entries.length);

    togglStatusText.innerHTML += `
        <div style="margin-bottom: 10px;">
            <input type="checkbox" id="selectAllEntries">
            <label for="selectAllEntries"><strong>Vali kõik sissekanded</strong></label>
        </div>
    `;

    entries.forEach((entry, i) => {
        const description = entry.description || "Kirjeldus puudub";
        const startTime = new Date(entry.start);
        const startFormatted = startTime.toLocaleString();
        let endFormatted = "Kestab veel...";
        if (entry.duration > 0) {
            const endTime = new Date(startTime.getTime() + (entry.duration * 1000));
            endFormatted = endTime.toLocaleString();
        }

        togglStatusText.innerHTML += `
            <div style="margin-bottom: 8px;">
                <input type="checkbox" class="toggl-entry-checkbox" data-entry-index="${i}">
                <strong>${i + 1}. Logi</strong><br>
                Kirjeldus: ${description}<br>
                Algus: ${startFormatted}<br>
                Lõpp: ${endFormatted}
            </div>
        `;
    });

    const selectAllCheckbox = document.getElementById('selectAllEntries');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            const allCheckboxes = document.querySelectorAll('.toggl-entry-checkbox');
            allCheckboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
            });
        });
    }
}
