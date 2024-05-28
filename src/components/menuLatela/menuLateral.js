import "./menuLateral.css"
const Menulateral = ({selecionado, callback}) => {
    const urlLocal = window.location.pathname

    const redirecionar = ( rota ) => {


        if(rota == urlLocal){
            return
        }

        window.location.href = rota
        
    }

    const abas = [
        {
            id:1,
            nome:"PDV",
            url:"/pdv"
        },
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
        }
    ]


    return (
        <div className="container">
            {
                abas.map((el) => {
                    return(
                        <div className={  el.url == urlLocal? "abaSelecionada" :  "aba" } onClick={() => {
                            redirecionar(el.url)
                        }}>
                            {el.nome}
                        </div>
                    )
                })
            }
            
        </div>
    )

}

export default Menulateral