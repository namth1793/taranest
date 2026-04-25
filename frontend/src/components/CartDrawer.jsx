import { X, Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

function fmt(n) {
  return new Intl.NumberFormat('vi-VN').format(n) + 'đ';
}

export default function CartDrawer() {
  const { items, totalItems, subtotal, isOpen, setIsOpen, removeItem, updateQty } = useCart();
  const shippingFee = subtotal >= 500000 ? 0 : 30000;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={() => setIsOpen(false)} />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-primary-600" />
                <h2 className="font-bold text-gray-800">Giỏ Hàng ({totalItems})</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <ShoppingBag size={48} className="mx-auto mb-3 opacity-30" />
                  <p>Giỏ hàng trống</p>
                  <Link to="/san-pham" onClick={() => setIsOpen(false)}
                    className="mt-4 inline-block text-sm text-primary-600 hover:underline">
                    Xem sản phẩm →
                  </Link>
                </div>
              ) : items.map(item => (
                <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                  <img src={item.image} alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg shrink-0 bg-primary-50"
                    onError={e => { e.target.src = 'https://placehold.co/64x64/FFF8EE/C8861A?text=Y'; }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.name}</p>
                    <p className="text-xs text-primary-600 font-bold mt-1">{fmt(item.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-200 text-gray-600">
                        <Minus size={11} />
                      </button>
                      <span className="text-sm font-bold w-6 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-200 text-gray-600">
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors self-start p-1">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t border-gray-100 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tạm tính</span><span>{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className={shippingFee === 0 ? 'text-green-600 font-medium' : ''}>
                    {shippingFee === 0 ? 'Miễn phí' : fmt(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base border-t pt-2">
                  <span>Tổng cộng</span>
                  <span className="text-primary-600">{fmt(subtotal + shippingFee)}</span>
                </div>
                {subtotal < 500000 && (
                  <p className="text-xs text-gray-400 text-center">
                    Mua thêm {fmt(500000 - subtotal)} để được miễn phí vận chuyển
                  </p>
                )}
                <Link to="/dat-hang" onClick={() => setIsOpen(false)}
                  className="btn-primary w-full text-center block">
                  Đặt Hàng Ngay
                </Link>
                <button onClick={() => setIsOpen(false)}
                  className="w-full text-center text-sm text-gray-500 hover:text-primary-600">
                  Tiếp tục mua sắm
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
