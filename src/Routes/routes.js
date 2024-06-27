import React,  from 'react'
import { 
    BrowserRouter, 
    Route,
    Routes
} from 'react-router-dom'

import Login from '../screens/login/Login'
import Index from '../screens/Index'
import ProdutosListagem from '../screens/produtos/produtosListagem'
import Entrada from '../screens/entrada/entrada'
import AuthMl from '../screens/authML'
import Oficina from '../screens/oficina'
const Rotas = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Login />} />
                <Route path="/" element={<Login />} />
                <Route path="/index" element={<Index />} />
                <Route path="/produtos" element={<ProdutosListagem />} />
                <Route path="/entrada" element={<Entrada />} />
                <Route path="/produto/atualizar/:id" element={<Entrada />} />
                <Route path="/authml" element={<AuthMl />} />
                <Route path="/oficina" element={<Oficina />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Rotas