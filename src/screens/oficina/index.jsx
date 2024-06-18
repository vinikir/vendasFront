import React, { useState} from "react";
import Menulateral from "../../components/menuLatela/menuLateral";
import "./oficina.css"
import api from "../../connection/connection";
import Modal from "../../components/modal/modal";

const Oficina = () => {

    const [msg, setMsg]= useState("")
    const [modalAberta, setModalAberta] = useState(false)

    return (
        <div style={{ display:"flex"}}>
            <Menulateral />
            
            <div className="containt">
                <div className="sub-containt">
                    <div className="row">
                        <div className="divInput" >
                            <label>Buscar produto</label>
                            <input  className="inputLogin"/>
                            
                        </div>
                        <div className="divInput" >
                            <button>
                                Buscar
                            </button>

                        </div>
                    </div>
                    <div className="row">
                        <div className="divInput" >
                            
                        </div>
                    </div>
                    <div className="row">
                        
                        <div className="divInput" >
                            <label>Nome</label>
                            <input  className="inputLogin"/>
                        </div>

                        <div className="divInput" >
                            <label>Descricao</label>
                            <input  className="inputLogin"/>
                        </div>

                        <div className="divInput" >
                            <label>Valor compra</label>
                            <input  className="inputLogin"/>
                        </div>

                        <div className="divInput" >
                            <label>Desconto maximo %</label>
                            <input  className="inputLogin"/>
                        </div>

                    </div>
                    <div className="row">

                        <div className="divInput" >
                            <label>Margem %</label>
                            <input  className="inputLogin"/>
                        </div>

                        <div className="divInput" >
                            <label>Quantidade</label>
                            <input  className="inputLogin"/>
                        </div>

                    </div>

                    <div className="row">
                        <div className="divInput" >
                            <button >
                                Salvar
                            </button>
                        </div>
                    </div>
                    

                </div>
               
               <div>
               
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

export default Oficina