/* eslint-disable */
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiPrinter } from 'react-icons/fi';
import Menulateral from '../../components/menuLatela/menuLateral';
import './detalhesVenda.css';

const DetalhesVenda = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { venda, comissao } = location.state || {};
    
    if (!venda) {
        navigate('/vendas');
        return null;
    }

    const formatarData = (dataString) => {
        if (!dataString) return 'N/A';
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatarMoeda = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor || 0);
    };

    const calcularTotalProdutos = () => {
        return venda.produtos.reduce((total, produto) => total + produto.valorTotal, 0);
    };

    const calcularDescontos = () => {
        return venda.produtos.reduce((total, produto) => total + produto.desconto, 0);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'finalizado':
                return 'status-success';
            case 'cancelado':
                return 'status-danger';
            case 'pendente':
                return 'status-warning';
            default:
                return '';
        }
    };

    const imprimirVenda = () => {
        window.print();
    };

    return (
        <div className="premium-page-container">
            <Menulateral />
            
            <div className="content-wrapper">
                <div className="detalhes-venda-container">
                    {/* Cabeçalho */}
                    <div className="premium-header">
                        <button 
                            className="premium-button secondary"
                            onClick={() => navigate(-1)}
                        >
                            <FiChevronLeft className="icon" /> Voltar
                        </button>
                        <h1 className="premium-title">Detalhes da Venda #{venda.vendaId}</h1>
                        <button 
                            className="premium-button primary"
                            onClick={imprimirVenda}
                        >
                            <FiPrinter className="icon" /> Imprimir
                        </button>
                    </div>

                    {/* Informações Gerais */}
                    <div className="info-cards-container">
                        <div className="info-card">
                            <h4>Data da Venda</h4>
                            <p>{formatarData(venda.data)}</p>
                        </div>
                        
                        <div className="info-card">
                            <h4>Vendedor</h4>
                            <p>{venda.user}</p>
                        </div>
                        
                        <div className="info-card">
                            <h4>Tipo de Venda</h4>
                            <p>{venda.tipoVenda === 'local' ? 'Local' : 'Online'}</p>
                        </div>
                        
                        <div className={`info-card ${getStatusColor(venda.status)}`}>
                            <h4>Status</h4>
                            <p>{venda.status.charAt(0).toUpperCase() + venda.status.slice(1)}</p>
                        </div>
                    </div>

                    {/* Produtos/Serviços */}
                    <div className="produtos-section">
                        <h3>Itens da Venda</h3>
                        <div className="produtos-table-container">
                            <table className="produtos-table">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Quantidade</th>
                                        <th>Valor Unitário</th>
                                        <th>Desconto</th>
                                        <th>Valor Total</th>
                                        <th>Tipo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {venda.produtos.map((produto, index) => (
                                        <tr 
                                            key={index} 
                                            className={`
                                                ${produto.tipo === 'servico' ? 'servico-row' : ''}
                                                ${comissao && produto.tipo === 'venda' ? 'comissao-row' : ''}
                                            `}
                                        >
                                            <td>{produto.produtoNome}</td>
                                            <td>{produto.qtd}</td>
                                            <td>{formatarMoeda(produto.valorUnitario)}</td>
                                            <td>{formatarMoeda(produto.desconto)}</td>
                                            <td>{formatarMoeda(produto.valorTotal)}</td>
                                            <td>
                                                <span className={`tipo-badge ${produto.tipo}`}>
                                                    {produto.tipo === 'servico' ? 'Serviço' : 'Produto'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Resumo Financeiro */}
                    <div className="resumo-section">
                        <div className="resumo-card">
                            <h3>Resumo Financeiro</h3>
                            
                            <div className="resumo-row">
                                <span>Total dos Produtos:</span>
                                <span>{formatarMoeda(calcularTotalProdutos())}</span>
                            </div>
                            
                            <div className="resumo-row">
                                <span>Total de Descontos:</span>
                                <span>- {formatarMoeda(calcularDescontos())}</span>
                            </div>
                            
                            <div className="resumo-row">
                                <span>Total da Venda:</span>
                                <span className="total-value">{formatarMoeda(venda.valor)}</span>
                            </div>
                            
                            <div className="resumo-divider"></div>
                            
                            <div className="resumo-row">
                                <span>Formas de Pagamento:</span>
                                <span></span>
                            </div>
                            
                            {venda.pagamento.map((pag, index) => (
                                <div key={index} className="resumo-row pagamento-row">
                                    <span>
                                        {pag.metodo === 'pix' ? 'PIX' : 
                                         pag.metodo === 'dinheiro' ? 'Dinheiro' : 
                                         pag.metodo === 'cartao' ? 'Cartão' : 
                                         pag.metodo.charAt(0).toUpperCase() + pag.metodo.slice(1)}
                                    </span>
                                    <span>{formatarMoeda(pag.valor)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetalhesVenda;