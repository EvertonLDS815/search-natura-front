// Product.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config';
import './style.css';
import Content from '../../components/Content';
import Header from '../../components/Header';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([])
  const navigate = useNavigate();

  // Função para buscar os pedidos
  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };
  
  // Executa apenas uma vez ao montar o componente
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Lida com o select
  const handleSelectChange = (e) => {
    const value = e.target.value;

    if (value === 'product') {
      navigate('/products');
    } else if (value === 'user') {
      navigate('/users');
    }
  };

  return (
    <>
      <Header />

      <div className="search">
        <select onChange={handleSelectChange} defaultValue="">
          <option value="" disabled>
            Selecione uma categoria
          </option>
          {categories.map((category, index) => (
            <option key={category._id} value={index + 1}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="container">
        {products.map((product) => (
          <Content key={product._id} product={product} onFetchProducts={fetchProducts} />
        ))}
      </div>
    </>
  );
};

export default Product;
