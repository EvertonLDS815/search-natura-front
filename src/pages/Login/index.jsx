// Login.js
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import api from '../../config';
import El2 from '../../assets/logo.png';
import EyeOpen from '../../assets/eye-open-shari.png';   // 👁️ ícone olho aberto
import EyeClosed from '../../assets/eye-closed.png';
import { UserContext } from '../../context/UserContext';
import { toast } from 'react-toastify';
import ClickSound from '../../assets/sharingan.mp3';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { fetchUser } = useContext(UserContext); // pega setUser do contexto

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/login", { login, password });

      // salva token
      localStorage.setItem("user", data.token);

      // fetch do usuário logado e atualiza contexto
      await fetchUser();   // já vai chamar setUser dentro do UserContext

      navigate("/home", { replace: true });
      return toast.success(<div>Olá <strong>{data.user.name}!!</strong></div>);
    } catch (err) {
      console.error("Erro completo do login:", err);
      toast.error("Login ou Senha incorretos!!");
      setError("Login e/ou senha inválidos!");
    }
  };

  const handleShowPassword = () => {
    const newShow = !showPassword;
    setShowPassword(newShow);

    // Toca som apenas quando estiver abrindo a senha
    if (newShow) {
      const audio = new Audio(ClickSound);
      audio.play();
    }
  };

  return (
    <div className="container-login">
      <form onSubmit={handleLogin} className="login-form">
        <div className="icon-div">
          <img src={El2} alt="Icon" />
        </div>
        <h3>Área Administrativa</h3>
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
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <img
            src={showPassword ? EyeOpen : EyeClosed}
            alt="Mostrar senha"
            className="toggle-password"
            onClick={handleShowPassword} // 👈 usa a função aqui
          />
        </div>

        {error && <p className="errormessage">{error}</p>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
