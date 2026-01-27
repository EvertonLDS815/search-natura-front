import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import Cart from "../Cart";
import logOut from "../../assets/log-out.svg";
import menuIcon from "../../assets/menu.svg";
import "./style.css";

const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Resetar menu/cart quando mudar de rota
  useEffect(() => {
    setMenuOpen(false);
    setCartOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user"); // limpa o storage
    setUser(null);                   // limpa o estado global
    navigate("/login");              // redireciona
  };

  const toggleMenu = () => {
    setMenuOpen(prev => {
      const newState = !prev;
      if (newState) setCartOpen(false); // se abrir menu, fecha cart
      return newState;
    });
  };

  const toggleCart = () => {
    setCartOpen(prev => {
      const newState = !prev;
      if (newState) setMenuOpen(false); // se abrir cart, fecha menu
      return newState;
    });
  };


  return (
    <header className="header">
      <div className="header-left" onClick={() => navigate("/home")}>
        {user?.imageURL ? (
          <img src={user.imageURL} alt={user.name} className="user-image" />
        ) : (
          <div className="user-placeholder"></div>
        )}
        <span>{user?.name || "Usuário"}</span>
      </div>

      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        <a onClick={() => { navigate('/home'); setMenuOpen(false);}}>Home</a>
        <a onClick={() => { navigate('/products'); setMenuOpen(false);}}>Produtos</a>
        <a onClick={() => { navigate('/profile'); setMenuOpen(false);}}>Perfil</a>
        <a onClick={() => { navigate('/settings'); setMenuOpen(false);}}>Configurações</a>

        <a onClick={handleLogout} className="a-logout">Sair</a>
      </nav>

      <div className="header-right">
        <Cart open={cartOpen} toggleOpen={toggleCart} />
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
