import "./menuLateral.css"


const Menulateral = ({selecionado, callback}) => {
    const urlLocal = window.location.pathname

    const redirecionar = ( rota ) => {


        if(rota === urlLocal){
            return
        }

        window.location.href = rota
        
    }

    const abas = [
        
        {
            id:2,
            nome:"Entrada",
            url:"/entrada"
        },
        {
            id:3,
            nome:"Produtos",
            url:"/produtos"
        },
        {
            id:4,
            nome:"DashBoard",
            url:"/index"
        },
        {
            id:5,
            nome:"Caixa",
            url:"/fluxo"
        }
    ]


    return (
        <div className="container-menu">
            <div className="sub-container-menu">
                {
                    abas.map((el, index) => {
                        return(
                            <div key={index.toString()} className={  el.url === urlLocal? "abaSelecionada" :  "aba" } onClick={() => {
                                redirecionar(el.url)
                            }}>
                                {el.nome}
                            </div>
                        )
                    })
                }
            </div>
            
        </div>
    )

}

export default Menulateral