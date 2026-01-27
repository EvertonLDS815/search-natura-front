import { useState, useEffect } from "react";
import Header from "../../components/Header";
import api from "../../config";
import "./style.css";
import { toast } from "react-toastify";

const Settings = () => {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([]);
  const [productCode, setProductCode] = useState("");
  const [stock, setStock] = useState("");


  useEffect(() => {
    fetchCategories();
    fetchCategoryTotals();
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
    if (!name.trim()) return toast.info("Digite um nome de categoria!");

    try {
      await api.post("/category", { name });
      setName("");
      fetchCategories();
      return toast.success(<div>Categoria <strong>{name}</strong> criada com sucesso!</div>)
    } catch (err) {
      console.error("Erro ao criar categoria:", err);
    }
  };

  const handleDeleteCategory = async (id, name) => {
  const confirmToast = toast.info(
    <div>
      <p>Tem certeza que deseja excluir a categoria <strong>{name}</strong>?</p>
      <div style={{ marginTop: "10px", display: "flex", gap: "10px"}}>
        <button
          onClick={async () => {
            toast.dismiss(confirmToast); // fecha o toast
            try {
              await api.delete(`/category/${id}`);
              fetchCategories();
              return toast.success("Categoria excluída com sucesso!");
            } catch (err) {
              toast.error("Erro ao excluir a categoria.");
              return console.error(err);
            }
          }}
          style={{
            background: "#d9534f",
            border: "none",
            color: "#fff",
            padding: "6px 10px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Confirmar
        </button>

        <button
          onClick={() => toast.dismiss(confirmToast)}
          style={{
            background: "#6c757d",
            border: "none",
            color: "#fff",
            padding: "6px 10px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Cancelar
        </button>
      </div>
    </div>,
    {
      position: "top-right",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
    }
  );
};

  const fetchCategoryTotals = async () => {
    try {
      const res = await api.get("/categories/total-price");
      setData(res.data);
    } catch (err) {
      console.error("Erro ao buscar totais por categoria", err);
    }
  };

  const totalGeral = data.reduce((acc, item) => {
      return acc + item.totalPrice;
    }, 0);



  const handleAddProductRule =  async (e) => {
    e.preventDefault();

    try {
       if (!productCode) {
      return toast.info("Digite o código do produto");
    }

    
    await api.post("/product/add-stock", {
      code: Number(productCode),
      quantity: Number(stock)
    });
    
    if (!stock) {
      return toast.info("Digite a Quantidade!");
    }
    // por enquanto só visual

    toast.success("Quantidade Atualizada!");

    setProductCode("");
    setStock("");
    } catch (err) {
      console.error(err);
      return toast.error(err.response?.data?.message || "Erro ao atualizar quantidade" );
    }
  };


  return (
    <>
    <Header />
    <div className="category-page">
        <div className="form-container">
            <h2>Configuração de Produto</h2>

            <form onSubmit={handleAddProductRule} className="two-input-form">
              <input
                type="number"
                placeholder="Código do Produto"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
              />

              <input
                type="number"
                placeholder="Quantidade"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />

              <button type="submit">Adicionar</button>
            </form>

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
                        onClick={() => handleDeleteCategory(cat._id, cat.name)}
                        >
                        Excluir
                    </button>
                    </li>
                ))}
                </ul>
        </div>

        <div className="table-container">
          <h2>Resumo por Categoria</h2>

          {data.length === 0 ? (
            <p className="empty">Nenhuma categoria com produtos em estoque.</p>
          ) : (
            <table className="category-table">
              <thead>
                <tr>
                  <th>Categoria</th>
                  <th>Qtd. Produtos</th>
                  <th>Total em Estoque</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item._id}>
                    <td>{item.categoryName}</td>
                    <td>{item.totalProducts}</td>
                    <td>
                      {item.totalPrice.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="table-total">
            <h3>Total:</h3>
            <strong>
              {totalGeral.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </strong>
          </div>

        </div>


    </div>
        </>
  );
};

export default Settings;
