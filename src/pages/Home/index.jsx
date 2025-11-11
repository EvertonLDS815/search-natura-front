// Product.js
import { useState, useEffect } from 'react';
import api from '../../config';
import './style.css';
import Content from '../../components/Content';
import Header from '../../components/Header';

const Home = () => {
  const [allProducts, setAllProducts] = useState([]); // lista original
  const [filteredProducts, setFilteredProducts] = useState([]); // lista exibida
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Função para remover acentos
  const normalize = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // Buscar produtos
  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setAllProducts(data);
      setFilteredProducts(data);
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

  // Refiltrar automaticamente quando categoria ou texto mudar
  useEffect(() => {
    let filtered = [...allProducts];

    // Filtro por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (prod) => prod.category === selectedCategory
      );
    }

    // Filtro por texto
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter((prod) =>
        normalize(prod.name).includes(normalize(searchTerm))
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, allProducts]);

  // Input de busca
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Seleção de categoria
  const handleSelectChange = (e) => {
    setSelectedCategory(e.target.value);
    setSearchTerm('');
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
            autoCapitalize="none"
            autoCorrect="off"
          />
        </form>

        <select name="category" id="category" onChange={handleSelectChange} value={selectedCategory}>
          <option value="all">Todos</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
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
