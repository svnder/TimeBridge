console.log("Background script running");
function fetchLastEntry() {
    browser.storage.local.get('togglToken').then((result) => {
        const togglToken = result.togglToken;
        if (!togglToken) {
            console.error("No Toggl token found in storage.");
            return;
        }

        fetch('https://api.track.toggl.com/api/v9/me/time_entries', {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + btoa(togglToken + ':api_token'),
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(entries => {
            if (entries.lenght > 0) {
                console.log("Last entry:", entries[0]);
            } else {
                console.log("No entries found.");
            }
        })
    })
}