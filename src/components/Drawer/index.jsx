import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../config";
import "./style.css";

const DrawerAddProduct = ({ open, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [stock, setStock] = useState("");
  const [onSale, setOnSale] = useState(false);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Carregar categorias ao abrir
  useEffect(() => {
    if (open) {
      api.get("/categories")
        .then(({ data }) => setCategories(data))
        .catch(() => toast.error("Erro ao carregar categorias"));
    }
  }, [open]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !category || !image) {
      toast.info("Preencha os campos obrigatórios!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", Number(price));
      formData.append("stock", Number(stock));
      formData.append("category", category);
      formData.append("onSale", onSale ? "true" : "false");
      formData.append("image", image);

      if (onSale) {
        formData.append("salePrice", Number(salePrice));
      }

      await api.post("/product", formData);

      toast.success("Produto cadastrado!");

      // Limpar campos
      setName("");
      setPrice("");
      setSalePrice("");
      setCategory("");
      setStock("");
      setOnSale(false);
      setImage(null);
      setPreview(null);

      onSuccess();
      onClose();

    } catch (err) {
      console.error(err);
      toast.error("Erro ao cadastrar produto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`drawer ${open ? "open" : ""}`}>
      <div className="drawer-overlay" onClick={onClose} />

      <div className="drawer-content">
        <div className="drawer-header">
          <h2>Cadastrar Produto</h2>
          <button
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Fechar formulário"
          >
            ✕
          </button>
        </div>

        <form className="drawer-form" onSubmit={handleSubmit}>
          
          <label>Nome</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            />

          <label>Estoque</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />

          <label>Preço</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />


          <label className="switch">
            <input
              type="checkbox"
              checked={onSale}
              onChange={(e) => setOnSale(e.target.checked)}
            />
            Em promoção
            <span className="slider"></span>
          </label>

          {onSale && (
            <>
              <label>Preço Promo</label>
              <input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
              />
            </>
          )}

          <label>Categoria</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Selecione</option>

            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <label>Imagem</label>
          <div className="file-upload">
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={handleImage}
            />

            <label htmlFor="fileInput" className="file-label">
              {preview ? (
                <img src={preview} className="drawer-preview" alt="Preview" />
              ) : (
                <span className="file-plus">+</span>
              )}
            </label>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DrawerAddProduct;
