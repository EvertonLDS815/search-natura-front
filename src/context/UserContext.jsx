// src/context/UserContext.jsx
import { createContext, useState, useEffect } from "react";
import api from "../config";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("user"));

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
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    setUser(null);
    setToken(null);
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
