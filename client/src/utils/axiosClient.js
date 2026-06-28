import axios from 'axios'

const axiosClient = axios.create({
    baseURL:'http://localhost:5000',
    withCredentials:true,//tell browser to cookie ko attach kar dena 
    headers:{
        'Content-Type' : 'application/json'
    }
})
export default axiosClient;