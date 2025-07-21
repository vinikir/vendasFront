/* eslint-disable */

import React, { useState, useEffect } from "react";
import Menulateral from "../../components/menuLatela/menuLateral";
import api from "../../connection/connection";
import "./caixa.css";

const Caixa = () => {
    const [saldo, setSaldo] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        buscarSaldoCaixa();
    }, []);

    const buscarSaldoCaixa = async () => {
        try {
            setLoading(true);
            const response = await api.get("/caixa/saldo");
            setSaldo(response.data.valor || 0);
            setError(null);
        } catch (err) {
            console.error("Erro ao buscar saldo:", err);
            setError("Erro ao carregar saldo do caixa");
            setSaldo(0);
        } finally {
            setLoading(false);
        }
    };

    const formatarMoeda = (valor) => {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    return (
        <div className="page-container">
            <Menulateral />
            <div className="content-wrapper">
                <div className="caixa-card">
                    <h1 className="caixa-title">Saldo do Caixa</h1>
                    
                    <div className="saldo-container">
                        {loading ? (
                            <div className="loading-indicator">
                                <i className="fas fa-spinner fa-spin"></i> Carregando...
                            </div>
                        ) : error ? (
                            <div className="error-message">
                                <i className="fas fa-exclamation-triangle"></i> {error}
                            </div>
                        ) : (
                            <>
                                <div className="saldo-valor">
                                    {formatarMoeda(saldo)}
                                </div>
                                <div className={`saldo-status ${saldo >= 0 ? 'positivo' : 'negativo'}`}>
                                    {saldo >= 0 ? (
                                        <i className="fas fa-arrow-up"></i>
                                    ) : (
                                        <i className="fas fa-arrow-down"></i>
                                    )}
                                    {saldo >= 0 ? 'Saldo Positivo' : 'Saldo Negativo'}
                                </div>
                            </>
                        )}
                        
                        <button 
                            className="refresh-button"
                            onClick={buscarSaldoCaixa}
                            disabled={loading}
                        >
                            <i className="fas fa-sync-alt"></i> Atualizar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Caixa;