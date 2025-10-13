import { useState, useEffect } from "react";
import api from "../../config";
import Header from "../../components/Header";
import "./style.css";

const Product = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Busca categorias do backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        setCategories(data);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !image || !category) {
      alert("Preencha todos os campos!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("image", image);

      await api.post("/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Produto cadastrado com sucesso!");
      setName("");
      setPrice("");
      setCategory("");
      setImage(null);
      setPreview(null);
    } catch (error) {
      console.error("❌ Erro ao cadastrar produto:", error);
      alert("Erro ao cadastrar produto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="product-page">
        <h2>Cadastrar Produto</h2>

        <form className="product-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Nome do Produto</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Kaiak 100ml"
            required
          />

          <label htmlFor="price">Preço (R$)</label>
          <input
            id="price"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Ex: 185.50"
            required
          />

          <label htmlFor="category">Categoria</label>
          <select
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

          <label>Imagem do Produto</label>
          <div className="file-upload">
            <input
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
    </>
  );
};

export default Product;
