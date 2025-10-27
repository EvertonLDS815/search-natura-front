import { useState, useEffect } from "react";
import Header from "../../components/Header";
import api from "../../config";
import "./style.css";

const Category = () => {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Erro ao buscar categorias:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Digite um nome de categoria!");

    try {
      await api.post("/category", { name });
      setName("");
      fetchCategories();
    } catch (err) {
      console.error("Erro ao criar categoria:", err);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) return;

    try {
      await api.delete(`/category/${id}`);
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
    } catch (err) {
      console.error("Erro ao excluir categoria:", err);
    }
  };

  return (
    <>
    <Header />
    <div className="category-page">
        <div className="form-container">
            <h2>Criar Categoria</h2>
            <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Nome da categoria"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button type="submit">Adicionar</button>
            </form>
        </div>

        <div className="list-container">
                <h2>Lista de Categorias</h2>
                <ul>
                {categories.map((cat) => (
                    <li key={cat._id}>
                    <div className="category-info">
                        <strong>{cat.name}</strong>
                        <span>{new Date(cat.createdAt).toLocaleDateString()}</span>
                    </div>
                    <button
                        className="delete-btn"
                        onClick={() => handleDeleteCategory(cat._id)}
                        >
                        Excluir
                    </button>
                    </li>
                ))}
                </ul>
        </div>
    </div>
        </>
  );
};

export default Category;
