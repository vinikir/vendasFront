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

export const formatarTelefone = (value) => {
    return value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d)(\d{4})$/, '$1-$2')
        .substring(0, 15);
};

export const formatarCEP = (value) => {
    return value
        .replace(/\D/g, '')
        .replace(/^(\d{5})(\d)/, '$1-$2')
        .substring(0, 9);
};


export const formatarDocumento = (value) => {
    // Remove todos os caracteres não numéricos
    const numeros = value.replace(/\D/g, '');

    // Verifica se é CPF (11 dígitos) ou CNPJ (14 dígitos)
    if (numeros.length <= 11) {
        // Formata como CPF: 000.000.000-00
        return numeros
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
            .substring(0, 14);
    } else {
        // Formata como CNPJ: 00.000.000/0000-00
        return numeros
            .replace(/^(\d{2})(\d)/, '$1.$2')
            .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .substring(0, 18);
    }
};



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
