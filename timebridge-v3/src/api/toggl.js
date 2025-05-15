import axios from 'axios';
import togglAuth from '../auth/togglAuth.js';

const TOGGL_API_BASE = 'https://api.track.toggl.com/api/v9/me';

const getTogglUser = async () => {
    const response = await axios.get(`${TOGGL_API_BASE}`, {
        withCredentials: true,
        responseType: 'json',
    });

    return response.data;
};

const togglToken = async () => {
    const response = await axios.get(`${TOGGL_API_BASE}`, {
        withCredentials: true,
        responseType: 'json',
    });
    return response.data.api_token;
};




const fetchTogglEntries = async () => {
    const response = await axios.get(`${TOGGL_API_BASE}/time_entries`, {
        withCredentials: 'include',
        responseType: 'json',
        headers: {
            'Authorization': `Basic ${btoa(togglAuth.togglToken)}`,
            'Content-Type': 'application/json', 
        },
    });
    console.log("Toggl entries data:", response.data.length);
    console.log('Response status:', response.status);

    if (response.status === 200) {
        console.log("Toggl entries:", response.data);
        return response.data;
    } else {
        console.error("Toggl API error:", response.status, response.statusText);
        return [];
    }
}; 


export default { getTogglUser, fetchTogglEntries, togglToken };