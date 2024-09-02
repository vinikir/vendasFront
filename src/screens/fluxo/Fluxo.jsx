import React, { useEffect, useState } from "react"
import Menulateral from "../../components/menuLatela/menuLateral"
import { buscaFluxo } from "../../functions/funcoes"
import "./fluxo.css"
const Fluxo = () => {

    const [ produtos, setProdutos] = useState([[]])
    const [ index, setIndex] = useState(0)

    useEffect(() => {
        buscaFluxo().then((res) => {
            console.log(chunkArray( res, 10))
            setProdutos(chunkArray( res, 10))

        })
    },[])
    const chunkArray = (array, size) => {
        const chunkedArray = [];
        for (let i = 0; i < array.length; i += size) {
          chunkedArray.push(array.slice(i, i + size));
        }
        return chunkedArray;
    }
      
   

    let totalValorCaixa = 0
   
  

    return(
        <div style={{ display:"flex"}}>
            
            <Menulateral />
            <div className="" style={{display:"flex", width: '100%', alignItems:"center", justifyContent:"center"}}>
              
                <div style={{ display:"flex", height: "100vh", width: '80%' }}>
                    
                    <div style={{ display:"flex", maxHeight: "100vh", width: '100%', alignItems:"center", justifyContent:"center"  }}>
                        <table style={{maxHeight: "90vh", overflow:"auto"}}>
                            <thead>
                                <tr>
                                
                                    <th>Ação</th>
                                    <th>Usuario</th>
                                    <th>Valor</th>
                                    <th>Data</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    produtos[index].map((re) => {
                                        

                                        
                                        let valor = `${re.valor.toFixed(2)}`.replace(".",",")

                                        if(re.tipo == "venda"){

                                            totalValorCaixa = totalValorCaixa+re.valor

                                        }else  if(re.tipo == "entrada"){

                                            totalValorCaixa = totalValorCaixa+re.valor

                                        }else{

                                            totalValorCaixa = totalValorCaixa-re.valor
                                            valor = `-${valor}`
                                        }
                                        
                                        

                                        return(
                                            <tr >
                                                <th>{re.tipo}</th>
                                                <th>{re.informacoes}</th>
                                                <th>{valor}</th>
                                                <th>{re.data}</th>
                                                
                                            </tr>
                                        )
                                    })
                                }
                                <tr >
                                    <th>TOTAL</th>
                                    <th></th>
                                    <th>{parseFloat(totalValorCaixa).toFixed(2).toString().replace(".",",")}</th>
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

export default Fluxo