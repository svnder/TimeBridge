import axios from 'axios';

console.log("⏳ Background service worker running");

chrome.storage.local.get('togglToken', (result) => {
    const togglToken = result.togglToken;

    if (!togglToken) {
        console.log('Toggl token puudub');
        return;
    }

    axios.get('https://api.track.toggl.com/api/v9/me/time_entries', {
        headers: {
            'Authorization': 'Basic ' + btoa(togglToken + ':api_token'),
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            const entries = response.data;
            if (entries.length > 0) {
                console.log('Viimane ajalogi:', entries[0]);
            } else {
                console.log('Aja logisid ei leitud');
            }
        })
        .catch(error => {
            if (error.response) {
                console.log('Viga api vastuses', error.response.status, error.response.data);
            } else {
                console.log('Viga api päringus', error.message);
            }
        });
});
