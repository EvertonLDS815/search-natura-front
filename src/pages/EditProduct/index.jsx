import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../config";
import Header from "../../components/Header";
import "./style.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    imageURL: ""
  });
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔧 Busca produto e categorias ao montar
  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [id]);

  // 🔹 Busca produto e ajusta o category para _id
  const fetchProduct = async () => {
    try {
      const res = await api.get(`/product/${id}`);
      const productData = res.data;
      setProduct({
        ...productData,
        category: productData.category?._id || productData.category || ""
      });
      setPreview(productData.imageURL); // mostra imagem atual
    } catch (err) {
      console.error("Erro ao buscar produto:", err);
      alert("Erro ao carregar produto.");
    }
  };

  // 🔹 Busca categorias disponíveis
  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  // 🔹 Atualiza campos do produto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // 🔹 Atualiza imagem localmente
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // mostra nova imagem
    }
  };

  // 🔹 Envia atualização
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("category", product.category);
      if (image) formData.append("image", image);

      await api.patch(`/product/${id}`, formData);

      alert("✅ Produto atualizado com sucesso!");
      navigate("/products");
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      alert("❌ Falha ao atualizar o produto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="edit-container-page">
        <h2>Editar Produto</h2>

        <form className="product-form" onSubmit={handleSubmit}>
          <label>Nome</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />

          <label>Preço (R$)</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
          />

          <label>Categoria</label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
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
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditProduct;
