/* eslint-disable */

import React, { useState } from "react";
import Menulateral from "../../components/menuLatela/menuLateral";
import Modal from "../../components/modal/modal";
import api from "../../connection/connection";
import { mascaraMoentaria } from "../../functions/funcoes";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import "./despesas.css";

const animatedComponents = makeAnimated();

const formaPagamentoOptions = [
    { value: "pix", label: "PIX" },
    { value: "dinheiro", label: "Dinheiro" },
    { value: "deposito", label: "Depósito em Conta" }
];



const colourStyles = {
    control: (styles) => ({ ...styles, backgroundColor: "#4a4a4a", color: "#fff", border: "1px solid #707070", fontSize: "15px" }),
    option: (styles) => ({ ...styles, backgroundColor: "#707070", color: "#fff", cursor: "pointer" }),
    singleValue: (styles) => ({ ...styles, color: "#fff" }),
};

const CadastroDespesas = () => {
    const [valor, setValor] = useState("");
    const [dataMovimentacao, setDataMovimentacao] = useState("");
    const [informacoes, setInformacoes] = useState("");
    const [formaPagamento, setFormaPagamento] = useState(null);
    const [fornecedorId, setFornecedorId] = useState("");
    const [descricao, setDescricao] = useState("");
    const [categoria, setCategoria] = useState(null);

    const [msg, setMsg] = useState("");
    const [modalAberta, setModalAberta] = useState(false);
    const [fornecedores, setFornecedores] = useState([]);
    const [buscaFornecedor, setBuscaFornecedor] = useState("");
    const userNome = localStorage.getItem('userNome');
    const funcionarioId = localStorage.getItem('funcionarioId');
    
    const buscarFornecedores = (valor) => {
        setBuscaFornecedor(valor);
        if (!valor) return;

        clearTimeout(buscarFornecedores.timer);
        buscarFornecedores.timer = setTimeout(() => {
            api.get("/fornecedores?busca=" + valor).then((res) => {
                setFornecedores(res.data.valor.map(f => ({
                    value: f._id,
                    label: f.nome
                })));
            });
        }, 500);
    };

    const validarFormulario = () => {
        if (!valor.trim()) return "O valor é obrigatório";
        if (!dataMovimentacao.trim()) return "A data é obrigatória";
        if (!formaPagamento) return "A forma de pagamento é obrigatória";
        return null;
    };

    const limparFormulario = () => {
        setValor("");
        setDataMovimentacao("");
        setInformacoes("");
        setFormaPagamento(null);
        setFornecedorId("");
        setDescricao("");
        setCategoria(null);
    };

    const enviarDespesa = () => {
        const erro = validarFormulario();
        if (erro) {
            setMsg(erro);
            setModalAberta(true);
            return;
        }

        const despesa = {
            valor: parseFloat(valor.replace(",", ".")),
            dataMovimentacao,
            informacoes,
            formaPagamento: formaPagamento.value,
            fornecedorId: fornecedorId.value || null,
            descricao: "compra_mercadoria",
            categoria:  "compra_mercadoria",
            funcionarioId:funcionarioId,
            funcionarioNome:userNome
        };

        api.post("/investimento-saida-compra", despesa).then((res) => {
            if (res.data?.valor?._id) {
                setMsg("Despesa cadastrada com sucesso!");
                setModalAberta(true);
                limparFormulario();
            }
        }).catch(err => {
            setMsg("Erro ao cadastrar despesa: " + (err.response?.data?.message || err.message));
            setModalAberta(true);
        });
    };

    return (
        <div className="page-container">
            <Menulateral />
            <div className="content-wrapper">
                <div className="form-card">
                    <h1 className="form-title">Cadastro de Despesas</h1>

                    <div className="form-grid">
                        {/* SEÇÃO DE INFORMAÇÕES BÁSICAS */}
                        <div className="form-section">
                            <h2 className="section-title">Informações da Despesa</h2>
                            <div className="section-content">
                                <div className="form-group">
                                    <label className="form-label">Valor*</label>
                                    <div className="input-with-icon">
                                        <span className="currency-symbol">R$</span>
                                        <input
                                            value={valor}
                                            onChange={e => setValor(mascaraMoentaria(e.target.value))}
                                            className="form-input"
                                            placeholder="0,00"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Data*</label>
                                    <input
                                        type="date"
                                        value={dataMovimentacao}
                                        onChange={e => setDataMovimentacao(e.target.value)}
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Forma de Pagamento*</label>
                                    <Select
                                        options={formaPagamentoOptions}
                                        value={formaPagamento}
                                        onChange={setFormaPagamento}
                                        styles={colourStyles}
                                        components={animatedComponents}
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        placeholder="Selecione..."
                                    />
                                </div>

                               
                            </div>
                        </div>

                        {/* SEÇÃO DE FORNECEDOR */}
                        <div className="form-section">
                            <h2 className="section-title">Fornecedor</h2>
                            <div className="section-content">
                                <div className="form-group">
                                    <label className="form-label">Fornecedor</label>
                                    <Select
                                        options={fornecedores}
                                        value={fornecedorId}
                                        onChange={setFornecedorId}
                                        onInputChange={buscarFornecedores}
                                        styles={colourStyles}
                                        components={animatedComponents}
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        placeholder="Selecione..."
                                        isClearable
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SEÇÃO DE INFORMAÇÕES ADICIONAIS */}
                        <div className="form-section">
                            <h2 className="section-title">Informações Adicionais</h2>
                            <div className="section-content">

                                <div className="form-group">
                                    <label className="form-label">Informações</label>
                                    <textarea
                                        value={informacoes}
                                        onChange={e => setInformacoes(e.target.value)}
                                        className="form-input"
                                        rows="3"
                                        placeholder="Detalhes adicionais sobre a despesa..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* BOTÕES DE AÇÃO */}
                        <div className="form-actions">
                            <button
                                className="secondary-button"
                                onClick={limparFormulario}
                            >
                                <i className="fas fa-times"></i> Limpar
                            </button>
                            <button
                                className="primary-button"
                                onClick={enviarDespesa}
                            >
                                <i className="fas fa-save"></i> Salvar Despesa
                            </button>
                        </div>
                    </div>
                </div>

                <Modal
                    showModal={modalAberta}
                    handleClose={() => setModalAberta(false)}
                    msg={msg}
                />
            </div>
        </div>
    );
};

export default CadastroDespesas;