import axios from 'axios'

const api = axios.create({
   
    baseURL:"https://vendasbackcentral-production.up.railway.app/",
    //baseURL:"http://127.0.0.1:3300/",
  
    timeout: 30000,
    headers: {
        'Content-Type':'application/json; charset=utf-8',
    }

})


export default api