import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, CheckCircle, ArrowLeft, Truck, Banknote } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { postOrder } from '../lib/api';
import toast from 'react-hot-toast';

function fmt(n) { return new Intl.NumberFormat('vi-VN').format(n) + 'đ'; }

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ customer_name: '', customer_phone: '', customer_email: '', address: '', note: '', payment_method: 'cod' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const shippingFee = subtotal >= 500000 ? 0 : 30000;
  const total = subtotal + shippingFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customer_name || !form.customer_phone || !form.address) {
      toast.error('Vui lòng điền đầy đủ họ tên, SĐT và địa chỉ');
      return;
    }
    if (items.length === 0) { toast.error('Giỏ hàng trống'); return; }
    setLoading(true);
    try {
      const res = await postOrder({ ...form, items, subtotal, shipping_fee: shippingFee, total });
      setSuccess(res);
      clearCart();
    } catch { toast.error('Có lỗi xảy ra, vui lòng thử lại'); }
    finally { setLoading(false); }
  };

  if (success) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center">
        <CheckCircle size={60} className="text-green-500 mx-auto mb-5" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Đặt Hàng Thành Công!</h2>
        <p className="text-gray-500 mb-4">Mã đơn hàng của bạn: <strong className="text-primary-600 text-lg">{success.order_code}</strong></p>
        <p className="text-gray-500 text-sm mb-8">Chúng tôi sẽ liên hệ xác nhận đơn trong vòng 30 phút. Cảm ơn bạn đã tin tưởng TARA NEST!</p>
        <Link to="/" className="btn-primary block">Tiếp Tục Mua Sắm</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-3">
          <Link to="/san-pham" className="text-gray-500 hover:text-primary-600 flex items-center gap-1 text-sm">
            <ArrowLeft size={16} /> Tiếp tục mua
          </Link>
          <span className="text-gray-300">|</span>
          <h1 className="font-bold text-gray-800 flex items-center gap-2">
            <ShoppingBag size={18} className="text-primary-600" /> Đặt Hàng
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {items.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <ShoppingBag size={60} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-4">Giỏ hàng trống</p>
            <Link to="/san-pham" className="btn-primary inline-block">Mua Ngay</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
            {/* Customer info */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-bold text-gray-800 mb-5">Thông Tin Người Nhận</h2>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ Tên <span className="text-red-500">*</span></label>
                      <input value={form.customer_name} onChange={e => setForm(p => ({ ...p, customer_name: e.target.value }))}
                        placeholder="Nguyễn Văn A"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Số Điện Thoại <span className="text-red-500">*</span></label>
                      <input value={form.customer_phone} onChange={e => setForm(p => ({ ...p, customer_phone: e.target.value }))}
                        placeholder="0909 123 456" type="tel"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input value={form.customer_email} onChange={e => setForm(p => ({ ...p, customer_email: e.target.value }))}
                      placeholder="email@example.com" type="email"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Địa Chỉ Giao Hàng <span className="text-red-500">*</span></label>
                    <textarea value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                      placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                      rows={3}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Ghi Chú Đơn Hàng</label>
                    <input value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                      placeholder="VD: Giao giờ hành chính, gọi trước khi giao..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400" />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-bold text-gray-800 mb-4">Phương Thức Thanh Toán</h2>
                <div className="space-y-3">
                  {[
                    { id: 'cod', icon: <Truck size={18} />, label: 'Thanh Toán Khi Nhận Hàng (COD)', desc: 'Trả tiền mặt khi nhận hàng' },
                    { id: 'bank', icon: <Banknote size={18} />, label: 'Chuyển Khoản Ngân Hàng', desc: 'Vietcombank: 1234567890 - NGUYEN VAN A' },
                  ].map(pm => (
                    <label key={pm.id}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.payment_method === pm.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="payment" value={pm.id} checked={form.payment_method === pm.id}
                        onChange={e => setForm(p => ({ ...p, payment_method: e.target.value }))} className="accent-primary-600" />
                      <span className="text-primary-600">{pm.icon}</span>
                      <div>
                        <p className="font-medium text-sm text-gray-800">{pm.label}</p>
                        <p className="text-xs text-gray-500">{pm.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <h2 className="font-bold text-gray-800 mb-5">Đơn Hàng ({items.length} sản phẩm)</h2>
                <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover shrink-0 bg-primary-50"
                        onError={e => { e.target.src = 'https://placehold.co/48x48/FFF8EE/C8861A?text=Y'; }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-700 line-clamp-2 font-medium">{item.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">x{item.qty}</p>
                      </div>
                      <span className="text-xs font-bold text-primary-600 shrink-0">{fmt(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 py-4 border-t border-b border-gray-100 mb-4 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span><span>{fmt(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span className={shippingFee === 0 ? 'text-green-600 font-medium' : ''}>{shippingFee === 0 ? 'Miễn phí' : fmt(shippingFee)}</span>
                  </div>
                  {subtotal < 500000 && (
                    <p className="text-xs text-gray-400">Mua thêm {fmt(500000 - subtotal)} miễn phí ship</p>
                  )}
                </div>

                <div className="flex justify-between font-bold text-lg mb-5">
                  <span>Tổng Cộng</span>
                  <span className="text-primary-600">{fmt(total)}</span>
                </div>

                <button type="submit" disabled={loading}
                  className="btn-primary w-full py-3 text-base disabled:opacity-60">
                  {loading ? 'Đang Xử Lý...' : '🛒 Xác Nhận Đặt Hàng'}
                </button>

                <p className="text-xs text-gray-400 text-center mt-3">
                  Bằng cách đặt hàng, bạn đồng ý với điều khoản dịch vụ của TARA NEST
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
