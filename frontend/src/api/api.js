import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000', // Replace with your backend URL
    timeout: 5000,
});

export default instance;
