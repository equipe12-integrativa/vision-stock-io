import axios from 'axios';


const api = axios.create({
    baseURL: 'http://localhost:2002'
});

export default api;