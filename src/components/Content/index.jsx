import { useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../config";
import FormatCurrency from "../../utils/FormatCurrency";
import { CartContext } from "../../context/CartContext";
import trashIcon from "../../assets/trash.svg";
import editIcon from "../../assets/edit.svg";
import { toast } from "react-toastify";
import "./style.css";

const Content = ({ product, mode = "cart", onFetchProducts }) => {
  const { addToCart } = useContext(CartContext);

  const handleDeleteProduct = (id, name) => {
  const toastId = toast.info(
    <div style={{ fontSize: "0.95rem" }}>
      <p>Tem certeza que deseja excluir <strong>{name}</strong>?</p>
      <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
        <button
          style={{
            background: "#ff4757",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "6px 12px",
            cursor: "pointer",
          }}
          onClick={async () => {
            toast.dismiss(toastId);
            try {
              const res = await api.delete(`/product/${id}`);

              if (res.status === 200 || res.status === 204) {
                toast.success(`Produto "${name}" excluído com sucesso!`);
                onFetchProducts(); // atualiza lista
              } else {
                toast.error("Erro inesperado ao excluir o produto.");
              }
            } catch (err) {
              console.error("Erro ao excluir produto:", err);
              toast.error("Erro ao excluir produto. Tente novamente.");
            }
          }}
        >
          Sim
        </button>

        <button
          style={{
            background: "#6c757d",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "6px 12px",
            cursor: "pointer",
          }}
          onClick={() => toast.dismiss(toastId)}
        >
          Cancelar
        </button>
      </div>
    </div>,
    {
      autoClose: false,
      closeOnClick: false,
      draggable: false,
    }
  );
};

  // ✅ Garantir que os preços sejam números
  const price = Number(product.price);
  const stock = Number(product.stock);
  const salePrice = product.salePrice != null ? Number(product.salePrice) : null;
  const onSale = product.onSale === true || product.onSale === "true";
  const isOnSale = onSale && salePrice != null && salePrice !== price;

  return (
    <div className="content-product">
      <div className="content-product-info">
        <h3 style={product.stock === 0 ? {color: '#d32f2f'} : {color: 'black'}}>{product.name}</h3>
        <a href={product.imageURL} target="_blank" rel="noopener noreferrer">
          <img src={product.imageURL} alt={product.name} />
        </a>
      </div>

        {mode === "admin" && <span className="label-stock">Estoque: {stock}</span>}
      <div className="content-product-actions">
        {isOnSale ? (
          <div className="price-container">
            <span className="old-price">{FormatCurrency(price)}</span>
            <span className="sale-price">{FormatCurrency(salePrice)}</span>
            {mode === "admin" && <span style={{color: '#39a339'}}>Código: {product.code}</span>}
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
            <Link to={`/edit-product/${product._id}`} target="_blank"
            className="btn-edit" title="Editar produto">
              <img src={editIcon} alt="Editar" />
            </Link>
            <button className="btn-delete" onClick={() => handleDeleteProduct(product._id, product.name)} title="Excluir produto">
              <img src={trashIcon} alt="Excluir" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Content;
