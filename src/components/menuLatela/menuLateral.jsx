import "./menuLateral.css";

const Menulateral = () => {
  const urlAtual = window.location.pathname;

  const redirecionar = (rota) => {
    if (rota !== urlAtual) {
      window.location.href = rota;
    }
  };

  const abas = [
    { id: 2, nome: "Entrada", url: "/entrada" },
    { id: 3, nome: "Produtos", url: "/produtos" },
    { id: 4, nome: "Dashboard", url: "/index" },
    { id: 5, nome: "Caixa", url: "/fluxo" },
  ];

  return (
    <aside className="container-menu">
      <nav className="sub-container-menu">
        {abas.map((el) => (
          <div
            key={el.id}
            className={`aba ${el.url === urlAtual ? "abaSelecionada" : ""}`}
            onClick={() => redirecionar(el.url)}
          >
            {el.nome}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Menulateral;
