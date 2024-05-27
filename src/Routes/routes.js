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
const Rotas = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Login />} />
                <Route path="/" element={<Login />} />
                <Route path="/index" element={<Index />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Rotas