// Product.js
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Content from "../../components/Content";
import DrawerAddProduct from "../../components/Drawer";
import "./style.css";
import "../Home/style.css";
import { CateProdContext } from "../../context/CateProd";
import { useContext } from "react";

const Product = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {fetchCategories, fetchProducts, allProducts, categories} = useContext(CateProdContext);

  const normalize = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();


  useEffect(() => {
    const loadInitialData = async () => {
      await fetchCategories();
      await fetchProducts();
    };

    loadInitialData();

    const handleOnline = () => {
      console.log("Conexão restaurada. Atualizando dados...");
      fetchCategories();
      fetchProducts();
    };

    window.addEventListener("online", handleOnline);

    return () => window.removeEventListener("online", handleOnline);
  }, []);

  useEffect(() => {
    let filtered = [...allProducts];

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchTerm.trim() !== "") {
      const searchWords = normalize(searchTerm).split(" ");

      filtered = filtered.filter((p) => {
      const productName = normalize(p.name);

      return searchWords.every(word =>
      productName.includes(word)
      );
      });
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
            className="search-svg lucide lucide-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
            aria-hidden="true">
            <path d="m21 21-4.34-4.34"></path>
            <circle cx="11" cy="11" r="8"></circle>
          </svg>
          <svg
              xmlns="http://www.w3.org/2000/svg"
              className="x-svg"
              onClick={() => setSearchTerm("")}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          <input
            type="text"
            placeholder="Buscar produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoCapitalize="none"
            autoCorrect="off"
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
