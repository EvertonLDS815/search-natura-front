import { createContext, useState } from "react";
import api from "../config";
export const CateProdContext = createContext();

export const CateProdProvider = ({ children }) => {
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
    if (!navigator.onLine) {
        const cached = localStorage.getItem("categories-cache");
        if (cached) {
            setCategories(JSON.parse(cached));
        }
        return;
    }

    try {
        const { data } = await api.get("/categories");
        setCategories(data);
        localStorage.setItem("categories-cache", JSON.stringify(data));
    } catch (error) {
        console.error("Erro categorias:", error);

        const cached = localStorage.getItem("categories-cache");
        if (cached) {
        setCategories(JSON.parse(cached));
        }
    }
};

  const fetchProducts = async () => {
    if (!navigator.onLine) {
        const cached = localStorage.getItem("products-cache");
        if (cached) {
        const parsed = JSON.parse(cached);
        setAllProducts(parsed);
        setFilteredProducts(parsed);
        console.log("Produtos carregados do cache");
        }
        return;
    }

  try {
    const { data } = await api.get("/products");

      setAllProducts(data);
      setFilteredProducts(data);

      localStorage.setItem("products-cache", JSON.stringify(data));
      console.log("Produtos atualizados do servidor");
    } catch (error) {
      console.error("Erro produtos:", error);

      const cached = localStorage.getItem("products-cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        setAllProducts(parsed);
        setFilteredProducts(parsed);
        console.log("Fallback para cache");
      }
    }
  };


  return (
      <CateProdContext.Provider
        value={{
            allProducts,
            filteredProducts,
            categories,
          fetchProducts,
          fetchCategories
        }}
      >
        {children}
      </CateProdContext.Provider>
    );
  }