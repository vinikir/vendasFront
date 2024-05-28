import api from "../connection/connection"

export const buscaProdutos = async () => {

    const res = await api.get("/produto").then(res => {
        if(typeof res.data != "undefined" && res.data.erro == false){
            return res.data.valor
        }

        return []
        
    })

    return res
} 

