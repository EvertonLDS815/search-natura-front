import { useNavigate } from "react-router-dom";
import "./style.css";

const DrawerMenu = ({ open, onClose, logout }) => {

  const navigate = useNavigate();

  const go = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className={`drawer ${open ? "open" : ""}`}>

      <div className="drawer-overlay" onClick={onClose} />

      <div className="drawer-content">

        <div className="drawer-header">
          <h2>Menu</h2>

          <button
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            ✕
          </button>
        </div>

        <nav className="drawer-menu">

          <button onClick={() => go("/home")}>
            Home
          </button>

          <button onClick={() => go("/products")}>
            Produtos
          </button>

          <button onClick={() => go("/profile")}>
            Perfil
          </button>

          <button onClick={() => go("/settings")}>
            Configurações
          </button>

          <button className="logout-btn" onClick={logout}>
            Sair
          </button>

        </nav>

      </div>

    </div>
  );
};

export default DrawerMenu;