import React, { useEffect, useState } from "react"

import Menulateral from "../components/menuLatela/menuLateral"
import { buscaVendas } from "../functions/funcoes"
import Chart from "react-apexcharts";

const Index = () => {
    const [ vendasUsuarios,setVendasUsuarios ] = useState([])
    const [ vendasQtd,setVendasQtd ] = useState([])

    const [ vendasTipo,setVendasTipo ] = useState([])
    const [ vendasQtdTipo,setVendasQtdTipo ] = useState([])

    // const [ tipoProduto, setTipoProduto] = []


    useEffect(() => {

        buscaVendas().then((res) => {
            let u = {}
            let v = {}
            for (let index = 0; index < res.length; index++) {
                const element = res[index];
                
                if(typeof u[element.user] == "undefined"){
                    u[element.user] = 1
                }else{
                    u[element.user] ++
                }

                for (let index = 0; index < element.produtos.length; index++) {
                    const elementP = element.produtos[index];
                    if(elementP.tipo === "insumos"){
                        continue
                    }

                    if(elementP.tipo === "venda"){
                        elementP.tipo = "produto"
                    }

                    
                    if(typeof v[elementP.tipo] === "undefined"){
                        v[elementP.tipo] = 1
                    }else{
                        v[elementP.tipo] ++
                    }

                    
                }
            }
            
            const atributos = Object.keys(u)
            const values = Object.values(u)
          
            const atributosP = Object.keys(v)
            const valuesP = Object.values(v)

            setVendasTipo(atributosP)
            setVendasQtdTipo(valuesP)

            setVendasQtd(values)
            setVendasUsuarios(atributos)
            

        })
    },[])

    
    const t2 = {
        options: {
            chart: {
                width: 380,
                type: 'pie',
            },
            xaxis: {
                categories: vendasTipo
            },
        },
        series: [
            {
                name: "Tipo Poduto",
                data: vendasQtdTipo
            }
        ]
    };

    const t = {
          
        series: vendasQtd,
        options: {
            chart: {
                width: 380,
                type: 'pie',
            },
            labels: vendasUsuarios,
            responsive: [{
                breakpoint: 480,
                options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
                }
            }]
        },
      
      
    };
    

    return (
        <div style={{ display:"flex"}}>
            
            <Menulateral />
            
            <div className="" style={{ display:"flex",  width:"100%", flexDirection:"column"}}>
                <div style={{ display:"flex", width:"100%", height:"80px",  alignItems:"center", justifyContent:"center"}}>
                    <span style={{ fontSize:"40px", fontFamily:"sans-serif", fontWeight:"bold"}}> Dashboard Vendas </span>
                </div>
                <div style={{ display:"flex", width:"100%", flexDirection:"row"}}>
                    <div style={{ display:"flex", width:"50%", alignItems:"center", justifyContent:"center"}}>

                        <Chart options={t.options} series={t.series} type="pie" width={500} />

                    </div>
                    <div style={{ display:"flex", width:"50%", alignItems:"center", justifyContent:"center"}}>
                        <Chart
                            options={t2.options}
                            series={t2.series}
                            type="bar"
                            width="500"
                        />
                    </div>
                </div>
                
               
            </div>
        </div>
    )
}

export default Index