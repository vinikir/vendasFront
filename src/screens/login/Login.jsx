import React, { useState} from "react"
import api from "../../connection/connection"
import './login.css'

import Modal from "../../components/modal/modal"

const Login = () => {
    
    const [ login, setLogin ] = useState("")
    const [ senha, setSenha ]  = useState("")
    const [ msgModal, setMsgModal] = useState("")
    const [ modalAberta, setModalAberta] = useState(false)

    const logar = () => {

        if(login.trim() === ""){
            setModalAberta(true)
            setMsgModal("O login é obrigatorio")
            return
        }

        if(senha.trim() === ""){
            setModalAberta(true)
            setMsgModal("A senha é obrigatoria")
            return
        }
        api.post('login',{ login, senha}).then((res) => {
            console.log(res)
            window.location.href = "/index"

        }).catch((er) => {
            
            setModalAberta(true)
            setMsgModal(er.response.data.valor)
            console.log(er.response.data.valor)
        })

    } 

    return (
        <div className="container">
            <div className="containeE">
                <div >
                    <img src="/img/LogoSemFundo.png" alt="" width={300} height={300}/>
                </div>
            </div>
            <div className="containeD">
                <div style={{display:"flex", width:"70%", height:"60%",  alignItems:"center", justifyContent:"space-around", flexDirection:"column"}}>
                    <div className="divInputLogin">

                        <label style={{fontSize:"30px"}}>Login 3</label>
                        <input value={login} className="inputLogin" onChange={(e) => setLogin(e.target.value)}  />
                    </div>

                    <div className="divInputLogin">
                        <label style={{fontSize:"30px"}}>Senha</label>
                        <input value={senha} type="password" className="inputLogin" onChange={(e) => setSenha(e.target.value)}  />
                    </div>

                    <div className="divInputLogin" style={{display:"flex", marginTop:"30px", width:"100%",alignItems:"center", justifyContent:"center"}}>
                        <button onClick={() => {
                            logar()
                        }} className="botaoLogin">
                            Logar
                        </button>
                    </div>
                </div> 
            </div>

            {/* <div className="subContainer">
                
               

               

            </div>*/}

            <Modal
                msg={msgModal}
                showModal={modalAberta}
                handleClose={() => {setModalAberta(false)}}
            />
         
        </div>
    )
}

export default Login