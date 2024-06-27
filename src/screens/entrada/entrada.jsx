import React, { useState, useEffect} from "react";
import Menulateral from "../../components/menuLatela/menuLateral";
import "./entrada.css"
import api from "../../connection/connection";
import Modal from "../../components/modal/modal";
import { useLocation, useParams } from 'react-router-dom';
const Entrada = () => {
   
    const [isChecked, setIsChecked] = useState(true);
    const [produtoBuscar, setProdutoBuscar ] = useState("")
    const [nome, setNome ] = useState("")
    const [descricao, setDescricao ] = useState("")
    const [valorCompra, setValorCompra ] = useState("")
    const [descontoMaximo, setDescontoMaximo ] = useState(0)
    const [margem, setMargem ] = useState("20")
    const [qtd, setQtd ] = useState(0)
    const [atualizacao, setAtualizacao] = useState(false)

    const { id } = useParams(); 

    const location = useLocation();
   
    const pathnam = location.pathname

    useEffect(() => {

        if(pathnam.includes("produto/atualizar")){

            setAtualizacao(true)
            buscaInfosproduto()
        }

    // eslint-disable-next-line 
    },[pathnam])

    const buscaInfosproduto = () => {
        api.get("produtos?id="+id).then(res=> {
            console.log(res.data.valor)
            if(typeof res.data != "undefined" && typeof res.data.valor != "undefined" && typeof res.data.valor[0] != "undefined" && typeof res.data.valor[0]._id != "undefined"){
               
                preencheFormulario( res.data.valor[0])
            }
        })
    }

    const preencheFormulario = (infos) => {
        
        setIsChecked(infos.ativo)
        setNome(infos.nome)
        setDescricao(infos.descricao)
        setValorCompra(`${infos.valorCompra}`)
        setDescontoMaximo(  infos.descontoMaximo != null ? infos.descontoMaximo : "")
        setMargem(`${infos.margem}`)
        setQtd(infos.estoque)
    }
    
    
       

    const [msg, setMsg]= useState("")
    const [modalAberta, setModalAberta] = useState(false)

    const limparFormulario = () => {
        setNome("")
        setDescricao("")
        setValorCompra("")
        setDescontoMaximo("")
        setMargem("20")
        setQtd("")
    }

    const enviar = () => {

        if(qtd <= 0){
            setMsg("Quantodade precisa ser maior que 0")
            setModalAberta(true)
        }

        if(nome.trim() === ""){
            setMsg("O nome é obrigatorio")
            setModalAberta(true)
        }
        
        if( valorCompra.trim() === ""){
            setMsg("O valor de compra é obrigatorio")
            setModalAberta(true)
        }

        if(margem.trim() === "" || margem === 0){
            setMsg("A margem é obrigatoria")
            setModalAberta(true)
        }

        if(margem <= 10){
            setMsg("Valor da margem menor que o limite de 10%")
            setModalAberta(true)
        }

        if(descontoMaximo > 20){
            setMsg("Valor da margem menor que o limite de 10%")
            setModalAberta(true)
        }

        let valorCompraReplace = valorCompra.replace(",",".")
        valorCompraReplace = parseFloat(valorCompraReplace)

        let url = '/produto'

        let infos = {
            ativo:isChecked,
            nome:nome,
            descricao,
            valorCompra:valorCompraReplace,
            descontoMaximo,
            margem,
            quantidade:qtd         
        }

        if(atualizacao){
            url = url+"/atualizar"
            infos.id = id 
        }

        // console.log(infos)
        // return

        api.post(url,infos).then(re=> {
            
            if(typeof re.data != "undefined" && typeof re.data.valor != "undefined" &&  ( typeof re.data.valor._id != "undefined" ||typeof re.data.valor.modifiedCount != "undefined")){
               
                if(atualizacao){
                    return window.location.href = "/produtos"
                }
                setMsg("Entrada realizada com sucesso")
                setModalAberta(true)
                limparFormulario()
            }
            console.log(re)
        })
    }

    const handleChange = (event) => {
        setIsChecked(event.target.checked);
    };

    

    return (
        <div style={{ display:"flex"}}>
            <Menulateral />
            <div className="containt">
                <div className="sub-containt">
                    <div className="row">
                        <div className="divInput" >
                            <label>Buscar produto</label>
                            <input value={produtoBuscar} onChange={(el) => setProdutoBuscar(el.target.value)} className="inputLogin"/>
                            
                        </div>
                        <div className="divInput" >
                            <button>
                                Buscar
                            </button>

                        </div>
                    </div>
                    <div className="row">
                        <div className="divInput" >
                            <label>Ativo</label>
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={handleChange}
                                style={{
                                    width: 15,
                                    height: 20,
                                    borderRadius: 50,
                                    appearance: 'none',
                                    backgroundColor: isChecked ? '#4caf50' : '#ccc',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s ease',
                                }}
                            />
                        </div>
                    </div>
                    <div className="row">
                        
                        <div className="divInput" >
                            <label>Nome</label>
                            <input value={nome} onChange={(el) => setNome(el.target.value)} className="inputLogin"/>
                        </div>

                        <div className="divInput" >
                            <label>Descricao</label>
                            <input value={descricao} onChange={(el) => setDescricao(el.target.value)} className="inputLogin"/>
                        </div>

                        <div className="divInput" >
                            <label>Valor compra</label>
                            <input value={valorCompra} onChange={(el) => setValorCompra(el.target.value)} className="inputLogin"/>
                        </div>

                        <div className="divInput" >
                            <label>Desconto maximo %</label>
                            <input value={descontoMaximo} onChange={(el) => setDescontoMaximo(el.target.value)} className="inputLogin"/>
                        </div>

                    </div>
                    <div className="row">

                        <div className="divInput" >
                            <label>Margem %</label>
                            <input value={margem} onChange={(el) => setMargem(el.target.value)} className="inputLogin"/>
                        </div>

                        <div className="divInput" >
                            <label>Quantidade</label>
                            <input value={qtd} onChange={(el) => setQtd(el.target.value)} className="inputLogin"/>
                        </div>

                    </div>

                    <div className="row">
                        <div className="divInput" >
                            <button onClick={() => enviar()}>
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

export default Entrada