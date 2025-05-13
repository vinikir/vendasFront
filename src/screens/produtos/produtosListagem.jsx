import React, { useEffect, useState } from "react"
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

    const redirecionar = () => {
        window.location.href = "/entrada";
    }
  

    return(
        <div style={{ display:"flex"}}>
            
            <Menulateral />
            <div className="" style={{display:"flex", width: '100%', alignItems:"center", justifyContent:"center"}}>
              <button onClick={() => { redirecionar()}}>
                        Criar produto
                    </button>
                <div style={{ display:"flex", height: "100vh", width: '80%' }}>
                    
                    <div style={{ display:"flex", maxHeight: "100vh", width: '100%', justifyContent:"center", height:"90%", overflow:"auto", marginTop:20  }}>
                        <table style={{marginTop:0, overflow:"auto"}} >
                            <thead className="theadFluxo">
                                <tr className="theadTR">
                                
                                    <th className="theadTH">Produto</th>
                                    <th className="theadTH">Valor compra</th>
                                    {/* <th>Valor total compra</th> */}
                                    <th className="theadTH">Valor venda</th>
                                    
                                    <th className="theadTH">Quantidade</th>
                                    <th className="theadTH">Ativo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    produtos.map((re) => {
                                        if(re.tipo !== "venda" || re.estoque <= 0){
                                            return ""
                                        }
                                        

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
                                                <th className="tbodyTH">{re.nome}</th>
                                                <th className="tbodyTH">{valorC}</th>
                                                {/* <th>{valorTotalCompraPorItem}</th> */}
                                                <th className="tbodyTH">{valorV}</th>
                                                
                                                <th className="tbodyTH">{re.estoque}</th>
                                                <th className="tbodyTH">{a}</th>
                                            </tr>
                                        )
                                    })
                                }
                                <tr >
                                    <th className="tbodyTH">TOTAL</th>
                                    <th className="tbodyTH">{parseFloat(totalValorCompra).toFixed(2).toString().replace(".",",")}</th>
                                    <th className="tbodyTH">{parseFloat(totalValorVenda).toFixed(2).toString().replace(".",",")}</th>
                                    <th className="tbodyTH">{qtdProdutos}</th>
                                    <th className="tbodyTH"></th>
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