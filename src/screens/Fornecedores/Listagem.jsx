/* eslint-disable */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiEdit2,  FiEye, FiPlus, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaFilter, FaRegStar, FaStar } from 'react-icons/fa';
import Menulateral from '../../components/menuLatela/menuLateral';
import Modal from '../../components/modal/modal';
import api from '../../connection/connection';
import './listaFornecedores.css';

const PremiumFornecedores = () => {
    const [fornecedores, setFornecedores] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [filtrosAvancados, setFiltrosAvancados] = useState({
        tipo: '',
        cidade: '',
        favorito: false
    });
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [carregando, setCarregando] = useState(true);
    const [modalAberta, setModalAberta] = useState(false);
    const [mensagemModal, setMensagemModal] = useState('');
    const [fornecedorParaExcluir, setFornecedorParaExcluir] = useState(null);
    const [paginacao, setPaginacao] = useState({
        paginaAtual: 1,
        totalPaginas: 1,
        itensPorPagina: 12
    });

    const navigate = useNavigate();

    useEffect(() => {

        buscarFornecedores();
    }, []);

    const buscarFornecedores = async () => {
        setCarregando(true);
        try {
            const params = {
                pagina: paginacao.paginaAtual,
                limite: paginacao.itensPorPagina,
                
                
            };

            if (filtro) params.busca = filtro;
            if (filtrosAvancados.tipo) params.tipo = filtrosAvancados.tipo;
            if (filtrosAvancados.cidade) params.cidade = filtrosAvancados.cidade;
            if (filtrosAvancados.favorito) params.favorito = true;

            const response = await api.get('/fornecedores', { params });
            
            setFornecedores(response.data.valor);
            setPaginacao(prev => ({
                ...prev,
                totalPaginas: Math.ceil(response.data.valor.total / paginacao.itensPorPagina)
            }));
        } catch (error) {
            console.error('Erro ao buscar fornecedores:', error);
            setMensagemModal('Erro ao carregar fornecedores');
            setModalAberta(true);
        } finally {
            setCarregando(false);
        }
    };

    const alternarFavorito = async (id, atualFavorito) => {
        try {
            await api.patch(`/fornecedores/${id}/favorito`, { favorito: !atualFavorito });
            buscarFornecedores();
        } catch (error) {
            console.error('Erro ao atualizar favorito:', error);
        }
    };

    const confirmarExclusao = async () => {
        try {
            await api.delete(`/fornecedores/${fornecedorParaExcluir}`);
            setMensagemModal('Fornecedor excluído com sucesso!');
            buscarFornecedores();
        } catch (error) {
            setMensagemModal('Erro ao excluir fornecedor');
        } finally {
            setFornecedorParaExcluir(null);
            setModalAberta(true);
        }
    };

    const formatarDocumento = (doc) => {
        if (!doc) return 'N/A';
        return doc.length === 11 
            ? doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
            : doc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    };

    const formatarTelefone = (tel) => {
        if (!tel) return 'N/A';
        return tel.length === 10 
            ? tel.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
            : tel.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    };

    const getTipoFornecedor = (tipo) => {
        const tipos = {
            peças: 'Peças',
            servicos: 'Serviços',
            acessorios: 'Acessórios',
            alimentacao: 'Alimentação',
            outros: 'Outros'
        };
        return tipos[tipo] || tipo;
    };

    const mudarPagina = (pagina) => {
        if (pagina > 0 && pagina <= paginacao.totalPaginas) {
            setPaginacao(prev => ({ ...prev, paginaAtual: pagina }));
        }
    };

    const limparFiltros = () => {
        setFiltro('');
        setFiltrosAvancados({
            tipo: '',
            cidade: '',
            favorito: false
        });
        setPaginacao(prev => ({ ...prev, paginaAtual: 1 }));
    };

    return (
        <div className="premium-page-container">
            <Menulateral />
            
            <div className="content-wrapper">
                <div className="premium-fornecedores-container">
                    {/* Cabeçalho Premium */}
                    <div className="premium-header">
                        <h1 className="premium-title">Fornecedores</h1>
                        <div className="premium-actions">
                            <button 
                                className="premium-button primary"
                                onClick={() => navigate('/fornecedor/cadastrar')}
                            >
                                <FiPlus className="icon" /> Novo Fornecedor
                            </button>
                        </div>
                    </div>

                    {/* Barra de Ferramentas */}
                    <div className="premium-toolbar">
                        <div className="search-box">
                            <FiSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Buscar fornecedores..."
                                value={filtro}
                                onChange={(e) => setFiltro(e.target.value)}
                                className="premium-search-input"
                            />
                            <button 
                                className={`filter-toggle ${mostrarFiltros ? 'active' : ''}`}
                                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                            >
                                <FaFilter className="icon" /> Filtros
                            </button>
                        </div>

                        {/* Filtros Avançados */}
                        {mostrarFiltros && (
                            <div className="advanced-filters">
                                <div className="filter-group">
                                    <label>Tipo:</label>
                                    <select
                                        value={filtrosAvancados.tipo}
                                        onChange={(e) => setFiltrosAvancados({...filtrosAvancados, tipo: e.target.value})}
                                    >
                                        <option value="">Todos</option>
                                        <option value="peças">Peças</option>
                                        <option value="servicos">Serviços</option>
                                        <option value="acessorios">Acessórios</option>
                                        <option value="alimentacao">Alimentação</option>
                                        <option value="outros">Outros</option>
                                    </select>
                                </div>

                                <div className="filter-group">
                                    <label>Cidade:</label>
                                    <input
                                        type="text"
                                        placeholder="Filtrar por cidade"
                                        value={filtrosAvancados.cidade}
                                        onChange={(e) => setFiltrosAvancados({...filtrosAvancados, cidade: e.target.value})}
                                    />
                                </div>

                                <div className="filter-group checkbox-group">
                                    <input
                                        type="checkbox"
                                        id="favoritos"
                                        checked={filtrosAvancados.favorito}
                                        onChange={(e) => setFiltrosAvancados({...filtrosAvancados, favorito: e.target.checked})}
                                    />
                                    <label htmlFor="favoritos">Apenas favoritos</label>
                                </div>

                                <button 
                                    className="premium-button secondary small"
                                    onClick={limparFiltros}
                                >
                                    Limpar Filtros
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Cards de Fornecedores */}
                    {carregando ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Carregando fornecedores...</p>
                        </div>
                    ) : fornecedores.length === 0 ? (
                        <div className="no-results">
                            <img src="/assets/images/no-data.svg" alt="Sem resultados" />
                            <h3>Nenhum fornecedor encontrado</h3>
                            <p>Tente ajustar seus filtros de busca</p>
                            <button 
                                className="premium-button secondary"
                                onClick={limparFiltros}
                            >
                                Limpar Filtros
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="premium-grid">
                                {fornecedores.map(fornecedor => (
                                    <div 
                                        key={fornecedor._id} 
                                        className={`fornecedor-card ${fornecedor.favorito ? 'favorito' : ''}`}
                                    >
                                        <div className="card-header">
                                            <div className="favorito-icon" onClick={() => alternarFavorito(fornecedor._id, fornecedor.favorito)}>
                                                {fornecedor.favorito ? (
                                                    <FaStar className="icon favorited" />
                                                ) : (
                                                    <FaRegStar className="icon" />
                                                )}
                                            </div>
                                            <h3 className="fornecedor-nome">{fornecedor.nome}</h3>
                                            <span className="fornecedor-tipo">{getTipoFornecedor(fornecedor.tipoFornecedor)}</span>
                                        </div>

                                        <div className="card-body">
                                            <div className="info-row">
                                                <span className="info-label">Documento:</span>
                                                <span className="info-value">{formatarDocumento(fornecedor.documento)}</span>
                                            </div>
                                            <div className="info-row">
                                                <span className="info-label">Telefone:</span>
                                                <span className="info-value">{formatarTelefone(fornecedor.telefone)}</span>
                                            </div>
                                            <div className="info-row">
                                                <span className="info-label">Localização:</span>
                                                <span className="info-value">
                                                    {fornecedor.endereco?.cidade || 'N/A'}{fornecedor.endereco?.estado ? `/${fornecedor.endereco.estado}` : ''}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="card-footer">
                                            <button 
                                                className="action-button view"
                                                onClick={() => navigate(`/fornecedor/visualizar/${fornecedor._id}`)}
                                                title="Visualizar"
                                            >
                                                <FiEye className="icon" />
                                            </button>
                                            <button 
                                                className="action-button edit"
                                                onClick={() => navigate(`/fornecedor/atualizar/${fornecedor._id}`)}
                                                title="Editar"
                                            >
                                                <FiEdit2 className="icon" />
                                            </button>
                                            {/* <button 
                                                className="action-button delete"
                                                onClick={() => {
                                                    setFornecedorParaExcluir(fornecedor._id);
                                                    setMensagemModal(`Tem certeza que deseja excluir ${fornecedor.nome}?`);
                                                    setModalAberta(true);
                                                }}
                                                title="Excluir"
                                            >
                                                <FiTrash2 className="icon" />
                                            </button> */}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Paginação */}
                            {paginacao.totalPaginas > 1 && (
                                <div className="premium-pagination">
                                    <button 
                                        onClick={() => mudarPagina(paginacao.paginaAtual - 1)}
                                        disabled={paginacao.paginaAtual === 1}
                                        className="pagination-button"
                                    >
                                        <FiChevronLeft className="icon" /> Anterior
                                    </button>

                                    <div className="page-numbers">
                                        {Array.from({ length: Math.min(5, paginacao.totalPaginas) }, (_, i) => {
                                            let pageNum;
                                            if (paginacao.totalPaginas <= 5) {
                                                pageNum = i + 1;
                                            } else if (paginacao.paginaAtual <= 3) {
                                                pageNum = i + 1;
                                            } else if (paginacao.paginaAtual >= paginacao.totalPaginas - 2) {
                                                pageNum = paginacao.totalPaginas - 4 + i;
                                            } else {
                                                pageNum = paginacao.paginaAtual - 2 + i;
                                            }

                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => mudarPagina(pageNum)}
                                                    className={`pagination-button ${paginacao.paginaAtual === pageNum ? 'active' : ''}`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}

                                        {paginacao.totalPaginas > 5 && paginacao.paginaAtual < paginacao.totalPaginas - 2 && (
                                            <span className="ellipsis">...</span>
                                        )}

                                        {paginacao.totalPaginas > 5 && paginacao.paginaAtual < paginacao.totalPaginas - 2 && (
                                            <button
                                                onClick={() => mudarPagina(paginacao.totalPaginas)}
                                                className={`pagination-button ${paginacao.paginaAtual === paginacao.totalPaginas ? 'active' : ''}`}
                                            >
                                                {paginacao.totalPaginas}
                                            </button>
                                        )}
                                    </div>

                                    <button 
                                        onClick={() => mudarPagina(paginacao.paginaAtual + 1)}
                                        disabled={paginacao.paginaAtual === paginacao.totalPaginas}
                                        className="pagination-button"
                                    >
                                        Próxima <FiChevronRight className="icon" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Modal de Confirmação */}
            <Modal
                showModal={modalAberta}
                handleClose={() => {
                    setModalAberta(false);
                    setFornecedorParaExcluir(null);
                }}
                msg={mensagemModal}
                onConfirm={fornecedorParaExcluir ? confirmarExclusao : null}
                confirmText={fornecedorParaExcluir ? "Confirmar" : null}
                cancelText={fornecedorParaExcluir ? "Cancelar" : null}
            />
        </div>
    );
};

export default PremiumFornecedores;