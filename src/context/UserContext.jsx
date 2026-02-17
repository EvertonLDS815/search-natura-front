// src/context/UserContext.jsx
import { createContext, useState, useEffect } from "react";
import api from "../config";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const { data } = await api.get("/user");
      setUser(Array.isArray(data) ? data[0] : data);
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    navigate("/login");
  };

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setUser(null);
    }
  }, [token]);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser, logout, setToken }}>
      {children}
    </UserContext.Provider>
  );
};
