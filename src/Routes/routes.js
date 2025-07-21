import React from 'react'
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
import Orcamento from '../screens/Orcamento/Orcamento'
import Fluxo from '../screens/fluxo/Fluxo'
import Aportes from '../screens/Aportes/aportes'
import Fornecedores from '../screens/Fornecedores/Forncedores'
import ListaFornecedores from '../screens/Fornecedores/Listagem'
import ComissoesPage from '../screens/Comissao/comissao'
import DetalhesVenda from '../screens/Venda/DetalhesVenda'
import CadastroDespesas from '../screens/Despesas/CadastroDespesas'
import Caixa from '../screens/caixa/Caixa'
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
                <Route path="/fluxo" element={<Fluxo />} />
                <Route path="/orcamento" element={<Orcamento />} />
                <Route path="/aporte" element={<Aportes />} />
                <Route path="/fornecedores" element={<Fornecedores />} />
                <Route path="/fornecedores/listar" element={<ListaFornecedores />} />
                <Route path="/comissoes" element={<ComissoesPage />} />
                <Route path="/vendadetalhe" element={<DetalhesVenda />} />
                <Route path="/despesas/criar" element={<CadastroDespesas />} />
                <Route path="/caixa/atual" element={<Caixa />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Rotas