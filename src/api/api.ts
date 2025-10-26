import axios from 'axios';


const api = axios.create({
    baseURL: 'https://backendarmazyn.azurewebsites.net'
});

export default api;