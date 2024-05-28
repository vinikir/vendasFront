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

        if(login.trim() == ""){
            setModalAberta(true)
            setMsgModal("O login é obrigatorio")
            return
        }

        if(senha.trim() == ""){
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

            <div className="subContainer">

                <div className="divInput">
                    <label>Login</label>
                    <input value={login} className="inputLogin" onChange={(e) => setLogin(e.target.value)}  />
                </div>

                <div className="divInput">
                    <label>Senha</label>
                    <input value={senha} type="password" className="inputLogin" onChange={(e) => setSenha(e.target.value)}  />
                </div>

                <div className="divInput">
                    <button onClick={() => {
                        logar()
                    }} className="botaoLogin">
                        Logar
                    </button>
                </div>

            </div>

            <Modal
                msg={msgModal}
                showModal={modalAberta}
                handleClose={() => {setModalAberta(false)}}
            />
         
        </div>
    )
}

export default Login