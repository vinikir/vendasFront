/* eslint-disable */

import React, { useState, useEffect, useCallback } from "react";
import Menulateral from "../../components/menuLatela/menuLateral";
import Modal from "../../components/modal/modal";
import api from "../../connection/connection";
import { useLocation, useParams } from "react-router-dom";
import { mascaraMoentaria } from "../../functions/funcoes";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import "./entrada.css";

const animatedComponents = makeAnimated();

const arrayCategorias = ["Acessorio", "Cabo", "Carenagem", "Eletrica", "Eletronico", "Freio", "Motor", "Pneu", "Roda", "Suspensao"];
const categoriaOptions = arrayCategorias.map((c) => ({ value: c, label: c }));

const tipoOptions = [
  { value: "produto", label: "Produto" },
  { value: "servico", label: "Serviço" }
];

const colourStyles = {
    control: (styles) => ({ ...styles, backgroundColor: "#4a4a4a", color: "#fff", border: "1px solid #707070", fontSize: "15px" }),
    option: (styles) => ({ ...styles, backgroundColor: "#707070", color: "#fff", cursor: "pointer" }),
    multiValue: (styles) => ({ ...styles, backgroundColor: "#707070", color: "#fff" }),
    multiValueLabel: (styles) => ({ ...styles, color: "#fff" }),
    multiValueRemove: (styles) => ({
        ...styles,
        color: "red",
        ":hover": { backgroundColor: "red", color: "white" },
    }),
};

const Entrada = () => {
    const [tipo, setTipo] = useState("produto");
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [valorCompra, setValorCompra] = useState("");
    const [margem, setMargem] = useState("60");
    const [valorVenda, setValorVenda] = useState("");
    const [descontoMaximo, setDescontoMaximo] = useState("");
    const [qtd, setQtd] = useState("");
    const [isChecked, setIsChecked] = useState(true);
    const [marca, setMarca] = useState("");
    const [img, setImg] = useState("");
    const [imgAdicional, setImgAdicional] = useState([]);
    const [codigoBarras, setCodigodeBarras] = useState("");
    const [SKU, setSku] = useState("");
    const [Observacao, setObservacao] = useState("");
    const [grupoBusca, setGrupoBusca] = useState("");
    const [selectedValues, setSelectedValues] = useState([]);

    const [locais, setLocais] = useState([]);
    const [novoTipoLocal, setNovoTipoLocal] = useState("");
    const [novoValorLocal, setNovoValorLocal] = useState("");

    const [atualizacao, setAtualizacao] = useState(false);
    const [msg, setMsg] = useState("");
    const [modalAberta, setModalAberta] = useState(false);

    const { id } = useParams();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.includes("produto/atualizar") || location.pathname.includes("servico/atualizar")) {
            setAtualizacao(true);
            buscaInfos();
        }
    }, []);

    const buscaInfos = () => {
        const endpoint = tipo === "produto" ? "produtos" : "servicos";
        api.get(`${endpoint}?id=${id}`).then((res) => {
            const item = res?.data?.valor?.[0];
            if (item?._id) {
                preencherCampos(item);
            }
        });
    };

    const adicionarLocal = () => {
        if (novoTipoLocal.trim() && novoValorLocal.trim()) {
            setLocais([...locais, { tipo: novoTipoLocal, valor: novoValorLocal }]);
            setNovoTipoLocal("");
            setNovoValorLocal("");
        }
    };

    const adicionarImagem = () => {
        if (img.trim()) {
            setImgAdicional([...imgAdicional, img]);
            setImg("");
        }
    };

    const removerLocal = (index) => {
        const novosLocais = [...locais];
        novosLocais.splice(index, 1);
        setLocais(novosLocais);
    };

    const removerImagem = (index) => {
        const novasImagens = [...imgAdicional];
        novasImagens.splice(index, 1);
        setImgAdicional(novasImagens);
    };

    const preencherCampos = (item) => {
        setIsChecked(item.ativo);
        setNome(item.nome);
        setDescricao(item.descricao);
        setTipo(item.tipo);
        
        if (item.tipo === "produto") {
            setValorCompra(`${item.valorCompra}`);
            setMargem(`${item.margem}`);
            setQtd(item.estoque);
            setMarca(item.marca || "");
            setSelectedValues(item.categoria?.map((c) => ({ label: c, value: c })) || []);
            setLocais(item.localizacao || []);
        }
        
        setValorVenda(item.valorVenda?.toString().replace(".", ",") || "");
        setDescontoMaximo(item.descontoMaximo ?? "");
        setImg(item.img || "");
        setImgAdicional(item.imgAdicional || []);
        setObservacao(item.observacao || "");
    };

    const buscaGrupos = useCallback((valor) => {
        setGrupoBusca(valor);
        if (!valor) return;

        clearTimeout(buscaGrupos.timer);
        buscaGrupos.timer = setTimeout(() => {
            api.get("/grupoprodutos?busca=" + valor).then((res) => {
                console.log(res.data.valor);
            });
        }, 500);
    }, []);

    const limparFormulario = () => {
        setNome("");
        setDescricao("");
        setValorCompra("");
        setDescontoMaximo("");
        setMargem("60");
        setQtd("");
        setValorVenda("");
        setMarca("");
        setImg("");
        setImgAdicional([]);
        setSelectedValues([]);
        setLocais([]);
    };

    const calculaValorDeVenda = () => {
        const compra = parseFloat(valorCompra.replace(",", "."));
        const margemPerc = parseFloat(margem.replace(",", "."));
        if (isNaN(compra) || isNaN(margemPerc)) return;

        const venda = ((compra * margemPerc) / 100 + compra).toFixed(2).replace(".", ",");
        setValorVenda(venda);
    };

    const calculaMargem = () => {
        const compra = parseFloat(valorCompra.replace(",", "."));
        const venda = parseFloat(valorVenda.replace(",", "."));
        if (isNaN(compra) || isNaN(venda)) return;

        const margemCalc = (((venda - compra) / compra) * 100).toFixed(2).replace(".", ",");
        setMargem(margemCalc);
    };

    const validarFormulario = () => {
        if (!nome.trim()) return "O nome é obrigatório";
        
        if (tipo === "produto") {
            if (!valorCompra.trim()) return "O valor de compra é obrigatório para produtos";
            if (!margem.trim() || parseFloat(margem.replace(",", ".")) <= 10) return "Margem deve ser maior que 10%";
            if (qtd <= 0) return "Quantidade precisa ser maior que 0";
        }
        
        if (!valorVenda.trim()) return "O valor de venda é obrigatório";
        if (descontoMaximo > 20) return "Desconto máximo não pode ser maior que 20%";
        
        return null;
    };

    const enviar = () => {
        const erro = validarFormulario();
        if (erro) {
            setMsg(erro);
            setModalAberta(true);
            return;
        }

        const infos = {
            ativo: isChecked,
            nome,
            descricao,
            descontoMaximo: descontoMaximo || 0,
            observacao: Observacao,
            valorVenda: parseFloat(valorVenda.replace(",", ".")),
            img,
            imgAdicional,
            tipo
        };

        if (tipo === "produto") {
            infos.valorCompra = parseFloat(valorCompra.replace(",", "."));
            infos.margem = parseFloat(margem.replace(",", "."));
            infos.quantidade = qtd;
            infos.categoria = selectedValues.map((v) => v.value);
            infos.marca = marca;
            infos.localizacao = locais;
            infos.codigoBarras = codigoBarras;
            infos.SKU = SKU;
            infos.tipo = "venda"
        }

        let url = `/produto`;
        if (atualizacao) {
            url += "/atualizar";
            infos.id = id;
        }
        
        api.post(url, infos).then((res) => {
            const sucesso = res.data?.valor?._id || res.data?.valor?.modifiedCount;
            if (sucesso) {
                if (atualizacao) return (window.location.href = `/${tipo}s`);
                setMsg(`${tipo === "produto" ? "Produto" : "Serviço"} salvo com sucesso!`);
                setModalAberta(true);
                limparFormulario();
            }
        }).catch((err) => {
            console.error("Erro ao salvar:", err);
            setMsg(err.response?.data?.valor || "Erro ao salvar, tente novamente.");
            setModalAberta(true);
        });

    return (
        <div className="page-container">
            <Menulateral />
            <div className="content-wrapper">
                <div className="form-card">
                    <h1 className="form-title">
                        {atualizacao ? `Atualização de ${tipo === "produto" ? "Produto" : "Serviço"}` : 
                         `Cadastro de ${tipo === "produto" ? "Produto" : "Serviço"}`}
                    </h1>
                   
                    <div className="form-grid">
                        {/* SEÇÃO DE TIPO */}
                        <div className="form-section">
                            <h2 className="section-title">Tipo</h2>
                            <div className="section-content">
                                <div className="form-group">
                                    <label className="form-label">Tipo*</label>
                                    <Select
                                        options={tipoOptions}
                                        value={tipoOptions.find(option => option.value === tipo)}
                                        onChange={(selected) => setTipo(selected.value)}
                                        isDisabled={atualizacao}
                                        styles={colourStyles}
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SEÇÃO DE INFORMAÇÕES BÁSICAS */}
                        <div className="form-section">
                            <h2 className="section-title">Informações Básicas</h2>
                            <div className="section-content">
                                <div className="form-group switch-group">
                                    <label className="form-label">Status</label>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={e => setIsChecked(e.target.checked)}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                    <span className="switch-label">{isChecked ? "Ativo" : "Inativo"}</span>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Nome*</label>
                                    <input
                                        value={nome}
                                        onChange={e => setNome(e.target.value)}
                                        className="form-input"
                                        placeholder={tipo === "produto" ? "Ex: Lampada LED" : "Ex: Troca de óleo"}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Descrição</label>
                                    <textarea
                                        value={descricao}
                                        onChange={e => setDescricao(e.target.value)}
                                        className="form-input"
                                        rows="3"
                                        placeholder="Descreva..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SEÇÃO DE PREÇOS */}
                        <div className="form-section">
                            <h2 className="section-title">Preços</h2>
                            <div className="section-content">
                                {tipo === "produto" && (
                                    <>
                                        <div className="form-group">
                                            <label className="form-label">Valor de Compra*</label>
                                            <div className="input-with-icon">
                                                <span className="currency-symbol">R$</span>
                                                <input
                                                    value={valorCompra}
                                                    onBlur={calculaValorDeVenda}
                                                    onChange={e => setValorCompra(mascaraMoentaria(e.target.value))}
                                                    className="form-input"
                                                    placeholder="0,00"
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Margem de Lucro (%)*</label>
                                            <div className="input-with-icon">
                                                <input
                                                    value={margem}
                                                    onChange={e => setMargem(e.target.value)}
                                                    className="form-input"
                                                    placeholder="Ex: 30"
                                                />
                                                <span className="percentage-symbol">%</span>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="form-group">
                                    <label className="form-label">Valor de Venda*</label>
                                    <div className="input-with-icon">
                                        <span className="currency-symbol">R$</span>
                                        <input
                                            value={valorVenda}
                                            onBlur={tipo === "produto" ? calculaMargem : undefined}
                                            onChange={e => setValorVenda(mascaraMoentaria(e.target.value))}
                                            className="form-input"
                                            placeholder="0,00"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Desconto Máximo (%)</label>
                                    <div className="input-with-icon">
                                        <input
                                            value={descontoMaximo}
                                            onChange={e => setDescontoMaximo(e.target.value)}
                                            className="form-input"
                                            placeholder="Ex: 10"
                                            type="number"
                                            min="0"
                                            max="20"
                                        />
                                        <span className="percentage-symbol">%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SEÇÃO ESPECÍFICA PARA PRODUTOS */}
                        {tipo === "produto" && (
                            <>
                                {/* SEÇÃO DE ESTOQUE */}
                                <div className="form-section">
                                    <h2 className="section-title">Estoque</h2>
                                    <div className="section-content">
                                        <div className="form-group">
                                            <label className="form-label">Quantidade em Estoque*</label>
                                            <input
                                                value={qtd}
                                                onChange={e => setQtd(e.target.value)}
                                                className="form-input"
                                                type="number"
                                                min="0"
                                                placeholder="Ex: 100"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">SKU*</label>
                                            <input
                                                value={SKU}
                                                onChange={e => setSku(e.target.value)}
                                                className="form-input"
                                                placeholder="Código único do produto"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Código de Barras</label>
                                            <input
                                                value={codigoBarras}
                                                onChange={e => setCodigodeBarras(e.target.value)}
                                                className="form-input"
                                                placeholder="Digite ou escaneie o código"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* SEÇÃO DE CATEGORIZAÇÃO */}
                                <div className="form-section">
                                    <h2 className="section-title">Categorização</h2>
                                    <div className="section-content">
                                        <div className="form-group">
                                            <label className="form-label">Categoria(s)*</label>
                                            <Select
                                                options={categoriaOptions}
                                                value={selectedValues}
                                                onChange={setSelectedValues}
                                                isMulti
                                                styles={colourStyles}
                                                components={animatedComponents}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                                placeholder="Selecione as categorias..."
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Marca</label>
                                            <input
                                                value={marca}
                                                onChange={e => setMarca(e.target.value)}
                                                className="form-input"
                                                placeholder="Ex: Apple, Samsung"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Grupo</label>
                                            <input
                                                value={grupoBusca}
                                                onChange={e => buscaGrupos(e.target.value)}
                                                className="form-input"
                                                placeholder="Buscar grupo..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* SEÇÃO DE LOCALIZAÇÃO */}
                                <div className="form-section">
                                    <h2 className="section-title">Localização</h2>
                                    <div className="section-content">
                                        <div className="form-group">
                                            <label className="form-label">Local do Item</label>
                                            <div className="locais-container">
                                                <div className="input-group-local">
                                                    <input
                                                        value={novoTipoLocal}
                                                        onChange={(e) => setNovoTipoLocal(e.target.value)}
                                                        className="form-input"
                                                        placeholder="Tipo (ex: Corredor)"
                                                    />
                                                    <input
                                                        value={novoValorLocal}
                                                        onChange={(e) => setNovoValorLocal(e.target.value)}
                                                        className="form-input"
                                                        placeholder="Valor (ex: A)"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="add-local-button"
                                                        onClick={adicionarLocal}
                                                    >
                                                        <i className="fas fa-plus"></i> Adicionar
                                                    </button>
                                                </div>

                                                {locais.length > 0 && (
                                                    <div className="locais-list">
                                                        {locais.map((local, index) => (
                                                            <div key={index} className="local-item">
                                                                <span className="local-tipo">{local.tipo}:</span>
                                                                <span className="local-valor">{local.valor}</span>
                                                                <button
                                                                    type="button"
                                                                    className="remove-local-button"
                                                                    onClick={() => removerLocal(index)}
                                                                >
                                                                    <i className="fas fa-times"></i>
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* SEÇÃO ADICIONAL */}
                        <div className="form-section">
                            <h2 className="section-title">Informações Adicionais</h2>
                            <div className="section-content">
                                <div className="form-group">
                                    <label className="form-label">Imagem Principal (URL)</label>
                                    <input
                                        value={img}
                                        onChange={e => setImg(e.target.value)}
                                        className="form-input"
                                        placeholder="Cole a URL da imagem..."
                                    />
                                    {img && (
                                        <div className="image-preview">
                                            <img src={img} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Imagens Adicionais</label>
                                    <div className="input-group-local">
                                        <input
                                            value={img}
                                            onChange={e => setImg(e.target.value)}
                                            className="form-input"
                                            placeholder="Cole a URL da imagem adicional..."
                                        />
                                        <button
                                            type="button"
                                            className="add-local-button"
                                            onClick={adicionarImagem}
                                        >
                                            <i className="fas fa-plus"></i> Adicionar
                                        </button>
                                    </div>
                                    
                                    {imgAdicional.length > 0 && (
                                        <div className="locais-list">
                                            {imgAdicional.map((imagem, index) => (
                                                <div key={index} className="local-item">
                                                    <span className="local-valor">Imagem {index + 1}</span>
                                                    <button
                                                        type="button"
                                                        className="remove-local-button"
                                                        onClick={() => removerImagem(index)}
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Observações</label>
                                    <textarea
                                        value={Observacao}
                                        onChange={e => setObservacao(e.target.value)}
                                        className="form-input"
                                        rows="3"
                                        placeholder="Notas internas..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* BOTÕES DE AÇÃO */}
                        <div className="form-actions">
                            <button 
                                className="secondary-button"
                                onClick={() => window.location.href = `/${tipo}s`}
                            >
                                <i className="fas fa-times"></i> Cancelar
                            </button>
                            <button className="primary-button" onClick={enviar}>
                                <i className="fas fa-save"></i> {atualizacao ? "Atualizar" : "Salvar"} {tipo === "produto" ? "Produto" : "Serviço"}
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

export default Entrada;