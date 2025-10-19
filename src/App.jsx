// App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Components
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Product from './pages/Product';
import EditProduct from './pages/EditProduct';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import Header from './components/Header';

const App = () => {
  const token = localStorage.getItem('user');

  return (
    <Router>
      <UserProvider>
        <CartProvider>
          <Routes>
            {/* Redireciona automaticamente com base no token */}
            <Route
              path="/"
              element={
                token ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
              }
            />

            {/* Rota pública: login */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

            {/* Rotas privadas com Header */}
            <Route
              element={<PrivateLayout />} // Layout com Header
            >
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/products" element={<Product />} />
              <Route path="/edit-product/:id" element={<EditProduct />} />
            </Route>
          </Routes>
        </CartProvider>
      </UserProvider>
    </Router>
  );
};

// Layout privado com Header
import { Outlet } from 'react-router-dom';
const PrivateLayout = () => (
  <>
    <Header />
    <Outlet />
  </>
);

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
