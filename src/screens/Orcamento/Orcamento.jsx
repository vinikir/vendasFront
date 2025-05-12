import React, { useState} from "react";
import Menulateral from "../../components/menuLatela/menuLateral";
import "./orcamento.css"
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import api from "../../connection/connection";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import moment from "moment";
const animatedComponents = makeAnimated();



const Orcamento = () => {
    const [options, setOptions] = useState([])
    const [selectedValues, setSelectedValues] = useState([]);
    const [ itemBuscar, setItemBuscar] = useState();
    const [valorTotalTodosItens, setValorTotalTodosItens] = useState(0)

    const handleSelectChange = (val) => {
        const itemachado  = itemBuscar.find( el => el.id === val.value)
        setSelectedValues([...selectedValues, itemachado])
        
    }


    const colourStyles = {
        control: (styles) => ({ ...styles, backgroundColor: "#4a4a4a", color: "#fff", border: "1px solid #707070", fontSize: "15px", marginTop: "10px", width: "100%", height: "auto" }),
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
            
            return {
                   ...styles,
                backgroundColor: "#707070",
       
                color: "#fff",
                cursor: "pointer",

                ':active': {
                    ...styles[':active'],
                    backgroundColor: "#707070"
                },
            };
        },
        multiValue: (styles, { data }) => {
            
            return {
                ...styles,
                backgroundColor: "#707070",
                color: "#fff",
            };
        },
        multiValueLabel: (styles, { data }) => ({
            ...styles,
            backgroundColor: "#707070",
            color: "#fff",
        }),
        multiValueRemove: (styles, { data }) => ({
            ...styles,
            color: "red",
            ':hover': {
                backgroundColor: data.color,
                color: 'white',
            },
        }),
    };
    let time
    const valorBusca = (valor) => {
        clearTimeout(time)
       
        if(valor === "") {
            return
        }

        time = setTimeout(() => {
            api.get(`/produtos?search=${valor}`)
            .then((res) => {
                setItemBuscar(res.data.valor)
                setOptions(res.data.valor.map((item) => {
                    return { value: item.id, label: item.nome }
                }))
            })
            .catch((err) => {
                console.log(err)
            })
        }, 2000)
    }

    const alterarQuantidade = (e, index) => {
        if(e.target.value < 0) {
            return
        }
        
        const item = selectedValues[index]
        const newItem = {
            ...item,
            quantidade: e.target.value,
           
        }

        const newArray = [...selectedValues]
        newArray[index] = newItem
        let val = 0
        for (let index = 0; index < newArray.length; index++) {
            const item = newArray[index];
            const valorTotal = (item.quantidade? item.quantidade: 1)  * item.valorVenda
            val = val + valorTotal

        }
        setValorTotalTodosItens(val)


        setSelectedValues(newArray)
    }

    const listagemProdutos = () => {
        let he = ''
        selectedValues.map((item) => {

            const valorTotal = (item.quantidade? item.quantidade: 1)  * item.valorVenda
            he += `
            
                <tr style="width:100%; height:40px">

                    
                    <td >${item.nome}</td>
                

                
                    <td >${item.quantidade}</td>
                

                
                    <td >R$ ${item.valorVenda.toFixed(2).toString().replace(".",",")}</td>
                

                
                    <td >${item.desconto? item.desconto: 0 }</td>
                

                
                    <td >R$ ${valorTotal.toFixed(2).toString().replace(".",",")}</td>
                    

                </tr>
            `

            return ""
            
        })
        return he
    }

    const baixar = async (h) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = h;
        document.body.appendChild(tempDiv);
        const options = {
            allowTaint: true,  // Permite imagens com taint (CORS)
            useCORS: true,     // Habilita CORS para imagens
            scale: 2,          // Melhora a qualidade
            logging: true,     // Mostra logs no console (útil para debug)
          };
        try {
          const canvas = await html2canvas(tempDiv,options);
          const imgData = canvas.toDataURL('image/png');
          
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save('relatorio.pdf');
        } finally {
            setValorTotalTodosItens(0)
            document.body.removeChild(tempDiv);
        }
    
    } 

   

    const criaHTMLPdf = async () => {

        let h = `
            <div style="display:flex; align-items:center; flex-direction:column; width:100%; height:100%">
                <div style=" display:flex; flex-direction:row; width:98%">
                  
                    <div style=" width:200px; height:200px ">
                        <img src='https://i.imgur.com/9Hv8LYj.png' width="200px" height="200px"/>
                    </div>
                    <div style="display:flex; align-items:center; justify-content:center; height: 200px; width:40%; font-size:30px"> 
                        
                        G & M Moto Pecas
                       
                       
                    </div>
                    <div style="display:flex; align-items:center; justify-content:center; height: 200px; font-size:15px; flex-direction:column">
                        <div>
                            CNPJ 55.744.795/0001-34
                        </div>
                        <div>
                            Contato (11) 9 6564-0477
                        </div>
                    </div>
                    
                </div>
                <div style="display:flex; align-items:center; justify-content:center;width:100%; height:50px; margin-top:20px">
                    <div style="display:flex; align-items:center; justify-content:center; width:98%; height:60px; font-size:40px; background-color:#4a4a4a; color:#fff">
                        Orçamento Nº 12366
                    </div>
                </div>
                <div style="  width:98%; margin-top:20px; ">
                    
                    <div>
                        Data origem do orçamento: ${moment().format("DD/MM/YYYY")}
                    </div>
                    <br/>
                    <div>
                        Valido até: ${moment().add(30, 'days').format("DD/MM/YYYY")}
                    </div>
                    
                    
                </div>
                <div style="  width:98%; margin-top:20px; ">
                    <table style="  width:100%; ">
                        <thead >
                            <tr style="background-color:rgba(50,50,50,0.3); height:40px">
                                <td>
                                    Produto
                                </td>
                                <td>
                                    
                                    Qtd
                                    
                                </td>
                                <td>
                                    Val. Uni.
                                </td>
                                <td>
                                    Desc. (%)
                                </td>
                                <td>
                                    Val. Tot.
                                </td>
                            </tr>
                        </thead>
                        <tbody>

                            ${listagemProdutos()}
                        
                        </tbody>
                        <tfoot>
                            <tr style=" height:40px">
                                <td scope="row" colspan=4>Total orçamento</td>
                                <td style="font-weight:Bold">R$ ${valorTotalTodosItens.toFixed(2).toString().replace(".",",")}</td>
                            </tr>
                        </tfoot>
                    </table>
                    
                </div>
            </div>
        `;

        
        
        baixar(h)
    } 
    

    return (
        <div style={{ display:"flex"}}>
            <Menulateral />
            
            <div className="containt">
                <div className="sub-containt" style={{flexDirection:"column", width:"100%"}}>
                    <div className="row">
                        <div className="divInput" >
                            <label>Buscar produto</label>
                            <Select
                                options={options}
                                
                                onChange={handleSelectChange}
                                isMulti={false} 
                                styles={colourStyles}
                                components={animatedComponents}
                                onInputChange={(e) => { valorBusca(e) }}
                            />
                        </div>
                    </div>
                    <div>
                        <button onClick={() => {criaHTMLPdf()}} style={{ marginTop: "20px", backgroundColor: "#707070", color: "#fff", border: "none", padding: "10px 20px", cursor: "pointer" }}>Gerar PDF</button>
                    </div>
                    <div className="row" style={{ marginTop: "20px" }}>
                        <table >
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Quantidade</th>
                                    <th>Valor unid.</th>
                                    <th>Valor total.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedValues.map((item, index) => {

                                    const valorTotal = (item.quantidade? item.quantidade: 1)  * item.valorVenda

                                    return (
                                        <tr key={index}>
                                            <td>{item.nome}</td>
                                            <td> <input onChange={(e) => alterarQuantidade(e, index)} value={item.quantidade ? item.quantidade: 0}/></td>
                                            <td>{item.valorVenda.toFixed(2).replace(".",",")}</td>
                                            <td>{valorTotal.toFixed(2).replace(".",",")}</td>
                                        </tr>
                                    )
                                })}
                                <tr >
                                    <td colSpan={3}>Valor total</td>
                                    <td>{valorTotalTodosItens.toFixed(2).replace(".",",")}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Orcamento;