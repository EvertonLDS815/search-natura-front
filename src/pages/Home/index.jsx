// Product.js
import { useState, useEffect } from 'react';
import api from '../../config';
import './style.css';
import Content from '../../components/Content';
import Header from '../../components/Header';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // ← produtos filtrados
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // ← termo digitado

  // Buscar todos os produtos
  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
      setFilteredProducts(data); // inicia com todos
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  // Buscar categorias
  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Buscar produtos por categoria
  function fetchProductsByCategory(categoryId) {
    api.get(`/products/category/${categoryId}`)
      .then(({ data }) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch((error) => {
        console.error('Erro ao buscar produtos por categoria:', error);
      });
  }

  // Filtro por categoria
  const handleSelectChange = (e) => {
    const value = e.target.value;
    if (value === 'all') {
      fetchProducts();
    } else {
      const categoryId = categories[value - 1]._id;
      fetchProductsByCategory(categoryId);
    }
    setSearchTerm(''); // limpa o input ao mudar a categoria
  };

  // Filtro por nome (input)
  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
  };

  return (
    <>
      <Header />

      <div className="title-home">
        <h1>Produtos <span>Naturais</span></h1>
        <p>Descubra nossa seleção especial de produtos sustentáveis e ecológicos</p>
      </div>

      <div className="search">
        <form className="relative-input" onSubmit={(e) => e.preventDefault()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            className="lucide lucide-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
            aria-hidden="true">
            <path d="m21 21-4.34-4.34"></path>
            <circle cx="11" cy="11" r="8"></circle>
          </svg>
          <input
            type="text"
            name="input-product"
            placeholder="Digite um produto"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </form>

        <select name="category" id="category" onChange={handleSelectChange} defaultValue="">
          <option key={0} value="all">Todos</option>
          {categories.map((category, index) => (
            <option key={category._id} value={index + 1}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="container">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Content key={product._id} product={product} onFetchProducts={fetchProducts} mode="cart" />
          ))
        ) : (
          <p style={{ textAlign: 'center', width: '100%', marginTop: '1rem' }}>
            Nenhum produto encontrado.
          </p>
        )}
      </div>
    </>
  );
};

export default Home;
