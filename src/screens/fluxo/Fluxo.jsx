import React, { useEffect, useState, useRef } from "react";
import Menulateral from "../../components/menuLatela/menuLateral";
import { buscaFluxo, mascaraMonetaria } from "../../functions/funcoes";
import "./fluxo.css";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";

const Fluxo = () => {
    const tableRef = useRef(null);
    const [produtos, setProdutos] = useState([[]]);
    // eslint-disable-next-line
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text("Relatório de Fluxo de Caixa - 2024", 14, 15);

        if (tableRef.current) {
            autoTable(doc, {
                html: tableRef.current,
                startY: 25,
                useCss: true,
            });
        }
        doc.save(`relatorio_fluxo_caixa_2024_${moment().format("DDMMYYYY_HHmm")}.pdf`);
    };

    useEffect(() => {
        setLoading(true);
        buscaFluxo()
            .then((res) => {
                setProdutos([res]);
                setLoading(false);
            })
            .catch((err) => {
                setError("Erro ao carregar os dados do fluxo de caixa.");
                setLoading(false);
                console.error("Erro na busca do fluxo:", err);
            });
    }, []);

    let totalValorCaixa = 0;

    if (produtos && produtos[0]) {
        totalValorCaixa = produtos[0].reduce((acc, item) => {
            if (item.tipo === "venda" || item.tipo === "entrada") {
                return acc + item.valor;
            } else {
                return acc - item.valor;
            }
        }, 0);
    }

    if (loading) {
        return (
            <div className="fluxo-container">
                <Menulateral />
                <div className="fluxo-content loading">Carregando dados...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fluxo-container">
                <Menulateral />
                <div className="fluxo-content error">{error}</div>
            </div>
        );
    }

    return (
        <div className="fluxo-container">
            <Menulateral />
            <div className="fluxo-content">
                <div className="fluxo-header">
                    <button className="export-button" onClick={generatePDF}>
                        <i className="fas fa-file-pdf"></i> Exportar para PDF
                    </button>
                </div>
                <div className="fluxo-table-container">
                    <table className="fluxo-table" ref={tableRef}>
                        <thead className="fluxo-thead">
                            <tr className="fluxo-thead-tr">
                                <th className="fluxo-thead-th">Ação</th>
                                <th className="fluxo-thead-th">Usuário</th>
                                <th className="fluxo-thead-th">Valor</th>
                                <th className="fluxo-thead-th">Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            {produtos[index]?.map((re) => {
                                let cor = "#000";
                                let valor = `${re.valor.toFixed(2)}`.replace(".", ",");

                                if (re.tipo === "saida") {
                                    valor = `-${valor}`;
                                    cor = "#ff4d4d"; // Um tom de vermelho mais suave
                                }

                                return (
                                    <tr key={re.id}> {/* Adicione uma key única para cada linha */}
                                        <td className="fluxo-tbody-td">{re.tipo}</td>
                                        <td className="fluxo-tbody-td">{re.informacoes}</td>
                                        <td className="fluxo-tbody-td" style={{ color: cor }}>
                                            R$ {mascaraMonetaria(valor)}
                                        </td>
                                        <td className="fluxo-tbody-td">{re.data}</td> {/* Formate a data */}
                                    </tr>
                                );
                            })}
                            <tr className="fluxo-total-row">
                                <th className="fluxo-total-th">TOTAL</th>
                                <th className="fluxo-total-th"></th>
                                <th className="fluxo-total-th">R$ {mascaraMonetaria(parseFloat(totalValorCaixa).toFixed(2))}</th>
                                <th className="fluxo-total-th"></th>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Fluxo;