import { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import cartIcon from "../../assets/cart-icon.png";
import formatCurrency from "../../utils/FormatCurrency";
import Trash from "../../assets/trash.svg";
import "./style.css";
import api from "../../config";
import { toast } from "react-toastify";
import { CateProdContext } from "../../context/CateProd";
import arrowUp from "../../assets/arrow-up.png";
import arrowDown from "../../assets/arrow-down.png";

const Cart = ({ open, toggleOpen }) => {
  const { cart, removeFromCart, clearCart, setCartOpen } = useContext(CartContext);
  const { fetchProducts } = useContext(CateProdContext);
  const [expanded, setExpanded] = useState(false);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Função para retornar o preço correto (promo ou normal)
  const getItemPrice = (item) => {
    return item.onSale && item.salePrice ? item.salePrice : item.price;
  };

  const handleCheckout = async () => {
  try {
    const items = cart.map(item => ({
      productId: item._id,
      quantity: item.quantity
    }));

    await api.post('/stock/out', { items });

    toast.success('Venda realizada com sucesso!');
    clearCart(); // 🔥 ISSO atualiza a UI

    fetchProducts(); // 🔥 ISSO atualiza o estoque na Home/Products
    setCartOpen(false); // fecha o carrinho após finalizar venda

  } catch (error) {
    const message =
      error.response?.data?.message ||
      'Erro ao finalizar venda!';

    toast.error(message);
  }
};

const handleCheckin = async () => {
  try {
    const items = cart.map(item => ({
      productId: item._id,
      quantity: item.quantity
    }));
    await api.post('/stock/in', { items });

    toast.success('Entrada registrada com sucesso!');
    clearCart();
    
    fetchProducts();
    setCartOpen(false);

  } catch (err) {
    const message =
      err.response?.data?.message ||
      'Erro ao registrar entrada!';
    toast.error(message);
    
  }
}


  return (
    <div className="cart-container">
      <div className="cart-icon-wrapper" onClick={toggleOpen}>
        <img src={cartIcon} alt="Carrinho" className="cart-icon" />
        {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
      </div>

      {open && (
        <div className={`cart-dropdown ${expanded ? "expanded" : ""}`}>
          {cart.length === 0 ? (
            <p>Seu carrinho está vazio</p>
          ) : (
            <ul>
              {cart.map((item) => (
                <li key={item._id}>
                  <div className="cart-item-info">
                    <div>
                      <img src={item.imageURL} alt={item.name} className="cart-item-image"/>
                      {item.quantity}x {item.name}
                    </div>
                    <button className="remove-item-btn" onClick={() => removeFromCart(item._id)}>
                      <img src={Trash} alt="Remover" />
                    </button>
                  </div>
                  <strong>{formatCurrency(getItemPrice(item) * item.quantity)}</strong>
                </li>
              ))}
            </ul>
          )}
          <div className="cart-total">
            <strong>Total: </strong>
            {formatCurrency(cart.reduce((acc, item) => acc + getItemPrice(item) * item.quantity, 0))}
          </div>

          {cart.length > 0 && (
            <>
              <div className="cart-actions">
                <button className="checkout-btn" onClick={handleCheckout}>
                  Saída
                </button>
                <button className="clear-cart-btn" onClick={clearCart}>
                  Limpar
                </button>
                <button className="checkin-btn" onClick={handleCheckin}>
                  Entrada
                </button>
              </div>

            </>
          )}
        </div>
      )}
      {open && cart.length > 3 && window.innerWidth < 600 && (
        <button 
          className="arrow-cart-btn"
          onClick={() => setExpanded(prev => !prev)}
        >
          <img 
            src={expanded ? arrowUp : arrowDown} 
            alt="Expandir/Recolher" 
          />
        </button>
      )}
    </div>
  );
};

export default Cart;
