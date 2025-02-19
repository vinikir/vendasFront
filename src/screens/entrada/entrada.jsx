import React, { useState, useEffect } from "react";
import Menulateral from "../../components/menuLatela/menuLateral";
import "./entrada.css"
import api from "../../connection/connection";
import Modal from "../../components/modal/modal";
import { useLocation, useParams } from 'react-router-dom';
import { mascaraMoentaria } from "../../functions/funcoes";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
const animatedComponents = makeAnimated();
const Entrada = () => {

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

    const [isChecked, setIsChecked] = useState(true);
    const [produtoBuscar, setProdutoBuscar] = useState("")
    const [nome, setNome] = useState("")
    const [descricao, setDescricao] = useState("")
    const [valorCompra, setValorCompra] = useState("")
    const [marca, setMarca] = useState("")
    const [descontoMaximo, setDescontoMaximo] = useState(0)
    const [margem, setMargem] = useState("60")
    const [qtd, setQtd] = useState(0)
    const [atualizacao, setAtualizacao] = useState(false)
    const [categoria, setCategoria] = useState([])
    // eslint-disable-next-line 
    const [codigoBarras, setCodigodeBarras] = useState("")
    const [SKU, setSku] = useState("")
    const [Observacao, setObservacao] = useState("")
    const [img, setImg] = useState("")
    const [valorVenda, setValorVenda] = useState("")
    const [grupo, setGrupo] = useState("")
    const [grupoBusca, setGrupoBusca] = useState("")

    const [c, setC] = useState(false)

    const { id } = useParams();

    const location = useLocation();

    const pathnam = location.pathname

    const arrayCategorias = ["Acessorio", "Cabo","Carenagem", "Eletrica", "Eletronico", "Freio", "Motor", "Pneu", "Roda", "Suspensao"]

    const options = arrayCategorias.map(ca => ({ value: ca, label: ca }));

    useEffect(() => {

        if (pathnam.includes("produto/atualizar")) {

            setAtualizacao(true)
            buscaInfosproduto()
        }

        // eslint-disable-next-line 
    }, [pathnam])

    const buscaInfosproduto = () => {
        api.get("produtos?id=" + id).then(res => {
            console.log(res.data.valor)
            if (typeof res.data != "undefined" && typeof res.data.valor != "undefined" && typeof res.data.valor[0] != "undefined" && typeof res.data.valor[0]._id != "undefined") {

                preencheFormulario(res.data.valor[0])
            }
        })
    }

    let time

    const buscaGrupos = (valor) => {
        clearTimeout(time)
        setGrupoBusca(valor)
        try {
            time = setTimeout(() => {
                api.get("/grupoprodutos?busca=" + valor).then(res => {
                    console.log(res.data.valor)

                })
            }, 3000)
        } catch (e) {
            console.log("e", e)
        }




    }

    const preencheFormulario = (infos) => {

        setIsChecked(infos.ativo)
        setNome(infos.nome)
        setDescricao(infos.descricao)
        setValorCompra(`${infos.valorCompra}`)
        setDescontoMaximo(infos.descontoMaximo != null ? infos.descontoMaximo : "")
        setMargem(`${infos.margem}`)
        setQtd(infos.estoque)
    }




    const [msg, setMsg] = useState("")
    const [modalAberta, setModalAberta] = useState(false)

    const limparFormulario = () => {
        setNome("")
        setDescricao("")
        setValorCompra("")
        setDescontoMaximo("")
        setMargem("60")
        setQtd("")
        setValorVenda("")
        setMarca("")
        setImg("")
    }

    const enviar = () => {
        
        if (qtd <= 0) {
            setMsg("Quantodade precisa ser maior que 0")
            setModalAberta(true)
        }

        if (nome.trim() === "") {
            setMsg("O nome é obrigatorio")
            setModalAberta(true)
        }

        if (valorCompra.trim() === "") {
            setMsg("O valor de compra é obrigatorio")
            setModalAberta(true)
        }

        if (margem.trim() === "" || margem === 0) {
            setMsg("A margem é obrigatoria")
            setModalAberta(true)
        }

        if (margem <= 10) {
            setMsg("Valor da margem menor que o limite de 10%")
            setModalAberta(true)
        }

        if (descontoMaximo > 20) {
            setMsg("Valor da margem menor que o limite de 10%")
            setModalAberta(true)
        }

        let valorCompraReplace = valorCompra.replace(",", ".")
        valorCompraReplace = parseFloat(valorCompraReplace)

        let margemReplace = margem.replace(",", ".")
        margemReplace = parseFloat(margemReplace)

        let valorVendaReplace = valorVenda.replace(",", ".")
        valorVendaReplace = parseFloat(valorVendaReplace)
        
        let url = '/produto'

        let infos = {
            ativo: isChecked,
            nome: nome,
            descricao,
            valorCompra: valorCompraReplace,
            descontoMaximo,
            margem: margemReplace,
            quantidade: qtd,
            tipo: "venda",
            categoria: selectedValues,
            marca: marca,
            img: img,
            valorVenda: valorVendaReplace
        }

        if (atualizacao) {
            url = url + "/atualizar"
            infos.id = id
        }

        // console.log(infos)
        // return

        api.post(url, infos).then(re => {

            if (typeof re.data != "undefined" && typeof re.data.valor != "undefined" && (typeof re.data.valor._id != "undefined" || typeof re.data.valor.modifiedCount != "undefined")) {

                if (atualizacao) {
                    return window.location.href = "/produtos"
                }
                setMsg("Entrada realizada com sucesso")
                setModalAberta(true)
                limparFormulario()
            }
            
        })
    }

    const handleChange = (event) => {
        setIsChecked(event.target.checked);
    };


    const atualizaCategoria = (cat) => {
        setCategoria(cat)
        setC(!c)
    }


    const calculaValorDeVenda = () => {
        let val = valorCompra.replace(",", ".")
        val = parseFloat(val)
        const valorPOrcentagem = (val * margem) / 100
        val = valorPOrcentagem + val
        val = parseFloat(val).toFixed(2)
        setValorVenda(val.toString().replace(".", ","))
    }

    const calculaMargem = () => {
        let num1 = parseFloat(valorCompra.replace(",", "."));
        let num2 = parseFloat(valorVenda.replace(",", "."));

        let percentageDifference = ((num2 - num1) / num1) * 100;
        percentageDifference = percentageDifference.toFixed(2)
        setMargem(percentageDifference.toString().replace(".", ","))
    }

    const removecategoria = (index) => {

        let cat = [...categoria];
        cat.splice(index, 1);

        setCategoria(cat)
    }

    const [selectedValues, setSelectedValues] = useState([]);  

    const handleSelectChange = (e) => {

        const options = e
        const values = Array.from(options).map(option => option.value);

        setSelectedValues(values);
    };

    return (
        <div style={{ display: "flex" }}>
            <Menulateral />
            <div className="containt">
                <div className="sub-containt">
                    <div className="row">

                        <div className="divInput" >

                            <label>Buscar produto</label>
                            <input value={produtoBuscar} onChange={(el) => setProdutoBuscar(el.target.value)} className="inputEntrada" />

                        </div>

                        <div className="divInput" style={{ marginTop: "10px" }} >

                            <button className="botaoLogin" >
                                Buscar
                            </button>

                        </div>

                    </div>
                    <div className="row">
                        <div className="divInput" >
                            <label>Ativo</label>
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={handleChange}
                                style={{
                                    width: 15,
                                    height: 20,
                                    borderRadius: 50,
                                    appearance: 'none',
                                    backgroundColor: isChecked ? '#4caf50' : '#ccc',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s ease',
                                    boxShadow: "1px 1px -20px -15px #000"
                                }}
                            />
                        </div>
                    </div>
                    <div className="row">

                        <div className="divInput" >
                            <label>Nome</label>
                            <input value={nome} onChange={(el) => setNome(el.target.value)} className="inputEntrada" />
                        </div>

                        <div className="divInput" >
                            <label>Descricao</label>
                            <input value={descricao} onChange={(el) => setDescricao(el.target.value)} className="inputEntrada" />
                        </div>

                        <div className="divInput" >

                            <label>Valor compra</label>

                            <input value={valorCompra}
                                onBlur={() => {
                                    calculaValorDeVenda()
                                }}
                                onChange={(el) => {
                                    let valorConvertido = mascaraMoentaria(el.target.value)
                                    setValorCompra(valorConvertido)
                                }}
                                className="inputEntrada"
                            />

                        </div>

                        <div className="divInput" >
                            <label>Margem %</label>
                            <input value={margem} onChange={(el) => setMargem(el.target.value)} className="inputEntrada" />
                        </div>



                    </div>
                    <div className="rowDinamic">

                        <div className="divInput" >
                            <label>Valor venda</label>
                            <input value={valorVenda}
                                onBlur={() => calculaMargem()}
                                onChange={(el) => {
                                    let valorConvertido = mascaraMoentaria(el.target.value)
                                    setValorVenda(valorConvertido)
                                }}
                                className="inputEntrada" />
                        </div>

                        <div className="divInput" >
                            <label>Desconto maximo %</label>
                            <input value={descontoMaximo} onChange={(el) => setDescontoMaximo(el.target.value)} className="inputEntrada" />
                        </div>

                        <div className="divInput" >
                            <label>Quantidade</label>
                            <input value={qtd} onChange={(el) => setQtd(el.target.value)} className="inputEntrada" />
                        </div>

                        <div className="divInputEntrada" >
                            <label style={{ marginTop: "0px" }}>Categoria</label>
                            <div style={{ width:"100%"}}>
                                <Select
                                    options={options}
                                    value={ options.filter( ( option )   => selectedValues.includes(option.value))}
                                    onChange={handleSelectChange}
                                    isMulti={true} // Para permitir múltiplas seleções
                                    styles={colourStyles}
                                    components={animatedComponents}
                                />
                            </div>
                          
                            {/* <div  className="selectWrapper">
                                <select
                                    id="multi-select"
                                    //multiple
                                    value={selectedValues}
                                    onChange={handleSelectChange}
                                    className="selectLogin"
                                
                                >
                                    <option value=""></option>
                                        {
                                        arrayCategorias.map((ca, index) => {
                                            return (
                                                <option key={index} value={ca}>{ca}</option>
                                            )
                                        })
                                    }

                                </select>
                            </div> */}


                            <div style={{ display: "flex", flexDirection: "column", width: "100%", }}>


                                {/* <div className="divFakeInput">
                                        {categoria.map((ca, index) => {
                                            return (
                                                <div style={{display:"inline-block", marginTop:"-5px", marginLeft:"1.5px", marginRight:"1.5px", padding:"5px",  fontSize:"10px", borderRadius:"5px", border:"0.2px solid rgb(555,555,555)"}}>
                                                    <div>
                                                        {ca}
                                                        <span style={{marginLeft:"10px", cursor:"pointer"}} onClick={() => removecategoria(index)}>
                                                            X
                                                        </span>
                                                    </div>
                                                    
                                                </div>
                                            )
                                        })}
                                </div>
                                <div style={{ backgroundColor:"red"}}>
                                    <div className="divAgrupamentoOption">
                                        {
                                            arrayCategorias.map((ca) => {
                                                
                                                if(!categoria.includes(ca)){
                                                    return <div className="divOption" onClick={() => {
                                                        let c = categoria
                                                        c.push(ca)
                                                        atualizaCategoria(c)
                                                    
                                                    }}>{ca}</div>
                                                }
                                                // eslint-disable-next-line 
                                                return
                                            })
                                        }
                                    </div>
                                </div> */}
                            </div>
                            {/* <select id="categorias" value={categoria} onChange={(el) => setCodigodeBarras(el.target.value)}  >
                                <option value="volvo">Volvo</option>
                                <option value="saab">Saab</option>
                                <option value="mercedes">Mercedes</option>
                                <option value="audi">Audi</option>
                            </select> */}
                        </div>

                    </div>
                    <div className="row">

                        <div className="divInput" >
                            <label>Codigo de barras</label>
                            <input value={codigoBarras} onChange={(el) => setQtd(el.target.value)} className="inputEntrada" />
                        </div>

                        <div className="divInput" >
                            <label>SKU</label>
                            <input value={SKU} onChange={(el) => setSku(el.target.value)} className="inputEntrada" />
                        </div>

                        <div className="divInput" >
                            <label>Observação</label>
                            <input value={Observacao} onChange={(el) => setObservacao(el.target.value)} className="inputEntrada" />
                        </div>

                    </div>
                    <div className="row">
                        <div className="divInput" >
                            <label>Marca</label>
                            <input value={marca} onChange={(el) => setMarca(el.target.value)} className="inputEntrada" />
                        </div>
                        <div className="divInput" >
                            <label>Imagem</label>
                            <input value={img} onChange={(el) => setImg(el.target.value)} className="inputEntrada" />
                        </div>
                        <div className="divInput" >

                            <label>Grupo</label>

                            <input value={grupoBusca} onChange={(el) => buscaGrupos(el.target.value)} className="inputEntrada" />

                        </div>
                    </div>

                    <div className="row">
                        <div className="divInput" >
                            <button className="botaoLogin" onClick={() => enviar()}>
                                Salvar
                            </button>
                        </div>
                    </div>


                </div>

                <div>

                </div>

            </div>
            <Modal
                showModal={modalAberta}
                handleClose={() => setModalAberta(false)}
                msg={msg}
            />
        </div>
    )

}

export default Entrada