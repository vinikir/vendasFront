/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { FiSearch, FiChevronLeft, FiChevronRight, FiCalendar, FiUser } from 'react-icons/fi';
import { FaFilter } from 'react-icons/fa';
import Menulateral from '../../components/menuLatela/menuLateral';
import api from '../../connection/connection';
import './comissoes.css';
import { useNavigate } from 'react-router-dom';

const ComissoesPage = () => {
    const navigate = useNavigate();

    const [comissoes, setComissoes] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);
    const [filtros, setFiltros] = useState({
        dataInicio: '',
        dataFim: '',
        funcionarioId: ''
    });
    const [mostrarFiltros, setMostrarFiltros] = useState(true);
    const [carregando, setCarregando] = useState(false);
    const [totalComissao, setTotalComissao] = useState(0);
    const [paginacao, setPaginacao] = useState({
        paginaAtual: 1,
        totalPaginas: 1,
        itensPorPagina: 10
    });

    useEffect(() => {
        buscarFuncionarios();
    }, []);

    useEffect(() => {
        buscarComissoes();
    }, [filtros]);

    const buscarFuncionarios = async () => {
        try {
            const response = await api.get('/vendedor-listar');
            setFuncionarios(response.data.valor);
        } catch (error) {
            console.error('Erro ao buscar funcionários:', error);
        }
    };

    const buscarComissoes = async () => {
        setCarregando(true);
        try {


            const body = {
                dataInicio: filtros.dataInicio,
                dataFim: filtros.dataFim,
                userId: filtros.funcionarioId
            }

            const response = await api.post('/venda/buscar/vendedor', body);

            console.log('Response:', JSON.stringify(response.data.valor));
            let valorT = 0;
            for (let index = 0; index < response.data.valor.length; index++) {
                const element = response.data.valor[index];
                const calcComissao = calcularTotalComissao(element.produtos);
                valorT += calcComissao.comissao;
                response.data.valor[index].comissao = calcComissao.comissao;
                response.data.valor[index].comissionavel = calcComissao.venda;
            }

            setComissoes(response.data.valor);
            setTotalComissao(valorT);
            setPaginacao(prev => ({
                ...prev,
                totalPaginas: Math.ceil(response.data.valor.total / paginacao.itensPorPagina)
            }));
        } catch (error) {
            console.error('Erro ao buscar comissões:', error);
        } finally {
            setCarregando(false);
        }
    };

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const limparFiltros = () => {
        setFiltros({
            dataInicio: '',
            dataFim: '',
            funcionarioId: ''
        });
        setPaginacao(prev => ({ ...prev, paginaAtual: 1 }));
    };

    const mudarPagina = (pagina) => {
        if (pagina > 0 && pagina <= paginacao.totalPaginas) {
            setPaginacao(prev => ({ ...prev, paginaAtual: pagina }));
        }
    };

    const formatarData = (dataString) => {
        if (!dataString) return 'N/A';
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    };

    const formatarMoeda = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor || 0);
    };

    function calcularTotalComissao(itens) {
        const total = itens.reduce((acc, item) => {
            if (item.tipo === 'venda') {
                return acc + parseFloat(item.valorTotal);
            }
            return acc;
        }, 0);

        const totalFormatado = parseFloat(total.toFixed(2));
        const comissao = parseFloat((totalFormatado * 0.10).toFixed(2));
        return {
            venda: totalFormatado,
            comissao: comissao
        }
    }

    return (
        <div className="premium-page-container">
            <Menulateral />

            <div className="content-wrapper">
                <div className="comissoes-container">
                    {/* Cabeçalho */}
                    <div className="premium-header">
                        <h1 className="premium-title">Relatório de Comissões</h1>
                    </div>

                    {/* Filtros */}
                    <div className="comissoes-filtros">
                        <div className="filtros-header">
                            <h3>
                                <FaFilter className="icon" /> Filtros
                            </h3>
                            <button
                                className="premium-button secondary small"
                                onClick={limparFiltros}
                            >
                                Limpar Filtros
                            </button>
                        </div>

                        <div className="filtros-grid">
                            <div className="filter-group">
                                <label>
                                    <FiCalendar className="icon" /> Data Início
                                </label>
                                <input
                                    type="date"
                                    name="dataInicio"
                                    value={filtros.dataInicio}
                                    onChange={handleFiltroChange}
                                    className="premium-input"
                                />
                            </div>

                            <div className="filter-group">
                                <label>
                                    <FiCalendar className="icon" /> Data Fim
                                </label>
                                <input
                                    type="date"
                                    name="dataFim"
                                    value={filtros.dataFim}
                                    onChange={handleFiltroChange}
                                    className="premium-input"
                                />
                            </div>

                            <div className="filter-group">
                                <label>
                                    <FiUser className="icon" /> Funcionário
                                </label>
                                <select
                                    name="funcionarioId"
                                    value={filtros.funcionarioId}
                                    onChange={handleFiltroChange}
                                    className="premium-input"
                                >
                                    <option value="">Todos</option>
                                    {funcionarios.map(func => (
                                        <option key={func._id} value={func._id}>
                                            {func.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Resumo */}
                    <div className="comissoes-resumo">
                        <div className="resumo-card">
                            <h4>Total de Comissão</h4>
                            <h2>{formatarMoeda(totalComissao)}</h2>
                        </div>
                    </div>

                    {/* Tabela de Comissões */}
                    {carregando ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Carregando comissões...</p>
                        </div>
                    ) : comissoes.length === 0 ? (
                        <div className="no-results">
                            <img src="/assets/images/no-data.svg" alt="Sem resultados" />
                            <h3>Nenhuma venda encontrada</h3>
                            <p>Tente ajustar seus filtros de busca</p>
                        </div>
                    ) : (
                        <>
                            <div className="comissoes-tabela-container">
                                <table className="comissoes-tabela">
                                    <thead>
                                        <tr>
                                            <th>Data</th>
                                            <th>Funcionário</th>
                                            <th>Cliente</th>
                                            <th>Valor Venda</th>
                                            <th>Valor Comissionavel</th>
                                            <th>% Comissão</th>
                                            <th>Valor Comissão</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            comissoes.map((venda) => {
                                                
                                                return (
                                                    <tr key={venda._id} onClick={() => {
navigate('/vendadetalhe', { state: { venda:venda, comissao: true } });
                                                    }}>
                                                        <td>{formatarData(venda.data)}</td>
                                                        <td>{venda?.user || 'N/A'}</td>
                                                        <td>{venda?.clienteNome || 'N/A'}</td>
                                                        <td>{formatarMoeda(venda.valor)}</td>
                                                         <td>{formatarMoeda(venda.comissionavel)}</td>
                                                        <td>10%</td>
                                                        <td className="valor-destaque">
                                                            {formatarMoeda(venda.comissao)}
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
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
        </div>
    );
};

export default ComissoesPage;