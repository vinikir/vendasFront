import axios from 'axios'
import env from "react-dotenv";

const api = axios.create({
   
    baseURL: env.REACT_APP_API_URL,
  
    timeout: 30000,
    headers: {
        'Content-Type':'application/json; charset=utf-8',
    }

})


export default api