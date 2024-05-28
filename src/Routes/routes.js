import React, { useContext } from 'react'
import { 
    BrowserRouter, 
    useRoutes, 
    Route,
    Routes,
    Navigate,
    Outlet
} from 'react-router-dom'

import Login from '../screens/login/Login'
import Index from '../screens/Index'
import Produtos from '../screens/produtos/produtos'
import Entrada from '../screens/entrada/entrada'

const Rotas = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Login />} />
                <Route path="/" element={<Login />} />
                <Route path="/index" element={<Index />} />
                <Route path="/produtos" element={<Produtos />} />
                <Route path="/entrada" element={<Entrada />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Rotas