import axios from 'axios'

const api = axios.create({
   
    //baseURL:"http://18.222.164.74/",
    baseURL:"http://127.0.0.1:3300/",
  
    timeout: 30000,
    headers: {
        'Content-Type':'application/json; charset=utf-8',
    }

})


export default api