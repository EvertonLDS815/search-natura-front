import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../config";
import Header from "../../components/Header";
import "./style.css";
import { toast } from "react-toastify";

const EditProduct = () => {
  const { id } = useParams();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    salePrice: "",
    onSale: false,
    category: "",
    imageURL: ""
  });
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/product/${id}`);
      const productData = res.data;

      // Converte onSale para boolean
      setProduct({
        ...productData,
        category: productData.category?._id || productData.category || "",
        salePrice: productData.salePrice || "",
        onSale: productData.onSale === "true" || productData.onSale === true
      });

      setPreview(productData.imageURL);
    } catch (err) {
      console.error("Erro ao buscar produto:", err);
      alert("Erro ao carregar produto.");
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleSale = (e) => {
    const checked = e.target.checked;
    setProduct((prev) => ({
      ...prev,
      onSale: checked,
      salePrice: checked ? prev.salePrice : "" // limpa salePrice se desmarcado
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    localStorage.setItem(
      "reloadProducts",
      JSON.stringify({ updatedAt: Date.now() })
    );

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", Number(product.price));
      formData.append("stock", Number(product.stock));
      formData.append("category", product.category);
      formData.append("code", product.code);
      formData.append("onSale", product.onSale ? "true" : "false");

      if (product.onSale && product.salePrice) {
        formData.append("salePrice", Number(product.salePrice));
      }

      if (image) formData.append("image", image);

      await api.patch(`/product/${id}`, formData);

      // navigate("/products");
      window.close(`/edit-product/${id}`, "_blank");
    } catch (error) {
      console.error("Erro ao atualizar produto:", error.response?.data || error);
      return toast.error("Falha ao atualizar o produto.");
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

          <label>Estoque</label>
          <input
            type="number"
            name="stock"
            value={product.stock}
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

          {/* Toggle de promoção */}
          <label className="switch">
            <input
              type="checkbox"
              checked={product.onSale}
              onChange={handleToggleSale}
            />
            Em promoção
            <span className="slider"></span>
          </label>

          {/* Preço promocional */}
          {product.onSale && (
            <>
              <label>Preço Promocional (R$)</label>
              <input
                type="number"
                step="0.01"
                name="salePrice"
                value={product.salePrice}
                onChange={handleChange}
              />
            </>
          )}

          <label>Código</label>
          <input
            type="number"
            name="code"
            value={product.code}
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
