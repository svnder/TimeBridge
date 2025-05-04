import axios from 'axios';

const TOGGL_API_BASE = 'https://api.track.toggl.com/api/v9/me';

const getTogglUser = async () => {
    const response = await axios.get(`${TOGGL_API_BASE}`, {
        withCredentials: true,
        responseType: 'json',
    });
    console.log("Toggl user data:", response.data.fullname);
    return response.data;
}


const fetchTogglEntries = async () => {

}


export default { getTogglUser };

