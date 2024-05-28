import React, { useEffect, useState, useMemo, useRef } from "react"
import Menulateral from "../../components/menuLatela/menuLateral"
import { buscaProdutos } from "../../functions/funcoes"

const Produtos = () => {

    const [ produtos, setProdutos] = useState([])
    
      useEffect(() => {
        buscaProdutos().then((res) => {
            
            setProdutos(res)
        })
      },[])
      
  

    return(
        <div style={{ display:"flex"}}>
            
            <Menulateral />
            <div className="">
              
                <div style={{ height: 400, width: '100%' }}>
                    <table>
                        <thead>
                            <tr>
                            
                                <th>Produto</th>
                                <th>Valor</th>
                                <th>Ativo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                produtos.map((re) => {

                                    const valorV = `${re.valorVenda}`.replace(".",",")
                                    const a = re.ativo? "Sim": "Não"
                                    return(
                                        <tr>
                                            <th>{re.nome}</th>
                                            <th>{valorV}</th>
                                            <th>{a}</th>
                                        </tr>
                                    )
                                })
                            }

                        </tbody>
                    </table>
                    
                </div>
               
            </div>
        </div>
    )

}

export default Produtos