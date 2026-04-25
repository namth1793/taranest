import { Link } from 'react-router-dom';
import { ShoppingCart, Star, BadgePercent } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

function fmt(n) {
  return new Intl.NumberFormat('vi-VN').format(n) + 'đ';
}

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`Đã thêm "${product.name}" vào giỏ!`, { icon: '🛒' });
  };

  return (
    <Link to={`/san-pham/${product.slug}`}
      className="group bg-white rounded-2xl overflow-hidden card-shadow border border-gray-100 flex flex-col">
      <div className="relative overflow-hidden aspect-square bg-primary-50">
        <img src={product.image} alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={e => { e.target.src = 'https://placehold.co/400x400/FFF8EE/C8861A?text=Yến+Sào'; }} />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <BadgePercent size={11} /> -{discount}%
          </span>
        )}
        {product.is_bestseller === 1 && (
          <span className="absolute top-2 right-2 bg-primary-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            Bán Chạy
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-1 line-clamp-2 group-hover:text-primary-700 transition-colors">
          {product.name}
        </h3>

        {product.short_desc && (
          <p className="text-gray-400 text-xs mb-2 line-clamp-2">{product.short_desc}</p>
        )}

        <div className="flex items-center gap-1 mb-3 mt-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={11} className={i < Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
          ))}
          <span className="text-xs text-gray-400 ml-1">({product.reviews_count})</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-primary-600 font-bold text-base">{fmt(product.price)}</span>
            {product.original_price > product.price && (
              <span className="text-gray-400 text-xs line-through ml-1.5">{fmt(product.original_price)}</span>
            )}
            <span className="text-gray-400 text-xs ml-1">/{product.unit}</span>
          </div>
          <button onClick={handleAdd}
            className="w-8 h-8 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center transition-colors active:scale-90">
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>
    </Link>
  );
}
