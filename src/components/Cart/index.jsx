import { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import cartIcon from "../../assets/cart-icon.png";
import formatCurrency from "../../utils/FormatCurrency";
import Trash from "../../assets/trash.svg";
import "./style.css"; // CSS para dropdown

const Cart = () => {
  const { cart, removeFromCart } = useContext(CartContext);
  const [open, setOpen] = useState(false);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="cart-container">
      <div className="cart-icon-wrapper" onClick={() => setOpen(!open)}>
        <img src={cartIcon} alt="Carrinho" className="cart-icon" />
        {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
      </div>

      {open && (
        <div className="cart-dropdown">
          {cart.length === 0 ? (
            <p>Seu carrinho está vazio</p>
          ) : (
            <ul>
              {cart.map((item) => (
                <li key={item._id}>
                  <div className="cart-item-info">
                  <img src={item.imageURL} alt={item.name} className="cart-item-image" />
                  {item.quantity}x {item.name} 
                  <button className="remove-item-btn" onClick={() => removeFromCart(item._id)}>
                    <img src={Trash} />
                  </button>
                  </div>
                  <strong>{formatCurrency(item.price * item.quantity)}</strong>
                </li>
              ))}
            </ul>
          )}
          <div className="cart-total">
            <strong>Total: </strong>
            {formatCurrency(cart.reduce((acc, item) => acc + item.price * item.quantity, 0))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
