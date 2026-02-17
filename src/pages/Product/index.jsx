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
          <svg xmlns="http://www.w3.org/2000/svg" className="x-svg" onClick={() => setSearchTerm('')}
            xmlns:xlink="http://www.w3.org/1999/xlink"
            fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1"
            viewBox="0 0 460.775 460.775" xml:space="preserve">
            <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55  c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55  c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505  c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55  l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719  c6.074-6.075,6.-074-15.-909,0-21.-986L285.-08,-230.-397z"/>
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
