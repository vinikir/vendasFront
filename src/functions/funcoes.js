import api from "../connection/connection"

export const buscaProdutos = async () => {

    const res = await api.get("/produtos?limit=9999").then(res => {
        if (typeof res.data != "undefined" && res.data.erro === false) {
            return res.data.valor
        }

        return []

    })

    return res
}



export const buscaFluxo = async () => {

    const res = await api.get(`/caixa`).then(res => {
        if (typeof res.data != "undefined" && res.data.erro === false) {

            return res.data.valor
        }

        return []

    })

    return res
}

export const buscaVendas = async (dataInicial, dataFinal) => {
    const res = await api.get(`/venda?inicial=${dataInicial}&final=${dataFinal}`).then(res => {

        if (typeof res.data != "undefined" && res.data.erro === false) {
            return res.data.valor
        }

        return []

    })

    return res
}

export const mascaraMoentaria = (val) => {

    let onlyDigits = val.replace(/\D/g, "");

    let numericValue = (parseInt(onlyDigits, 10) / 100).toFixed(2);


    return numericValue.replace(".", ",");
}


export const mascaraMonetaria = (val) => {

    if (!val) return "0,00";

    let normalizedValue = val.replace(",", ".");


    let onlyDigits = normalizedValue.replace(/[^\d.]/g, "");

    let numericValue = parseFloat(onlyDigits);

    if (isNaN(numericValue)) return "0,00";

    return numericValue.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}
export const aplicarMascaraData = (valor) => {
    // Remove tudo que não for número
    valor = valor.replace(/\D/g, '');

    // Aplica a máscara
    if (valor.length > 2 && valor.length <= 4) {
        valor = valor.replace(/(\d{2})(\d+)/, '$1/$2');
    } else if (valor.length > 4) {
        valor = valor.replace(/(\d{2})(\d{2})(\d+)/, '$1/$2/$3');
    }

    return valor.slice(0, 10); // Limita a 10 caracteres (DD/MM/YYYY)
}
