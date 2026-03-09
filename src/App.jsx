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
import { CateProdProvider } from './context/CateProd';
import Settings from './pages/Settings';

const App = () => {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <CateProdProvider>
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
                <Route path="/settings" element={<Settings />} />
              </Route>

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </CartProvider>
        </UserProvider>
      </CateProdProvider>
    </Router>
  );
};

// Layout privado com Header
import { Outlet } from 'react-router-dom';
const PrivateLayout = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return (
    <>
      {children}
      <Outlet />
    </>
  );
};

// 🔓 Rota pública (se tiver token, redireciona)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/home" replace /> : children;
};

export default App;
