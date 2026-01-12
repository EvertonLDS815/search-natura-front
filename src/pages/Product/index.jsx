// Product.js
import { useState, useEffect } from "react";
import api from "../../config";
import Header from "../../components/Header";
import Content from "../../components/Content";
import DrawerAddProduct from "../../components/Drawer";
import "./style.css";
import "../Home/style.css";

const Product = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [drawerOpen, setDrawerOpen] = useState(false);

  const normalize = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === "reloadProducts") {
        fetchProducts();
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, []);



  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
    } catch (error) {
      console.error("Erro categorias:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products");
      setAllProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Erro produtos:", error);
    }
  };

  useEffect(() => {
    let filtered = [...allProducts];

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((p) =>
        normalize(p.name).includes(normalize(searchTerm))
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, allProducts]);

  const handleSelectChange = (e) => {
  setSelectedCategory(e.target.value);
  setSearchTerm(""); // limpa campo de busca
};

  return (
    <>
      <Header />

      <div className="top-actions">
        <button className="btn-add" onClick={() => setDrawerOpen(true)}>
          + Adicionar Produto
        </button>
      </div>

      <DrawerAddProduct
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSuccess={fetchProducts}
      />

      <div className="search">
        <form className="relative-input" onSubmit={(e) => e.preventDefault()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            className="lucide lucide-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
            aria-hidden="true">
            <path d="m21 21-4.34-4.34"></path>
            <circle cx="11" cy="11" r="8"></circle>
          </svg>
          <input
            type="text"
            placeholder="Buscar produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <select onChange={handleSelectChange} value={selectedCategory}>
          <option value="all">Todos</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="container">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Content
              key={product._id}
              product={product}
              mode="admin"
              onFetchProducts={fetchProducts}
            />
          ))
        ) : (
          <p style={{ width: "100%", textAlign: "center" }}>
            Nenhum produto encontrado.
          </p>
        )}
      </div>
    </>
  );
};

export default Product;
