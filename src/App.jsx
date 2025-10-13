// App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Components
import Login from './pages/Login';
import Home from './pages/Home';
import Order from './pages/Order';
import Product from './pages/Product';
import { CartProvider } from './context/CartContext';

const App = () => {
  const token = localStorage.getItem('user');

  return (
    <Router>
      <CartProvider>
        <Routes>
          {/* Redireciona automaticamente com base no token */}
          <Route
            path="/"
            element={
              token ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
            }
          />

          {/* Rotas públicas e privadas */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/tables" element={<PrivateRoute><Order /></PrivateRoute>} />
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/products" element={<PrivateRoute><Product /></PrivateRoute>} />
        </Routes>
      </CartProvider>
    </Router>
  );
};

// 🔒 Rota privada (só acessa se tiver token)
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('user');
  return token ? children : <Navigate to="/login" replace />;
};

// 🔓 Rota pública (se tiver token, redireciona)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('user');
  return token ? <Navigate to="/home" replace /> : children;
};

export default App;
