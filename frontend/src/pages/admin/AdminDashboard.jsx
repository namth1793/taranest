import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ShoppingBag, MessageSquare, Package, FileText, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';

const STATUS_LABELS = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
  shipping: { label: 'Đang giao', color: 'bg-purple-100 text-purple-800' },
  done: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Đã huỷ', color: 'bg-red-100 text-red-800' },
};

function fmt(n) { return new Intl.NumberFormat('vi-VN').format(n) + 'đ'; }
function fmtDate(s) { return new Date(s).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }

function authHeader() {
  return { headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } };
}

// ── ORDERS TAB ──────────────────────────────────────────
function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);

  const load = useCallback(() => {
    api.get('/admin/orders', authHeader()).then(r => setOrders(r.data)).catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    await api.patch(`/admin/orders/${id}/status`, { status }, authHeader());
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    toast.success('Cập nhật trạng thái thành công');
  };

  const deleteOrder = async (id) => {
    if (!confirm('Xoá đơn hàng này?')) return;
    await api.delete(`/admin/orders/${id}`, authHeader());
    setOrders(prev => prev.filter(o => o.id !== id));
    toast.success('Đã xoá đơn hàng');
  };

  const pending = orders.filter(o => o.status === 'pending').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-800">Đơn Hàng ({orders.length})</h2>
        {pending > 0 && <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">{pending} chờ xác nhận</span>}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Chưa có đơn hàng nào</div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => {
            const items = JSON.parse(order.items || '[]');
            const isOpen = expanded === order.id;
            return (
              <div key={order.id} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <div
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                >
                  <ChevronDown size={16} className={`text-gray-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-primary-700">#{order.order_code}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_LABELS[order.status]?.color}`}>
                        {STATUS_LABELS[order.status]?.label}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{order.customer_name} · {order.customer_phone} · {fmtDate(order.created_at)}</div>
                  </div>
                  <div className="text-sm font-bold text-gray-800 shrink-0">{fmt(order.total)}</div>
                </div>

                {isOpen && (
                  <div className="border-t border-gray-100 px-4 py-4 space-y-3">
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Địa chỉ:</span> {order.address}</p>
                      {order.note && <p><span className="font-medium">Ghi chú:</span> {order.note}</p>}
                      <p><span className="font-medium">Thanh toán:</span> {order.payment_method?.toUpperCase()}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
                      {items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-700">{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                          <span className="font-medium">{fmt(item.price * item.quantity)}</span>
                        </div>
                      ))}
                      <div className="border-t border-gray-200 pt-1.5 flex justify-between text-sm font-bold">
                        <span>Tổng cộng</span>
                        <span className="text-primary-700">{fmt(order.total)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order.id, e.target.value)}
                        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary-400"
                      >
                        {Object.entries(STATUS_LABELS).map(([val, { label }]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Xoá
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── CONTACTS TAB ────────────────────────────────────────
function ContactsTab() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    api.get('/admin/contacts', authHeader()).then(r => setContacts(r.data)).catch(() => {});
  }, []);

  const del = async (id) => {
    if (!confirm('Xoá tin nhắn này?')) return;
    await api.delete(`/admin/contacts/${id}`, authHeader());
    setContacts(prev => prev.filter(c => c.id !== id));
    toast.success('Đã xoá tin nhắn');
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-5">Tin Nhắn ({contacts.length})</h2>
      {contacts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Chưa có tin nhắn nào</div>
      ) : (
        <div className="space-y-3">
          {contacts.map(c => (
            <div key={c.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-gray-800 text-sm">{c.name}</span>
                    {c.phone && <a href={`tel:${c.phone}`} className="text-xs text-primary-600 hover:underline">{c.phone}</a>}
                    {c.email && <a href={`mailto:${c.email}`} className="text-xs text-gray-500 hover:underline">{c.email}</a>}
                  </div>
                  {c.message && <p className="text-sm text-gray-600 leading-relaxed">{c.message}</p>}
                  <p className="text-xs text-gray-400 mt-1.5">{fmtDate(c.created_at)}</p>
                </div>
                <button onClick={() => del(c.id)} className="text-xs text-red-400 hover:text-red-600 shrink-0">Xoá</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── PRODUCTS TAB ────────────────────────────────────────
function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    api.get('/admin/products', authHeader()).then(r => setProducts(r.data)).catch(() => {});
  }, []);

  const startEdit = (p) => { setEditing(p.id); setForm({ name: p.name, price: p.price, original_price: p.original_price || '', stock: p.stock, is_featured: p.is_featured, is_bestseller: p.is_bestseller }); };
  const cancelEdit = () => { setEditing(null); setForm({}); };

  const save = async (id) => {
    await api.patch(`/admin/products/${id}`, form, authHeader());
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...form } : p));
    setEditing(null);
    toast.success('Đã cập nhật sản phẩm');
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-5">Sản Phẩm ({products.length})</h2>
      <div className="space-y-2">
        {products.map(p => (
          <div key={p.id} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            {editing === p.id ? (
              <div className="p-4 space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Tên sản phẩm</label>
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Tồn kho</label>
                    <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: +e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Giá bán (đ)</label>
                    <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: +e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Giá gốc (đ)</label>
                    <input type="number" value={form.original_price} onChange={e => setForm(f => ({ ...f, original_price: +e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-400" />
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={!!form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} className="accent-primary-600" />
                    Nổi bật
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={!!form.is_bestseller} onChange={e => setForm(f => ({ ...f, is_bestseller: e.target.checked }))} className="accent-primary-600" />
                    Bán chạy
                  </label>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => save(p.id)} className="bg-primary-700 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-primary-800 transition-colors">Lưu</button>
                  <button onClick={cancelEdit} className="border border-gray-200 text-sm px-4 py-1.5 rounded-lg hover:bg-gray-50">Huỷ</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 px-4 py-3">
                <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover shrink-0 bg-gray-100"
                  onError={e => { e.target.src = 'https://placehold.co/48x48/FFF8EE/D97308?text=Y'; }} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-800 truncate">{p.name}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs text-primary-700 font-semibold">{fmt(p.price)}</span>
                    {p.original_price > 0 && <span className="text-xs text-gray-400 line-through">{fmt(p.original_price)}</span>}
                    <span className="text-xs text-gray-500">Kho: {p.stock}</span>
                    {p.is_featured ? <span className="text-xs bg-amber-100 text-amber-700 px-1.5 rounded">Nổi bật</span> : null}
                    {p.is_bestseller ? <span className="text-xs bg-green-100 text-green-700 px-1.5 rounded">Bán chạy</span> : null}
                  </div>
                </div>
                <button onClick={() => startEdit(p)} className="text-xs text-primary-600 hover:text-primary-800 border border-primary-200 px-3 py-1.5 rounded-lg shrink-0">Sửa</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── BLOG TAB ────────────────────────────────────────────
function BlogTab() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get('/admin/blog', authHeader()).then(r => setPosts(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-5">Bài Viết ({posts.length})</h2>
      <div className="space-y-3">
        {posts.map(p => (
          <div key={p.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex gap-4">
            <img src={p.image} alt={p.title} className="w-16 h-16 rounded-lg object-cover shrink-0 bg-gray-100"
              onError={e => { e.target.src = 'https://placehold.co/64x64/FFF8EE/D97308?text=B'; }} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-800 leading-snug">{p.title}</p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.excerpt}</p>
              <p className="text-xs text-gray-400 mt-1.5">{p.author} · {fmtDate(p.created_at)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MAIN DASHBOARD ──────────────────────────────────────
const TABS = [
  { key: 'orders', label: 'Đơn Hàng', icon: ShoppingBag },
  { key: 'contacts', label: 'Tin Nhắn', icon: MessageSquare },
  { key: 'products', label: 'Sản Phẩm', icon: Package },
  { key: 'blog', label: 'Bài Viết', icon: FileText },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState('orders');
  const navigate = useNavigate();
  const username = localStorage.getItem('admin_username') || 'admin';

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { navigate('/admin/login'); return; }
    api.get('/admin/verify', { headers: { Authorization: `Bearer ${token}` } })
      .catch(() => { localStorage.removeItem('admin_token'); navigate('/admin/login'); });
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary-900 text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-700 rounded-lg flex items-center justify-center text-sm font-bold">T</div>
          <div>
            <p className="font-bold text-sm leading-none">TARA NEST Admin</p>
            <p className="text-primary-300 text-xs mt-0.5">Xin chào, {username}</p>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-1.5 text-primary-300 hover:text-white text-sm transition-colors">
          <LogOut size={15} /> Đăng xuất
        </button>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  tab === t.key ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Icon size={16} /> {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {tab === 'orders' && <OrdersTab />}
        {tab === 'contacts' && <ContactsTab />}
        {tab === 'products' && <ProductsTab />}
        {tab === 'blog' && <BlogTab />}
      </div>
    </div>
  );
}
