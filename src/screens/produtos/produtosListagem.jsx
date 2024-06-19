import React, { useEffect, useState, useMemo, useRef } from "react"
import Menulateral from "../../components/menuLatela/menuLateral"
import { buscaProdutos } from "../../functions/funcoes"
import "./produtosListagem.css"
const Produtos = () => {

    const [ produtos, setProdutos] = useState([])
    
      useEffect(() => {
        buscaProdutos().then((res) => {
            
            setProdutos(res)
        })
    },[])

    const atualizar = (id) => {
        window.location.href = "produto/atualizar/"+id
    }

    let totalValorVenda = 0
    let totalValorCompra = 0
    let qtdProdutos = 0
    let valorTotalCompraPorItem = 0
  

    return(
        <div style={{ display:"flex"}}>
            
            <Menulateral />
            <div className="" style={{display:"flex", width: '100%', alignItems:"center", justifyContent:"center"}}>
              
                <div style={{ display:"flex", height: "100vh", width: '80%' }}>
                    
                    <div style={{ display:"flex", height: "100vh", width: '100%', alignItems:"center", justifyContent:"center"  }}>
                        <table>
                            <thead>
                                <tr>
                                
                                    <th>Produto</th>
                                    <th>Valor compra</th>
                                    {/* <th>Valor total compra</th> */}
                                    <th>Valor venda</th>
                                    
                                    <th>Quantidade</th>
                                    <th>Ativo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    produtos.map((re) => {
                                        


                                        let valorV = `${re.valorVenda}`
                                        
                                        totalValorVenda = totalValorVenda+ ( parseFloat(valorV) * re.estoque )
                                       
                                        let valorC = `${re.valorCompra}`

                                        totalValorCompra = totalValorCompra + ( parseFloat(valorC) * re.estoque )
                                    
                                        valorTotalCompraPorItem = parseFloat(re.valorCompra) * re.estoque

                                        valorTotalCompraPorItem = `${valorTotalCompraPorItem}`.replace(".",",")

                                        const a = re.ativo? "Sim": "Não"

                                        qtdProdutos = qtdProdutos + re.estoque

                                        valorC =  parseFloat(valorC).toFixed(2).toString().replace(".",",")
                                        valorV =  parseFloat(valorV).toFixed(2).toString().replace(".",",")

                                        return(
                                            <tr onClick={() => atualizar(re._id)}>
                                                <th>{re.nome}</th>
                                                <th>{valorC}</th>
                                                {/* <th>{valorTotalCompraPorItem}</th> */}
                                                <th>{valorV}</th>
                                                
                                                <th>{re.estoque}</th>
                                                <th>{a}</th>
                                            </tr>
                                        )
                                    })
                                }
                                <tr >
                                    <th>TOTAL</th>
                                    <th>{parseFloat(totalValorCompra).toFixed(2).toString().replace(".",",")}</th>
                                    <th>{parseFloat(totalValorVenda).toFixed(2).toString().replace(".",",")}</th>
                                    <th>{qtdProdutos}</th>
                                    <th></th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                </div>
               
            </div>
        </div>
    )

}

export default Produtos