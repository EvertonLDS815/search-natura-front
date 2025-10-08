// Login.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import api from '../../config';
import IconUser from '../../assets/user-icon.svg';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const { data } = await api.post('/login', { login, password });

    // Salva token no localStorage
    localStorage.setItem('user', data.token);

    // Redireciona
    navigate('/products', { replace: true });
  } catch (err) {
    console.error('Erro completo do login:', err);
    alert(err.response?.data?.error || 'Erro ao fazer login');
    setError('Login e/ou senha inválidos!');
  }
};

  return (
    <div className="container-login">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="icon-div">
          <img src={IconUser} alt="Icon" />
        </div>
        <h3>Área administrativa</h3>
        <span>Faça login para gerenciar produtos</span>

        {/* Campo de login */}
        <input
          type="text"
          id="login"
          name="login"
          placeholder="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />

        {/* Campo de senha */}
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className='errormessage'>{error}</p>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
