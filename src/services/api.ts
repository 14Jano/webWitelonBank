import axios from 'axios';

const api = axios.create({
    baseURL: 'https://witelonapi.host358482.xce.pl/api',
    withCredentials: true,
    headers: {
        'Content-Type': "application/json",
    },
});

export default api;