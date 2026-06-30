import axios from 'axios'
const API_URL = import.meta.env.VITE_BACKEND_URL;
const axiosClient = axios.create({
    baseURL:API_URL,
    withCredentials:true,//tell browser to cookie ko attach kar dena 
    headers:{
        'Content-Type' : 'application/json'
    }
})
export default axiosClient;