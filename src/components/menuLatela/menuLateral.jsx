import "./menuLateral.css";
import { useState } from "react";

const Menulateral = () => {
  const urlAtual = window.location.pathname;
  const [submenuAberto, setSubmenuAberto] = useState(false);

  const redirecionar = (rota) => {
    if (rota !== urlAtual) {
      window.location.href = rota;
    }
  };

  const toggleSubmenu = () => {
    setSubmenuAberto(!submenuAberto);
  };

  const abas = [
	{ id: 1, nome: "Dashboard", url: "/index" },
    { id: 2, nome: "Entrada", url: "/entrada" },
    { id: 3, nome: "Produtos", url: "/produtos" },
	{ id: 4, nome: "Fornecedores", url: "/fornecedores" },

    { 
      id: 5, 
      nome: "Caixa", 
      url: "/fluxo",
      submenus: [
        { id: 51, nome: "Fluxo de Caixa", url: "/fluxo" },
        { id: 52, nome: "Aporte", url: "/aporte" },
        { id: 53, nome: "Relatórios", url: "/relatorios-caixa" }
      ]
    },
  ];

  // Função para verificar se algum subitem está ativo
  const isSubmenuActive = (item) => {
    if (!item.submenus) return false;
    return item.submenus.some(sub => sub.url === urlAtual);
  };

  return (
    <aside className="container-menu">
      <nav className="sub-container-menu">
        {abas.map((el) => (
          <div key={el.id}>
            <div
              className={`aba 
                ${el.url === urlAtual || isSubmenuActive(el) ? "abaSelecionada" : ""} 
                ${el.submenus ? "tem-submenu" : ""}
              `}
              onClick={() => {
                if (el.submenus) {
                  toggleSubmenu();
                } else {
                  redirecionar(el.url);
                }
              }}
            >
              {el.nome}
              {el.submenus && (
                <span className={`seta ${submenuAberto ? "aberta" : ""}`}>
                  ▼
                </span>
              )}
            </div>
            
            {el.submenus && submenuAberto && (
              <div className="submenu">
                {el.submenus.map((sub) => (
                  <div
                    key={sub.id}
                    className={`aba submenu-item ${
                      sub.url === urlAtual ? "abaSelecionada" : ""
                    }`}
                    onClick={() => redirecionar(sub.url)}
                  >
                    {sub.nome}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Menulateral;