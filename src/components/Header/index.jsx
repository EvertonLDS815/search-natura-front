import { useNavigate } from "react-router-dom";
import logOut from '../../assets/log-out.svg';
import { useEffect, useState } from "react";
import './style.css';
import api from "../../config";

const Header = () => {
  const [user, setUser] = useState([]); // começa vazio
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await api.get('/user');
      console.log('Usuário autenticado:', data);
      setUser(Array.isArray(data) ? data : [data]); // garante formato array
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Se ainda não carregou o usuário, evita erro
  if (user.length === 0) {
    return (
      <header className="header">
        <h2>Carregando...</h2>
      </header>
    );
  }

  const currentUser = user[0]; // pega o primeiro usuário

  return (
    <header className="header">
      {currentUser?.imageURL && (
        <div className="user-image-container">
            <img
              src={currentUser.imageURL}
              alt={currentUser.name || 'Usuário'}
              className="user-image"
              />
          </div>
      )}
      <h2
        style={{ cursor: 'pointer' }}
        onClick={() => navigate('/products')}
      >
        {currentUser?.name || 'Usuário'}
      </h2>
      <button onClick={handleLogout}>
        <img src={logOut} alt="Sair" />
      </button>
    </header>
  );
};

export default Header;
