import api from "../connection/connection"

export const buscaProdutos = async () => {

    const res = await api.get("/produtos").then(res => {
        if(typeof res.data != "undefined" && res.data.erro == false){
            return res.data.valor
        }

        return []
        
    })

    return res
} 

