import { Link } from 'react-router-dom';
import { IoStar, IoCart } from 'react-icons/io5';
import { useCart } from '../../contexts/CartContext';
import { formatCOP } from '../../data/mockData';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();

  return (
    <div className="card-product group">
      <Link to={`/producto/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {!product.available && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm">
                Agotado
              </span>
            </div>
          )}
          {product.discount && product.available && (
            <span className="badge-discount absolute left-3 top-3 shadow-lg">
              -{product.discount}%
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/producto/${product.id}`}>
          <h3 className="font-serif font-bold text-text-primary hover:text-brand-primary transition-colors line-clamp-2 text-lg">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-1 text-sm">
          <IoStar className="text-brand-accent fill-current" />
          <span className="font-medium text-text-primary">{product.rating}</span>
          <span className="text-text-muted">({product.reviewCount})</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            {product.discount ? (
              <div className="flex flex-col">
                <span className="font-bold text-brand-primary text-lg">
                  {formatCOP(product.price * (1 - product.discount / 100))}
                </span>
                <span className="text-xs text-text-muted line-through">
                  {formatCOP(product.price)}
                </span>
              </div>
            ) : (
              <span className="font-bold text-brand-primary text-lg">
                {formatCOP(product.price)}
              </span>
            )}
          </div>

          <button
            disabled={!product.available}
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-primary text-white hover:bg-brand-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            <IoCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
