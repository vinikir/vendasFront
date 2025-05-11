import { useEffect, useState } from "react";
import Menulateral from "../../components/menuLatela/menuLateral"
import Select from "react-select";
import makeAnimated from "react-select/animated";
import api from "../../connection/connection";
import { mascaraMoentaria, aplicarMascaraData } from "../../functions/funcoes";
import moment from "moment-timezone";
import Modal from "../../components/modal/modal";


const animatedComponents = makeAnimated();

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

const Aportes = () => {
    const [socios, setSocios] = useState([])
    const [selectedValues, setSelectedValues] = useState();
    const [valorAporte, setValorAporte] = useState("");
    const [dataAporte, setdataAporte] = useState(moment().format("DD/MM/YYYY"));
    const [descricao, setDescricao] = useState("")
    const [msg, setMsg] = useState("");
    const [modalAberta, setModalAberta] = useState(false);

    useEffect(() => {

        api.get('socios').then((res) => {
            
            const sociosOptions = res.data.valor.map((c) => ({ value: c._id, label: c.nome }));
            setSocios(sociosOptions)
        }).catch((er) => {
            console.log(er)
        })

    }, [])

    const enviar = () => {
        if (!selectedValues?.value) {
            setMsg("Selecione um sócio.");
            setModalAberta(true)
            return;
        }


        if (!valorAporte || typeof valorAporte !== "string" || valorAporte === "") {
            setMsg("Informe um valor válido para o aporte.");
            setModalAberta(true)
            return;
        }

        if (!dataAporte || dataAporte.length < 10) {
            setMsg("Informe uma data válida no formato DD/MM/AAAA.");
            setModalAberta(true)
            return;
        }


        const infos = {
            socioId: selectedValues.value,
            socioNome: selectedValues.label,
            valor: valorAporte,
            dataMovimentacao: moment(dataAporte, "DD/MM/YYYY").tz("America/Sao_Paulo").format(),
            descricao: descricao.trim(),
        }

        api.post("/aporte/salvar", infos).then( (res) => {
            console.log(res.data)
            if(res.data.erro  == false ){
                setMsg("Aporte salvo com sucesso")
                setModalAberta(true)
                return
            }

            setMsg(res.data.valor)
            setModalAberta(true)
            return
        }).catch( ( er) => {
            console.log("er", er)
            setMsg("Erro ao salvar aporte")
            setModalAberta(true)
            return
        })
    }


    return (
        <div className="page-container">
            <Menulateral />
            <div className="content-wrapper">
                <div className="form-card">
                    <h1 className="form-title">Aportes</h1>
                    <div className="form-grid">
                        <div className="form-section">
                            <div className="section-content">

                                <div className="form-group">
                                    <label className="form-label">Socio*</label>
                                    <Select
                                        options={socios}
                                        value={selectedValues}
                                        onChange={setSelectedValues}
                                        styles={colourStyles}
                                        components={animatedComponents}
                                        className="react-select-container"
                                        classNamePrefix="react-select"
                                        placeholder="Selecione os socio"
                                    />

                                </div>
                                <div className="form-group">
                                    <label className="form-label">Valor do aporte*</label>
                                    <div className="input-with-icon">
                                        <span className="currency-symbol">R$</span>
                                        <input
                                            value={valorAporte}
                                            onChange={e => setValorAporte(mascaraMoentaria(e.target.value))}
                                            className="form-input"
                                            placeholder="0,00"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Data do aporte*</label>
                                    <input
                                        value={dataAporte}
                                        onChange={e => setdataAporte(aplicarMascaraData(e.target.value))}
                                        className="form-input"
                                        placeholder="DD/MM/YYYY"
                                    />

                                </div>
                                <div className="form-group">
                                    <label className="form-label">Descrição</label>
                                    <textarea
                                        value={descricao}
                                        onChange={e => setDescricao(e.target.value)}
                                        className="form-input"
                                        rows="3"
                                        placeholder="Descreva o aporte..."
                                    />
                                </div>
                            </div>
                            <div className="form-actions">

                                <button className="primary-button" onClick={enviar}>
                                    <i className="fas fa-save"></i> Salvar aporte
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                    showModal={modalAberta}
                    handleClose={() => setModalAberta(false)}
                    msg={msg}
                />
        </div>
    )

}
export default Aportes