import React, { useEffect, useState, useRef } from "react"
import Menulateral from "../../components/menuLatela/menuLateral"
import { buscaFluxo } from "../../functions/funcoes"
import "./fluxo.css"
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";

import { mascaraMonetaria } from "../../functions/funcoes";


const Fluxo = () => {

    const tableRef = useRef(null);

    const [ produtos, setProdutos] = useState([[]])
    // eslint-disable-next-line 
    const [ index, setIndex] = useState(0)

    const generatePDF = () => {

    

        const doc = new jsPDF();
    
        doc.text("Relatorio fluxo de caixa 2024", 14, 15);
    
        if (tableRef.current) {
            autoTable(doc, {
              html: tableRef.current, // Usa a tabela HTML diretamente
              startY: 20,
              
              useCss: true,
            });
        }
    
        // Salva o PDF com um nome específico
        doc.save("relatorio_fluxo_caixa_2024_"+moment().format("DDMMYYYYHm")+".pdf");

    };

    useEffect(() => {
        buscaFluxo().then((res) => {
            //console.log(chunkArray( res, 10))
            //setProdutos(chunkArray( res, 10))
            setProdutos([res])
            
        })
    },[])
    // const chunkArray = (array, size) => {
    //     const chunkedArray = [];
    //     for (let i = 0; i < array.length; i += size) {
    //       chunkedArray.push(array.slice(i, i + size));
    //     }
    //     return chunkedArray;
    // }
      
   

    let totalValorCaixa = 0
   
  

    return(
        <div style={{ display:"flex"}}>
            
            <Menulateral />
            <div className="" style={{display:"flex", width: '100%', alignItems:"center", justifyContent:"center"}}>
                <div>
                    <button onClick={() => generatePDF()}>Exportar</button>
                </div>
                <div style={{ display:"flex", height: "100vh", width: '80%' }}>
                    
                    <div style={{ display:"flex", maxHeight: "100vh", width: '100%', justifyContent:"center", height:"90%", overflow:"auto", marginTop:20  }}>
                        <table style={{marginTop:0, overflow:"auto"}}  ref={tableRef}>
                            <thead className="theadFluxo">
                                <tr className="theadTR">
                                    <th className="theadTH">Ação</th>
                                    <th className="theadTH">Usuario</th>
                                    <th className="theadTH">Valor</th>
                                    <th className="theadTH">Data</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    produtos[index].map((re) => {
                                        let cor = "#000"


                                        
                                        let valor = `${re.valor.toFixed(2)}`.replace(".",",")

                                        if(re.tipo === "venda"){

                                            totalValorCaixa = totalValorCaixa+re.valor

                                        }else  if(re.tipo === "entrada"){

                                            totalValorCaixa = totalValorCaixa+re.valor

                                        }else{

                                            totalValorCaixa = totalValorCaixa-re.valor
                                            valor = `-${valor}`
                                            cor = "#ff0004"
                                        }
                                        
                                        

                                        return(
                                            <tr >
                                                <th className="tbodyTH">{re.tipo}</th>
                                                <th className="tbodyTH">{re.informacoes}</th>
                                                <th style={{color:cor, backgroundColor:"#fff", border:"1px solid #cccccc", fontSize:"14px"} }>R$ {mascaraMonetaria(valor)}</th>
                                                <th className="tbodyTH">{re.data}</th>
                                                
                                            </tr>
                                        )
                                    })
                                }
                                <tr >
                                    <th className="tbodyTH">TOTAL</th>
                                    <th className="tbodyTH"></th>
                                    <th className="tbodyTH">R$ {parseFloat(totalValorCaixa).toFixed(2).toString().replace(".",",")}</th>
                                    <th className="tbodyTH" ></th>
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