console.log("Background script running");
browser.storage.local.get('togglToken').then((result) => {
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
        console.error('Axios error Toggl API päringul:', error);
    });
})