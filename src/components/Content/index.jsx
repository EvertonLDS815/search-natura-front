import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config";
import FormatCurrency from "../../utils/FormatCurrency";
import { CartContext } from "../../context/CartContext";
import trashIcon from "../../assets/trash.svg";
import editIcon from "../../assets/edit.svg";
import "./style.css";

const Content = ({ product, mode = "cart", onFetchProducts }) => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
      try {
        await api.delete(`/product/${product._id}`);
        alert("✅ Produto excluído com sucesso!");
        if (onFetchProducts) onFetchProducts();
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
        alert("❌ Erro ao excluir o produto. Tente novamente.");
      }
    }
  };

  const handleEdit = () => {
    navigate(`/edit-product/${product._id}`);
  };

  // ✅ Garantir que os preços sejam números
  const price = Number(product.price);
  const salePrice = product.salePrice != null ? Number(product.salePrice) : null;
  const onSale = product.onSale === true || product.onSale === "true";
  const isOnSale = onSale && salePrice != null && salePrice !== price;

  return (
    <div className="content-product">
      <div className="content-product-info">
        <h3>{product.name}</h3>
        <a href={product.imageURL} target="_blank" rel="noopener noreferrer">
          <img src={product.imageURL} alt={product.name} />
        </a>
      </div>

      <div className="content-product-actions">
        {isOnSale ? (
          <div className="price-container">
            <span className="old-price">{FormatCurrency(price)}</span>
            <span className="sale-price">{FormatCurrency(salePrice)}</span>
          </div>
        ) : (
          <span className="normal-price">{FormatCurrency(price)}</span>
        )}

        {mode === "cart" && (
          <button
            className="btn-add-cart"
            onClick={() => addToCart({ ...product, price: isOnSale ? salePrice : price })}
            title="Adicionar ao carrinho"
          >
            +
          </button>
        )}

        {mode === "admin" && (
          <div className="admin-buttons">
            <button className="btn-edit" onClick={handleEdit} title="Editar produto">
              <img src={editIcon} alt="Editar" />
            </button>
            <button className="btn-delete" onClick={handleDelete} title="Excluir produto">
              <img src={trashIcon} alt="Excluir" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Content;
