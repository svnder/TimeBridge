import  fetchTogglEntries  from "../api/toggl.js";

function showTogglEntries(entries) {
    // Get the element where status should be displayed
    const togglStatusText = document.getElementById('togglStatusText');
    if (!togglStatusText) {
        console.error("Element with ID 'togglStatusText' not found!");
        return;
    }
    
    // Set basic status
    togglStatusText.innerHTML = "<strong>Toggl Status: Oled sisse loginud!</strong><br><br>";
    
    // Check if GitHub is logged in
    const githubLoggedIn = !!localStorage.getItem('githubToken');
    
    // If no entries or not logged into GitHub
    if (!entries || entries.length === 0 || !githubLoggedIn) {
        togglStatusText.innerHTML += "⚠️ Logi järgmisena GitHubi sisse!";
        localStorage.setItem('togglStatusText', togglStatusText.innerHTML);
        return;
    }
    
    // Add select all checkbox
    togglStatusText.innerHTML += `
        <div style="margin-bottom: 10px;">
            <input type="checkbox" id="selectAllEntries">
            <label for="selectAllEntries"><strong>Vali kõik sissekanded</strong></label>
        </div>
    `;
    
    // Add entry for each Toggl time entry
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
    
    // Setup select all functionality after DOM is updated
    setTimeout(() => {
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
    }, 100);
    
    // Save status to localStorage
    localStorage.setItem('togglStatusText', togglStatusText.innerHTML);
}

async function loadTogglEntries() {
    // Get status element
    const togglStatusText = document.getElementById("togglStatusText");
    if (!togglStatusText) {
        console.error("Element with ID 'togglStatusText' not found!");
        return;
    }
    
    // Show loading message
    togglStatusText.innerHTML = "<strong>Laen Toggl logisid...</strong><br><br>";
    
    // Calculate date range (last 7 days)
    const end = new Date().toISOString();
    const start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    
    try {
        // Call the API function with date parameters
        const entries = await fetchTogglEntries(start, end);
        console.log("Loaded Toggl entries:", entries);
        
        // Display entries in UI
        showTogglEntries(entries);
    } catch (err) {
        console.error("Toggl logide laadimine ebaõnnestus:", err);
        togglStatusText.innerHTML = "❌ Viga Toggl andmete laadimisel: " + err.message;
    }
}

export default { showTogglEntries, loadTogglEntries };