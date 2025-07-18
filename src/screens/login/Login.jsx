import React, { useState } from "react";
import api from "../../connection/connection";
import "./login.css";
import Modal from "../../components/modal/modal";

const Login = () => {
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [msgModal, setMsgModal] = useState("");
    const [modalAberta, setModalAberta] = useState(false);

    const logar = () => {
        if (login.trim() === "") {
            setModalAberta(true);
            setMsgModal("O login é obrigatório");
            return;
        }

        if (senha.trim() === "") {
            setModalAberta(true);
            setMsgModal("A senha é obrigatória");
            return;
        }
        console.log("Login:", login);
        console.log("Senha:", senha);
        api.post("login", { login, senha, acesso: "web" }).then((res) => {
            console.log("Login realizado com sucesso", res.data);
            localStorage.setItem('userId', res.data.valor.userId);
            localStorage.setItem('userNome', res.data.valor.nome);
            localStorage.setItem('funcionarioId', res.data.valor.funcionarioId);
            localStorage.setItem('user', JSON.stringify(res.data.valor));


            window.location.href = "/index";

        }).catch((er) => {

            console.log("entrou no erro", er);
            setModalAberta(true);
            setMsgModal(er.response?.data?.valor || "Erro ao fazer login");
            console.log(er.response?.data?.valor);

        });
    };

    const handleKeyDown = (event) => {
        console.log(event.key)
        if (event.key === 'Enter') {
            console.log('A tecla Enter foi pressionada!');
            logar()
        }
        
    };

    return (
        <div className="containerLogin">
            <div className="leftLogin">
                <img src="/img/LogoSemFundo.png" alt="Logo" className="logoLogin" />
                <h1 className="tituloEmpresa">G&M Moto Peças</h1>
            </div>

            <div className="rightLogin">
                <div className="formLogin">
                    <div className="divInputLogin">
                        <label>Login</label>
                        <input
                            value={login}
                            className="inputLogin"
                            onChange={(e) => setLogin(e.target.value)}
                            placeholder="Digite seu login"

                        />
                    </div>

                    <div className="divInputLogin">
                        <label>Senha</label>
                        <input
                            value={senha}
                            type="password"
                            className="inputLogin"
                            onChange={(e) => setSenha(e.target.value) }
                            placeholder="Digite sua senha"
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <button onClick={logar} className="botaoLogin">
                        Entrar
                    </button>
                </div>
            </div>

            <Modal
                msg={msgModal}
                showModal={modalAberta}
                handleClose={() => setModalAberta(false)}
            />
        </div>
    );
};

export default Login;
