import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Star, Shield, Truck, RotateCcw, Phone, Plus, Minus, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { getProduct } from '../lib/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

function fmt(n) { return new Intl.NumberFormat('vi-VN').format(n) + 'đ'; }

export default function ProductDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const { addItem } = useCart();

  useEffect(() => {
    setLoading(true);
    setQty(1);
    setActiveImg(0);
    getProduct(slug).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-gray-200 rounded-2xl aspect-square" />
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-10 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    </div>
  );

  if (!data) return (
    <div className="text-center py-24 text-gray-400">
      <p className="text-2xl mb-4">🫙</p>
      <p>Không tìm thấy sản phẩm</p>
      <Link to="/san-pham" className="mt-4 inline-block text-primary-600 hover:underline text-sm">← Quay lại cửa hàng</Link>
    </div>
  );

  const images = (() => { try { return JSON.parse(data.images || '[]'); } catch { return []; } })();
  const allImages = [data.image, ...images.filter(i => i !== data.image)].filter(Boolean);
  const discount = data.original_price ? Math.round((1 - data.price / data.original_price) * 100) : 0;

  const handleAddToCart = () => {
    addItem(data, qty);
    toast.success(`Đã thêm ${qty} sản phẩm vào giỏ!`, { icon: '🛒' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-3.5">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-primary-600">Trang chủ</Link>
          <ChevronRight size={14} />
          <Link to="/san-pham" className="hover:text-primary-600">Sản phẩm</Link>
          <ChevronRight size={14} />
          <Link to={`/san-pham?category=${data.category_slug}`} className="hover:text-primary-600">{data.category_name}</Link>
          <ChevronRight size={14} />
          <span className="text-gray-800 font-medium truncate max-w-48">{data.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 grid md:grid-cols-2 gap-10 mb-8">
          {/* Images */}
          <div>
            <motion.div
              key={activeImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square rounded-2xl overflow-hidden bg-primary-50 mb-3">
              <img src={allImages[activeImg]} alt={data.name}
                className="w-full h-full object-cover"
                onError={e => { e.target.src = 'https://placehold.co/600x600/FFF8EE/C8861A?text=Yến+Sào'; }} />
            </motion.div>
            {allImages.length > 1 && (
              <div className="flex gap-2">
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${activeImg === i ? 'border-primary-500' : 'border-transparent'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover"
                      onError={e => { e.target.src = 'https://placehold.co/64x64/FFF8EE/C8861A?text=Y'; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <span className="text-xs bg-primary-100 text-primary-700 font-medium px-3 py-1 rounded-full">{data.category_name}</span>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3 mb-2">{data.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15} className={i < Math.round(data.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
                ))}
              </div>
              <span className="text-sm text-gray-500">{data.rating}/5 ({data.reviews_count} đánh giá)</span>
            </div>

            <div className="flex items-end gap-3 mb-4">
              <span className="text-3xl font-bold text-primary-600">{fmt(data.price)}</span>
              <span className="text-gray-400 text-sm">/{data.unit}</span>
              {data.original_price > data.price && (
                <>
                  <span className="text-gray-400 line-through text-lg">{fmt(data.original_price)}</span>
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">-{discount}%</span>
                </>
              )}
            </div>

            {data.short_desc && (
              <p className="text-gray-600 text-sm leading-relaxed mb-5 bg-primary-50 p-4 rounded-xl border-l-4 border-primary-400">
                {data.short_desc}
              </p>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-5">
              <span className="text-sm font-medium text-gray-700">Số lượng:</span>
              <div className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1.5">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-primary-600">
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-bold text-sm">{qty}</span>
                <button onClick={() => setQty(q => q + 1)}
                  className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-primary-600">
                  <Plus size={14} />
                </button>
              </div>
              <span className="text-xs text-gray-400">Còn {data.stock} sản phẩm</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <button onClick={handleAddToCart}
                className="flex-1 btn-primary flex items-center justify-center gap-2 py-3">
                <ShoppingCart size={18} /> Thêm Vào Giỏ
              </button>
              <Link to="/dat-hang"
                onClick={() => addItem(data, qty)}
                className="flex-1 bg-primary-900 hover:bg-primary-800 text-white font-semibold py-3 rounded-full text-center transition-colors text-sm">
                Mua Ngay
              </Link>
            </div>

            {/* Policies */}
            <div className="grid grid-cols-3 gap-3 py-4 border-t border-gray-100">
              {[
                [Shield, 'Chính hãng 100%'],
                [Truck, 'Miễn ship 500k'],
                [RotateCcw, 'Đổi trả 7 ngày'],
              ].map(([Icon, label]) => (
                <div key={label} className="flex flex-col items-center gap-1 text-center text-xs text-gray-500">
                  <Icon size={20} className="text-primary-500" />
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {/* Hotline */}
            <a href="tel:0349166669"
              className="flex items-center gap-2 text-sm text-primary-700 bg-primary-50 px-4 py-3 rounded-xl mt-2 hover:bg-primary-100 transition-colors">
              <Phone size={16} className="text-primary-600" />
              <span>Tư vấn: <strong>0349 166 669</strong> (8:00 – 20:00)</span>
            </a>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-8">
          <h2 className="font-bold text-gray-800 text-lg mb-4 pb-3 border-b border-gray-100">Mô Tả Sản Phẩm</h2>
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
            <p>{data.description}</p>
          </div>
        </div>

        {/* Related */}
        {data.related?.length > 0 && (
          <div>
            <h2 className="font-bold text-gray-800 text-xl mb-5">Sản Phẩm Liên Quan</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {data.related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
