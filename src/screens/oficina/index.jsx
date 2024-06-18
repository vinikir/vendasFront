import React, { useState} from "react";
import Menulateral from "../../components/menuLatela/menuLateral";
import "./oficina.css"
import api from "../../connection/connection";
import Modal from "../../components/modal/modal";

const Oficina = () => {
    return (
        <div style={{ display:"flex"}}>
            <Menulateral />
        </div>
    )
}

export default Oficina