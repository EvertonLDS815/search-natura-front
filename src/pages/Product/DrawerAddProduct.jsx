import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../config";

const DrawerAddProduct = ({ open, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [onSale, setOnSale] = useState(false);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // carregar categorias apenas ao abrir o drawer
  useState(() => {
    api.get("/categories").then(({ data }) => setCategories(data));
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!name || !price || !category || !image) {
      toast.info("Preencha todos os campos!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", Number(price));
      formData.append("category", category);
      formData.append("image", image);
      formData.append("onSale", onSale ? "true" : "false");

      if (onSale) formData.append("salePrice", Number(salePrice));

      await api.post("/product", formData);

      toast.success("Produto cadastrado!");

      // limpar
      setName("");
      setPrice("");
      setSalePrice("");
      setCategory("");
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

        <form className="drawer-form" onSubmit={submit}>
          <label>Nome</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />

          <label>Preço</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />

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
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Selecione</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
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
            <>
              <span className="file-plus">+</span>
              <p className="file-text">Adicionar imagem (opcional)</p>
            </>
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
