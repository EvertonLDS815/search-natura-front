import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../config";
import logOut from "../../assets/log-out.svg";
import menuIcon from "../../assets/menu.svg";
import "./style.css";
import Cart from "../Cart";

const Header = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false); // controle do mini-cart
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await api.get("/user");
      setUser(Array.isArray(data) ? data[0] : data);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (!menuOpen) setCartOpen(false); // fecha o cart se abrir o menu
  };

  const toggleCart = () => {
    setCartOpen(!cartOpen);
    if (!cartOpen) setMenuOpen(false); // fecha o menu se abrir o cart
  };

  return (
    <header className="header">
      {/* Esquerda */}
      <div className="header-left" onClick={() => navigate("/profile")}>
        {user?.imageURL ? (
          <img src={user.imageURL} alt={user.name} className="user-image" />
        ) : (
          <div className="user-placeholder"></div>
        )}
        <span>{user?.name || "Usuário"}</span>
      </div>

      {/* Centro */}
      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        <a href="/products">Produtos</a>
        <a href="/categories">Categorias</a>
        <a href="/users">Usuários</a>
        <a href="/login" onClick={handleLogout} className="a-logout">Sair</a>
      </nav>

      {/* Direita */}
      <div className="header-right">
        <Cart open={cartOpen} setOpen={toggleCart} /> {/* passar estado e toggle */}
        <button onClick={handleLogout} className="logout-button">
          <img src={logOut} alt="Sair" />
        </button>
        <button className="menu-toggle" onClick={toggleMenu}>
          <img src={menuIcon} alt="Menu" />
        </button>
      </div>
    </header>
  );
};

export default Header;
