import React, { useState, useEffect, useRef } from "react";
import Menulateral from "../../components/menuLatela/menuLateral";
import Modal from "../../components/modal/modal";
import api from "../../connection/connection";
import { useLocation, useParams } from "react-router-dom";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import "./fornecedores.css";
import { formatarDocumento, formatarTelefone, formatarCEP  } from "../../functions/funcoes";

const animatedComponents = makeAnimated();

const tiposFornecedor = [
    { value: "peças", label: "Peças" },
    { value: "servicos", label: "Serviços" },
    { value: "acessorios", label: "Acessórios" },
    { value: "alimentacao", label: "Alimentação" },
    { value: "outros", label: "Outros" }
];

const produtosFornecidosOptions = [
    { value: "óleo", label: "Óleo" },
    { value: "pneu", label: "Pneu" },
    { value: "bateria", label: "Bateria" },
    { value: "freio", label: "Freio" },
    { value: "motor", label: "Motor" },
    { value: "suspensao", label: "Suspensão" }
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

const Fornecedores = () => {
    const [nome, setNome] = useState("");
    const [documento, setDocumento] = useState("");
    const [inscricaoEstadual, setInscricaoEstadual] = useState("");
    const [telefone, setTelefone] = useState("");
    const [email, setEmail] = useState("");
    const [endereco, setEndereco] = useState({
        rua: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: ""
    });
    const [contato, setContato] = useState({
        nome: "",
        telefone: "",
        email: ""
    });
    const [tipoFornecedor, setTipoFornecedor] = useState(null);
    const [produtosFornecidos, setProdutosFornecidos] = useState([]);
    const [observacoes, setObservacoes] = useState("");
    const [fornecedoresOptios, setFornecedoresOption] = useState([]);
    const [fornecedores, setFornecedores] = useState([]);
    const [ fornecedorSelecionado, setFornecedorSelecionado ] = useState()
    const [ fornecedorId, setFornecedorId ] = useState()
    const [atualizacao, setAtualizacao] = useState(false);
    const [msg, setMsg] = useState("");
    const [modalAberta, setModalAberta] = useState(false);

    const { id } = useParams();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.includes("fornecedor/atualizar")) {
            setAtualizacao(true);
            buscaInfosFornecedor();
        }
    }, [location.pathname]);

    const buscaInfosFornecedor = () => {
        api.get("fornecedores?id=" + id).then((res) => {
            const fornecedor = res?.data?.valor?.[0];
            if (fornecedor?._id) {
                preencherCampos(fornecedor);
            }
        });
    };

    const preencherCampos = (fornecedor) => {
        if(typeof fornecedor.value != "undefined"){
            fornecedor = fornecedores.filter( (el) => el._id == fornecedor.value)[0]
            setAtualizacao(true);
            setFornecedorId(fornecedor._id)
        }
        
        setNome(fornecedor.nome);
        setDocumento(formatarDocumento(fornecedor.documento));
        setInscricaoEstadual(fornecedor.inscricaoEstadual);
        setTelefone(fornecedor.telefone);
        setEmail(fornecedor.email);
        setEndereco(fornecedor.endereco || {
            rua: "",
            numero: "",
            complemento: "",
            bairro: "",
            cidade: "",
            estado: "",
            cep: ""
        });
        setContato(fornecedor.contato || {
            nome: "",
            telefone: "",
            email: ""
        });
        setTipoFornecedor(tiposFornecedor.find(t => t.value === fornecedor.tipoFornecedor));
        setProdutosFornecidos(fornecedor.produtosFornecidos?.map(p =>
            produtosFornecidosOptions.find(opt => opt.value === p)
        ) || []);
        setObservacoes(fornecedor.observacoes || "");
    };

    const limparFormulario = () => {
        setNome("");
        setDocumento("");
        setInscricaoEstadual("");
        setTelefone("");
        setEmail("");
        setEndereco({
            rua: "",
            numero: "",
            complemento: "",
            bairro: "",
            cidade: "",
            estado: "",
            cep: ""
        });
        setContato({
            nome: "",
            telefone: "",
            email: ""
        });
        setTipoFornecedor(null);
        setProdutosFornecidos([]);
        setObservacoes("");
    };

    const validarFormulario = () => {
        if (!nome.trim()) return "O nome é obrigatório";
        if (!documento.trim()) return "O documento (CPF/CNPJ) é obrigatório";
        if (!telefone.trim()) return "O telefone é obrigatório";
        if (!tipoFornecedor) return "O tipo de fornecedor é obrigatório";
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
            nome,
            documento: documento.replace(/\D/g, ''),
            inscricaoEstadual,
            telefone: telefone.replace(/\D/g, ''),
            email,
            endereco,
            contato,
            tipoFornecedor: tipoFornecedor.value,
            produtosFornecidos: produtosFornecidos.map(p => p.value),
            observacoes
        };
        

        if (atualizacao) {
            const url = "/fornecedores/" + fornecedorId;
           
            api.put(url, infos).then((res) => {
                const sucesso = res.data?.valor?._id || res.data?.valor?.modifiedCount;
                console.log(res.data)
                if (sucesso) {
                    
                    setMsg("Atualizado com sucesso!");
                    setModalAberta(true);
                    limparFormulario();
                }
            }).catch( (er) => {
                console.log("er", er)
            } )
        } else {
            const url = "/fornecedores";
            api.post(url, infos).then((res) => {
                const sucesso = res.data?.valor?._id || res.data?.valor?.modifiedCount;
                
                if (sucesso) {
                   
                    setMsg("Fornecedor salvo com sucesso!");
                    setModalAberta(true);
                    limparFormulario();
                }
            }).catch( (er) => {
                console.log("er", er)
                if(er.response && er.response.data){
                    setMsg(er.response.data.valor);
                    setModalAberta(true);
                }
            } )
        }


    };

    const handleEnderecoChange = (field, value) => {
        setEndereco(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleContatoChange = (field, value) => {
        setContato(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const buscarCEP = async (cep) => {
        try {
            // Remove todos os caracteres não numéricos
            const cepNumerico = cep.replace(/\D/g, '');

            // Verifica se o CEP tem 8 dígitos
            if (cepNumerico.length !== 8) return;

            // Faz a requisição para a API ViaCEP
            const response = await fetch(`https://viacep.com.br/ws/${cepNumerico}/json/`);
            const data = await response.json();

            // Se não encontrar o CEP ou ocorrer erro
            if (data.erro) {
                alert('CEP não encontrado!');
                return;
            }

            // Preenche os campos de endereço com os dados retornados
            setEndereco(prev => ({
                ...prev,
                rua: data.logradouro || '',
                bairro: data.bairro || '',
                cidade: data.localidade || '',
                estado: data.uf || '',
                complemento: data.complemento || ''
            }));

        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            alert('Erro ao buscar CEP. Tente novamente mais tarde.');
        }
    };

    
    const time = useRef()
    const buscFornecedor = (busca) =>{

        clearTimeout(time.current)
       
        if(busca == ""){
            
            return
        }

        time.current = setTimeout( () => {
            api.get("/fornecedores/nome?nome="+busca).then( (res) => {
                
                const fornecedoresOptions = res.data.valor.map((c) => ({ value: c._id, label: c.nome }));
                setFornecedores(res.data.valor)
                setFornecedoresOption(fornecedoresOptions)
            } ).catch( ( err) => {
                console.log(err)
            })
        }, 1000)
       
    } 

    return (
        <div className="page-container">
            <Menulateral />
            <div className="content-wrapper">
                <div className="form-card">
                    <h1 className="form-title">Cadastro de Fornecedor</h1>

                    <div className="form-grid">
                        {/* SEÇÃO DE BUSCA */}
                        <div className="search-section">
                            <div className="input-group">
                                <Select
                                    options={fornecedoresOptios}
                                    value={fornecedorSelecionado}
                                    onChange={preencherCampos}
                                    styles={colourStyles}
                                    className="form-input"
                                    classNamePrefix="react-select"
                                    placeholder="Selecione o fornecedor..."
                                    onInputChange={ (t) => {buscFornecedor(t); }}
                                />
                                {/* <input
                                    value={fornecedorBuscar}
                                    onChange={e => setFornecedorBuscar(e.target.value)}
                                    className="form-input"
                                    placeholder="Digite o nome do fornecedor..."
                                /> */}
                                
                            </div>
                        </div>

                        {/* SEÇÃO DE INFORMAÇÕES BÁSICAS */}
                        <div className="form-section">
                            <h2 className="section-title">Informações Básicas</h2>
                            <div className="section-content">
                                <div className="form-group">
                                    <label className="form-label">Nome do Fornecedor*</label>
                                    <input
                                        value={nome}
                                        onChange={e => setNome(e.target.value)}
                                        className="form-input"
                                        placeholder="Ex: Distribuidora MotoTop LTDA"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Documento (CPF/CNPJ)*</label>
                                    <input
                                        value={documento}
                                        onChange={e => setDocumento(formatarDocumento(e.target.value))}
                                        className="form-input"
                                        placeholder="Ex: 12.345.678/0001-90"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Inscrição Estadual</label>
                                    <input
                                        value={inscricaoEstadual}
                                        onChange={e => setInscricaoEstadual(e.target.value)}
                                        className="form-input"
                                        placeholder="Ex: 1234567890"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SEÇÃO DE CONTATO */}
                        <div className="form-section">
                            <h2 className="section-title">Contato</h2>
                            <div className="section-content">
                                <div className="form-group">
                                    <label className="form-label">Telefone*</label>
                                    <input
                                        value={telefone}
                                        onChange={e => setTelefone(formatarTelefone(e.target.value))}
                                        className="form-input"
                                        placeholder="Ex: (11) 98765-4321"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Email*</label>
                                    <input
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="form-input"
                                        type="email"
                                        placeholder="Ex: contato@mototop.com.br"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SEÇÃO DE ENDEREÇO */}
                        <div className="form-section">
                            <h2 className="section-title">Endereço</h2>
                            <div className="section-content">
                                <div className="form-group">
                                    <label className="form-label">CEP</label>
                                    <input
                                        value={endereco.cep}
                                        onChange={(e) => {
                                            const formattedCEP = formatarCEP(e.target.value);
                                            handleEnderecoChange('cep', formattedCEP);

                                            // Busca automática quando o CEP estiver completo (8 dígitos)
                                            if (formattedCEP.replace(/\D/g, '').length === 8) {
                                                buscarCEP(formattedCEP);
                                            }
                                        }}
                                        className="form-input"
                                        placeholder="Ex: 01234-000"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Rua</label>
                                    <input
                                        value={endereco.rua}
                                        onChange={e => handleEnderecoChange('rua', e.target.value)}
                                        className="form-input"
                                        placeholder="Ex: Rua das Engrenagens"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Número</label>
                                    <input
                                        value={endereco.numero}
                                        onChange={e => handleEnderecoChange('numero', e.target.value)}
                                        className="form-input"
                                        placeholder="Ex: 456"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Complemento</label>
                                    <input
                                        value={endereco.complemento}
                                        onChange={e => handleEnderecoChange('complemento', e.target.value)}
                                        className="form-input"
                                        placeholder="Ex: Bloco B"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Bairro</label>
                                    <input
                                        value={endereco.bairro}
                                        onChange={e => handleEnderecoChange('bairro', e.target.value)}
                                        className="form-input"
                                        placeholder="Ex: Vila Oficina"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Cidade</label>
                                    <input
                                        value={endereco.cidade}
                                        onChange={e => handleEnderecoChange('cidade', e.target.value)}
                                        className="form-input"
                                        placeholder="Ex: São Paulo"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Estado</label>
                                    <input
                                        value={endereco.estado}
                                        onChange={e => handleEnderecoChange('estado', e.target.value)}
                                        className="form-input"
                                        placeholder="Ex: SP"
                                        maxLength="2"
                                    />
                                </div>


                            </div>
                        </div>

                        {/* SEÇÃO DE CONTATO PRINCIPAL */}
                        <div className="form-section">
                            <h2 className="section-title">Contato Principal</h2>
                            <div className="section-content">
                                <div className="form-group">
                                    <label className="form-label">Nome</label>
                                    <input
                                        value={contato.nome}
                                        onChange={e => handleContatoChange('nome', e.target.value)}
                                        className="form-input"
                                        placeholder="Ex: Carlos Ferreira"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Telefone</label>
                                    <input
                                        value={contato.telefone}
                                        onChange={e => handleContatoChange('telefone', formatarTelefone(e.target.value))}
                                        className="form-input"
                                        placeholder="Ex: (11) 91234-5678"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input
                                        value={contato.email}
                                        onChange={e => handleContatoChange('email', e.target.value)}
                                        className="form-input"
                                        type="email"
                                        placeholder="Ex: carlos.ferreira@mototop.com.br"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SEÇÃO DE CATEGORIZAÇÃO */}
                        <div className="form-section">
                            <h2 className="section-title">Categorização</h2>
                            <div className="section-content">
                                <div className="form-group">
                                    <label className="form-label">Tipo de Fornecedor*</label>
                                    <Select
                                        options={tiposFornecedor}
                                        value={tipoFornecedor}
                                        onChange={setTipoFornecedor}
                                        styles={colourStyles}
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        placeholder="Selecione o tipo..."
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Produtos Fornecidos</label>
                                    <Select
                                        options={produtosFornecidosOptions}
                                        value={produtosFornecidos}
                                        onChange={setProdutosFornecidos}
                                        isMulti
                                        styles={colourStyles}
                                        components={animatedComponents}
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        placeholder="Selecione os produtos..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SEÇÃO ADICIONAL */}
                        <div className="form-section">
                            <h2 className="section-title">Informações Adicionais</h2>
                            <div className="section-content">
                                <div className="form-group">
                                    <label className="form-label">Observações</label>
                                    <textarea
                                        value={observacoes}
                                        onChange={e => setObservacoes(e.target.value)}
                                        className="form-input"
                                        rows="3"
                                        placeholder="Ex: Entrega rápida e bons descontos para compras em grande volume."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* BOTÕES DE AÇÃO */}
                        <div className="form-actions">
                            <button className="secondary-button" onClick={() => window.location.href = "/fornecedores"}>
                                <i className="fas fa-times"></i> Cancelar
                            </button>
                            <button className="primary-button" onClick={enviar}>
                                <i className="fas fa-save"></i> Salvar Fornecedor
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

export default Fornecedores;