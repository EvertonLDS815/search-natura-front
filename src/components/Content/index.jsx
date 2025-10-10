  import api from "../../config";
  import FormatCurrency from "../../utils/FormatCurrency";
  import Trash from '../../assets/trash.svg';
  import CheckOrder from '../../assets/check-order.png';
  import './style.css';


  const Content = ({product, onFetchProducts}) => {

    const handleDelete = async () => {
      if (window.confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
        try {
          await api.delete(`/product/${product._id}`);
          alert('Produto excluído com sucesso!');
          onFetchProducts(); // Atualiza a lista de produtos após a exclusão
        } catch (error) {
          console.error('Erro ao excluir produto:', error);
          alert('Erro ao excluir o produto. Tente novamente.');
        }
      }
    };


      return (
    <>
      <div key={product._id} className="content-product">
        <div className="content-product-info">
          <h3>{product.name}</h3>
          <a href={product.imageURL} target="_blank" rel="noopener noreferrer">
            <img src={product.imageURL} alt={product.name} />
          </a>
        </div>
        <div className="content-product-actions">
          <span>{FormatCurrency(product.price)}</span>
          <button className="btn-delete" onClick={handleDelete}>
            <img src={Trash} alt="Excluir" />
          </button>
        </div>
      </div>
    </>
  );
  }

  export default Content;