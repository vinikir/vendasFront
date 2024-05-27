import React, { useContext } from 'react'
import { 
    BrowserRouter, 
    useRoutes, 
    Route,
    Routes,
    Navigate,
    Outlet
} from 'react-router-dom'

import Login from '../screens/Login'

const Rotas = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Login />} />
                <Route path="/" element={<Login />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Rotas