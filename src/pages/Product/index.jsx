import { useState, useEffect } from "react";
import api from "../../config";
import Header from "../../components/Header";
import "./style.css";
import "../Home/style.css";
import Content from "../../components/Content";

const Product = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [onSale, setOnSale] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        setCategories(data);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products");
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!name || !price || !image || !category) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("image", image);
      formData.append("onSale", onSale);
      if (onSale && salePrice) {
        formData.append("salePrice", salePrice);
      }

      await api.post("/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Produto cadastrado com sucesso!");
      setName("");
      setPrice("");
      setCategory("");
      setImage(null);
      setPreview(null);
      setOnSale(false);
      setSalePrice("");
      fetchProducts();
    } catch (error) {
      console.error("❌ Erro ao cadastrar produto:", error);
      alert("Erro ao cadastrar produto.");
    } finally {
      setLoading(false);
    }
  };

  function fetchProductsByCategory(categoryId) {
    api
      .get(`/products/category/${categoryId}`)
      .then(({ data }) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch((error) => {
        console.error("Erro ao buscar produtos por categoria:", error);
      });
  }

  const handleSelectChange = (e) => {
    const value = e.target.value;
    if (value === "all") {
      fetchProducts();
    } else {
      const categoryId = categories[value - 1]._id;
      fetchProductsByCategory(categoryId);
    }
    setSearchTerm("");
  };

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
  };

  return (
    <>
      <Header />
      <div className="container-page">
        <h2>Cadastrar Produto</h2>

        <form className="product-form" onSubmit={handleCreateProduct}>
          <label htmlFor="name">Nome do Produto</label>
          <input
            name="name"
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Kaiak 100ml"
            required
          />

          <label htmlFor="price">Preço (R$)</label>
          <input
            name="price"
            id="price"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Ex: 185.50"
            required
          />

          {/* Checkbox: Produto em promoção */}
          <label className="switch">
            <input
              type="checkbox"
              checked={onSale}
              onChange={(e) => setOnSale(e.target.checked)}
            />
              Em promoção
            <span className="slider"></span>
          </label>

          {/* Campo adicional: preço promocional */}
          {onSale && (
            <>
              <label htmlFor="salePrice">Preço Promocional (R$)</label>
              <input
                name="salePrice"
                id="salePrice"
                type="number"
                step="0.01"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="Ex: 149.90"
              />
            </>
          )}

          <label htmlFor="category">Categoria</label>
          <select
            name="category"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <label htmlFor="fileInput">Imagem do Produto</label>
          <div className="file-upload">
            <input
              name="image"
              type="file"
              id="fileInput"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
            <label htmlFor="fileInput" className="file-label">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview do produto"
                  className="file-preview"
                />
              ) : (
                <span>+</span>
              )}
            </label>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Cadastrar Produto"}
          </button>
        </form>
      </div>

      <div className="search">
        <form className="relative-input" onSubmit={(e) => e.preventDefault()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
            aria-hidden="true"
          >
            <path d="m21 21-4.34-4.34"></path>
            <circle cx="11" cy="11" r="8"></circle>
          </svg>
          <input
            type="text"
            name="input-product"
            placeholder="Buscar produto pelo nome..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </form>
        <select
          name="category"
          id="category"
          onChange={handleSelectChange}
          defaultValue=""
        >
          <option key={0} value="all">
            Todos
          </option>
          {categories.map((category, index) => (
            <option key={category._id} value={index + 1}>
              {category.name}
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
              onFetchProducts={fetchProducts}
              mode="admin"
            />
          ))
        ) : (
          <p
            style={{
              textAlign: "center",
              width: "100%",
              marginTop: "1rem",
            }}
          >
            Nenhum produto encontrado.
          </p>
        )}
      </div>
    </>
  );
};

export default Product;
