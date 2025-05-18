import axios from 'axios';

const fetchTogglEntries = async () => {
    return axios.get('https://api.track.toggl.com/api/v9/me/time_entries', {
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    });
};

export { fetchTogglEntries };
