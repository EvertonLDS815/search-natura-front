// src/context/UserContext.jsx
import { createContext, useState, useEffect } from "react";
import api from "../config";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const { data } = await api.get("/user");
      setUser(Array.isArray(data) ? data[0] : data);
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};
