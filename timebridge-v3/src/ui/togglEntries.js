const showTogglEntries = (entries) => {
    const togglStatusText = document.getElementById('togglStatusText');
    togglStatusText.innerHTML = "<strong>Toggl Status: Logged in!</strong><br><br>";

    if (!entries || entries.length === 0) {
        togglStatusText.innerHTML += "No time entries found.";
        return;
    }

    togglStatusText.innerHTML += `
        <div style="margin-bottom: 10px;">
            <input type="checkbox" id="selectAllEntries">
            <label for="selectAllEntries"><strong>Select all entries</strong></label>
        </div>
    `;

    entries.forEach((entry, i) => {
        const description = entry.description || "No description";
        const startTime = new Date(entry.start);
        const startFormatted = startTime.toLocaleString();

        let endFormatted = "Still running...";
        if (entry.duration > 0) {
            const endTime = new Date(startTime.getTime() + entry.duration * 1000);
            endFormatted = endTime.toLocaleString();
        }

        togglStatusText.innerHTML += `
            <div style="margin-bottom: 8px;">
                <input type="checkbox" class="toggl-entry-checkbox" data-entry-index="${i}">
                <strong>${i + 1}. Entry</strong><br>
                Description: ${description}<br>
                Start: ${startFormatted}<br>
                End: ${endFormatted}
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
};

export default showTogglEntries;
