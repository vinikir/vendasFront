import api from "../connection/connection"

export const buscaProdutos = async () => {

    const res = await api.get("/produtos").then(res => {
        if(typeof res.data != "undefined" && res.data.erro === false){
            return res.data.valor
        }

        return []
        
    })

    return res
} 

export const buscaFluxo = async () => {

    const res = await api.get("/caixa").then(res => {
        if(typeof res.data != "undefined" && res.data.erro === false){
            return res.data.valor
        }

        return []
        
    })

    return res
} 

export const buscaVendas = async () => {
    const res = await api.get("/venda").then(res => {
        
        if(typeof res.data != "undefined" && res.data.erro === false){
            return res.data.valor
        }

        return []
        
    })

    return res
}

