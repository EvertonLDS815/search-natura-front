import { useContext } from "react";
import api from "../../config";
import FormatCurrency from "../../utils/FormatCurrency";
import { CartContext } from "../../context/CartContext";
import trashIcon from "../../assets/trash.svg";
import editIcon from "../../assets/edit.svg";
import "./style.css";

const Content = ({ product, mode, onFetchProducts }) => {
  const { addToCart } = useContext(CartContext);

  const handleDelete = async () => {
    if (window.confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
      try {
        await api.delete(`/product/${product._id}`);
        alert('Produto excluído com sucesso!');
        if (onFetchProducts) onFetchProducts(); // Atualiza a lista de produtos
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        alert('Erro ao excluir o produto. Tente novamente.');
      }
    }
  };

  const handleEdit = () => {
    // Aqui você pode redirecionar para uma página de edição
    window.location.href = `/edit-product/${product._id}`;
  };

  return (
    <div key={product._id} className="content-product">
      <div className="content-product-info">
        <h3>{product.name}</h3>
        <a href={product.imageURL} target="_blank" rel="noopener noreferrer">
          <img src={product.imageURL} alt={product.name} />
        </a>
      </div>

      <div className="content-product-actions">
        <span>{FormatCurrency(product.price)}</span>

        {mode === "cart" && (
          <button className="btn-add-cart" onClick={() => addToCart(product)}>+</button>
        )}

        {mode === "admin" && (
          <>
          <div>
            <button className="btn-edit" onClick={handleEdit}>
              <img src={editIcon} alt="Editar" />
            </button>
            <button className="btn-delete" onClick={handleDelete}>
              <img src={trashIcon} alt="Excluir" />
            </button>
          </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Content;
