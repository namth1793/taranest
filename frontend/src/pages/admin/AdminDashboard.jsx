import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ShoppingBag, MessageSquare, Package, Newspaper, Info, ChevronDown, Upload, X, Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';

const STATUS_LABELS = {
  pending:   { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Đã xác nhận',  color: 'bg-blue-100 text-blue-800' },
  shipping:  { label: 'Đang giao',    color: 'bg-purple-100 text-purple-800' },
  done:      { label: 'Hoàn thành',   color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Đã huỷ',       color: 'bg-red-100 text-red-800' },
};

function fmt(n) { return new Intl.NumberFormat('vi-VN').format(n) + 'đ'; }
function fmtDate(s) {
  return new Date(s).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function authHeader() {
  return { headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } };
}

// ── IMAGE UPLOADER ────────────────────────────────────────
function ImageUploader({ value, onChange }) {
  const [preview, setPreview] = useState(value || '');
  const [uploading, setUploading] = useState(false);

  useEffect(() => { setPreview(value || ''); }, [value]);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await api.post('/admin/upload', fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
        },
      });
      onChange(res.data.url);
      setPreview(res.data.url);
      toast.success('Upload ảnh thành công');
    } catch {
      toast.error('Upload thất bại. Kiểm tra cấu hình Cloudinary trong .env');
      setPreview(value || '');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {preview && (
        <div className="relative">
          <img src={preview} alt="preview" className="w-full h-40 object-cover rounded-xl border border-gray-100" />
          {uploading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-xl">
              <span className="text-sm text-gray-600 animate-pulse">Đang upload...</span>
            </div>
          )}
        </div>
      )}
      <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-3 cursor-pointer hover:border-primary-400 transition-colors">
        <Upload size={15} className="text-gray-400" />
        <span className="text-sm text-gray-500">{uploading ? 'Đang upload...' : 'Chọn ảnh từ máy'}</span>
        <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} className="hidden" />
      </label>
    </div>
  );
}

// ── ORDERS TAB ────────────────────────────────────────────
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
        {pending > 0 && (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
            {pending} chờ xác nhận
          </span>
        )}
      </div>
      {orders.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Chưa có đơn hàng nào</div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => {
            const items = (() => { try { return JSON.parse(order.items || '[]'); } catch { return []; } })();
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
                    <div className="text-xs text-gray-500 mt-0.5">
                      {order.customer_name} · {order.customer_phone} · {fmtDate(order.created_at)}
                    </div>
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

// ── CONTACTS TAB ──────────────────────────────────────────
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
                <button onClick={() => del(c.id)} className="text-red-400 hover:text-red-600 shrink-0">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── PRODUCT EDIT FORM ─────────────────────────────────────
function ProductEditForm({ product, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: product.name || '',
    short_desc: product.short_desc || '',
    description: product.description || '',
    price: product.price || '',
    original_price: product.original_price || '',
    stock: product.stock ?? 0,
    is_featured: !!product.is_featured,
    is_bestseller: !!product.is_bestseller,
    image: product.image || '',
  });
  const [saving, setSaving] = useState(false);

  const f = (k) => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const save = async () => {
    if (!form.name || !form.price) { toast.error('Vui lòng điền tên và giá'); return; }
    setSaving(true);
    try {
      await api.put(`/admin/products/${product.id}`, form, authHeader());
      toast.success('Đã lưu sản phẩm');
      onSave({ ...product, ...form });
    } catch { toast.error('Lưu thất bại'); }
    finally { setSaving(false); }
  };

  return (
    <div className="border-t border-gray-100 p-4 space-y-4 bg-gray-50">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="label">Tên sản phẩm *</label>
          <input value={form.name} onChange={f('name')}
            className="input-field" placeholder="Tên sản phẩm" />
        </div>
        <div>
          <label className="label">Giá bán (đ) *</label>
          <input type="number" value={form.price} onChange={f('price')}
            className="input-field" placeholder="0" />
        </div>
        <div>
          <label className="label">Giá gốc (đ)</label>
          <input type="number" value={form.original_price} onChange={f('original_price')}
            className="input-field" placeholder="0" />
        </div>
        <div>
          <label className="label">Tồn kho</label>
          <input type="number" value={form.stock} onChange={f('stock')}
            className="input-field" placeholder="0" />
        </div>
        <div className="flex items-center gap-6 pt-5">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.is_featured}
              onChange={e => setForm(p => ({ ...p, is_featured: e.target.checked }))}
              className="accent-primary-600 w-4 h-4" />
            Nổi bật
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.is_bestseller}
              onChange={e => setForm(p => ({ ...p, is_bestseller: e.target.checked }))}
              className="accent-primary-600 w-4 h-4" />
            Bán chạy
          </label>
        </div>
      </div>

      <div>
        <label className="label">Mô tả ngắn</label>
        <textarea value={form.short_desc} onChange={f('short_desc')} rows={2}
          className="input-field resize-none" placeholder="Mô tả ngắn hiển thị ở trang sản phẩm..." />
      </div>

      <div>
        <label className="label">Mô tả chi tiết</label>
        <textarea value={form.description} onChange={f('description')} rows={5}
          className="input-field resize-none" placeholder="Nội dung mô tả đầy đủ sản phẩm..." />
      </div>

      <div>
        <label className="label">Ảnh sản phẩm</label>
        <ImageUploader value={form.image} onChange={url => setForm(p => ({ ...p, image: url }))} />
      </div>

      <div className="flex gap-2 pt-1">
        <button onClick={save} disabled={saving}
          className="bg-primary-700 hover:bg-primary-800 text-white text-sm px-5 py-2 rounded-lg transition-colors disabled:opacity-60">
          {saving ? 'Đang lưu...' : 'Lưu'}
        </button>
        <button onClick={onCancel}
          className="border border-gray-200 text-sm px-5 py-2 rounded-lg hover:bg-gray-100 transition-colors">
          Huỷ
        </button>
      </div>
    </div>
  );
}

// ── PRODUCT CREATE FORM ───────────────────────────────────
function ProductCreateForm({ onSave, onCancel }) {
  const [form, setForm] = useState({
    name: '', category_id: '', short_desc: '', description: '',
    price: '', original_price: '', stock: 100,
    is_featured: false, is_bestseller: false, image: '',
  });
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/admin/categories', authHeader()).then(r => setCategories(r.data)).catch(() => {});
  }, []);

  const f = (k) => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const save = async () => {
    if (!form.name || !form.price || !form.category_id) {
      toast.error('Vui lòng điền tên, giá và chọn danh mục');
      return;
    }
    setSaving(true);
    try {
      const res = await api.post('/admin/products', form, authHeader());
      toast.success('Đã thêm sản phẩm mới');
      onSave({ ...form, id: res.data.id, slug: res.data.slug });
    } catch { toast.error('Thêm sản phẩm thất bại'); }
    finally { setSaving(false); }
  };

  return (
    <div className="bg-white border border-primary-200 rounded-xl shadow-sm p-5 mb-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800">Thêm Sản Phẩm Mới</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="label">Tên sản phẩm *</label>
          <input value={form.name} onChange={f('name')} className="input-field" placeholder="Tên sản phẩm" />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Danh mục *</label>
          <select value={form.category_id} onChange={f('category_id')} className="input-field">
            <option value="">-- Chọn danh mục --</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Giá bán (đ) *</label>
          <input type="number" value={form.price} onChange={f('price')} className="input-field" placeholder="0" />
        </div>
        <div>
          <label className="label">Giá gốc (đ)</label>
          <input type="number" value={form.original_price} onChange={f('original_price')} className="input-field" placeholder="0" />
        </div>
        <div>
          <label className="label">Tồn kho</label>
          <input type="number" value={form.stock} onChange={f('stock')} className="input-field" placeholder="100" />
        </div>
        <div className="flex items-center gap-6 pt-5">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.is_featured}
              onChange={e => setForm(p => ({ ...p, is_featured: e.target.checked }))}
              className="accent-primary-600 w-4 h-4" />
            Nổi bật
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.is_bestseller}
              onChange={e => setForm(p => ({ ...p, is_bestseller: e.target.checked }))}
              className="accent-primary-600 w-4 h-4" />
            Bán chạy
          </label>
        </div>
      </div>

      <div>
        <label className="label">Mô tả ngắn</label>
        <textarea value={form.short_desc} onChange={f('short_desc')} rows={2}
          className="input-field resize-none" placeholder="Mô tả ngắn..." />
      </div>
      <div>
        <label className="label">Mô tả chi tiết</label>
        <textarea value={form.description} onChange={f('description')} rows={4}
          className="input-field resize-none" placeholder="Nội dung mô tả đầy đủ..." />
      </div>
      <div>
        <label className="label">Ảnh sản phẩm</label>
        <ImageUploader value={form.image} onChange={url => setForm(p => ({ ...p, image: url }))} />
      </div>

      <div className="flex gap-2">
        <button onClick={save} disabled={saving}
          className="bg-primary-700 hover:bg-primary-800 text-white text-sm px-5 py-2 rounded-lg transition-colors disabled:opacity-60">
          {saving ? 'Đang thêm...' : 'Thêm Sản Phẩm'}
        </button>
        <button onClick={onCancel}
          className="border border-gray-200 text-sm px-5 py-2 rounded-lg hover:bg-gray-100 transition-colors">
          Huỷ
        </button>
      </div>
    </div>
  );
}

// ── PRODUCTS TAB ──────────────────────────────────────────
function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    api.get('/admin/products', authHeader()).then(r => setProducts(r.data)).catch(() => {});
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-800">Sản Phẩm ({products.length})</h2>
        {!creating && (
          <button onClick={() => setCreating(true)}
            className="flex items-center gap-1.5 bg-primary-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-primary-800 transition-colors">
            <Plus size={15} /> Thêm Sản Phẩm
          </button>
        )}
      </div>

      {creating && (
        <ProductCreateForm
          onSave={(newProduct) => {
            setProducts(prev => [newProduct, ...prev]);
            setCreating(false);
          }}
          onCancel={() => setCreating(false)}
        />
      )}

      <div className="space-y-2">
        {products.map(p => (
          <div key={p.id} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3">
              <img src={p.image} alt={p.name}
                className="w-12 h-12 rounded-lg object-cover shrink-0 bg-gray-100"
                onError={e => { e.target.src = 'https://placehold.co/48x48/FFF8EE/D97308?text=Y'; }} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-800 truncate">{p.name}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-xs text-primary-700 font-semibold">{fmt(p.price)}</span>
                  {p.original_price > 0 && (
                    <span className="text-xs text-gray-400 line-through">{fmt(p.original_price)}</span>
                  )}
                  <span className="text-xs text-gray-400">Kho: {p.stock}</span>
                  {p.is_featured ? <span className="text-xs bg-amber-100 text-amber-700 px-1.5 rounded">Nổi bật</span> : null}
                  {p.is_bestseller ? <span className="text-xs bg-green-100 text-green-700 px-1.5 rounded">Bán chạy</span> : null}
                </div>
              </div>
              <button
                onClick={() => setEditing(editing === p.id ? null : p.id)}
                className="text-primary-600 hover:text-primary-800 shrink-0 p-1.5 rounded-lg hover:bg-primary-50 transition-colors"
              >
                {editing === p.id ? <X size={16} /> : <Pencil size={16} />}
              </button>
            </div>

            {editing === p.id && (
              <ProductEditForm
                product={p}
                onSave={(updated) => {
                  setProducts(prev => prev.map(x => x.id === p.id ? updated : x));
                  setEditing(null);
                }}
                onCancel={() => setEditing(null)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── BLOG EDIT FORM ────────────────────────────────────────
function BlogForm({ post, onSave, onCancel }) {
  const isNew = !post.id;
  const [form, setForm] = useState({
    title: post.title || '',
    author: post.author || 'TARA NEST',
    excerpt: post.excerpt || '',
    content: post.content || '',
    image: post.image || '',
  });
  const [saving, setSaving] = useState(false);

  const f = (k) => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const save = async () => {
    if (!form.title) { toast.error('Vui lòng nhập tiêu đề'); return; }
    setSaving(true);
    try {
      if (isNew) {
        const res = await api.post('/admin/blog', form, authHeader());
        onSave({ ...form, id: res.data.id, slug: res.data.slug, created_at: new Date().toISOString() });
        toast.success('Đã tạo bài viết');
      } else {
        await api.put(`/admin/blog/${post.id}`, form, authHeader());
        onSave({ ...post, ...form });
        toast.success('Đã cập nhật bài viết');
      }
    } catch { toast.error('Lưu thất bại'); }
    finally { setSaving(false); }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800">{isNew ? 'Thêm Bài Viết Mới' : 'Chỉnh Sửa Bài Viết'}</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
      </div>

      <div>
        <label className="label">Tiêu đề *</label>
        <input value={form.title} onChange={f('title')} className="input-field" placeholder="Tiêu đề bài viết" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Tác giả</label>
          <input value={form.author} onChange={f('author')} className="input-field" placeholder="TARA NEST" />
        </div>
      </div>

      <div>
        <label className="label">Tóm tắt (hiển thị ngoài danh sách)</label>
        <textarea value={form.excerpt} onChange={f('excerpt')} rows={2}
          className="input-field resize-none" placeholder="Mô tả ngắn về bài viết..." />
      </div>

      <div>
        <label className="label">Nội dung bài viết</label>
        <textarea value={form.content} onChange={f('content')} rows={12}
          className="input-field resize-none font-mono text-sm"
          placeholder="Viết nội dung bài viết ở đây...&#10;&#10;Gợi ý: dùng dòng trống để tách đoạn, dùng CHỮ HOA để làm tiêu đề." />
        <p className="text-xs text-gray-400 mt-1">Viết text thuần, dòng trống = tách đoạn. Hiển thị đúng như bạn gõ.</p>
      </div>

      <div>
        <label className="label">Ảnh bìa</label>
        <ImageUploader value={form.image} onChange={url => setForm(p => ({ ...p, image: url }))} />
      </div>

      <div className="flex gap-2">
        <button onClick={save} disabled={saving}
          className="bg-primary-700 hover:bg-primary-800 text-white text-sm px-5 py-2 rounded-lg transition-colors disabled:opacity-60">
          {saving ? 'Đang lưu...' : isNew ? 'Đăng Bài' : 'Lưu'}
        </button>
        <button onClick={onCancel}
          className="border border-gray-200 text-sm px-5 py-2 rounded-lg hover:bg-gray-100 transition-colors">
          Huỷ
        </button>
      </div>
    </div>
  );
}

// ── BLOG TAB ──────────────────────────────────────────────
function BlogTab() {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null); // id or 'new'

  useEffect(() => {
    api.get('/admin/blog', authHeader()).then(r => setPosts(r.data)).catch(() => {});
  }, []);

  const del = async (id) => {
    if (!confirm('Xoá bài viết này?')) return;
    await api.delete(`/admin/blog/${id}`, authHeader());
    setPosts(prev => prev.filter(p => p.id !== id));
    toast.success('Đã xoá bài viết');
  };

  const handleSave = (saved) => {
    if (!saved.id) return;
    if (editing === 'new') {
      setPosts(prev => [saved, ...prev]);
    } else {
      setPosts(prev => prev.map(p => p.id === saved.id ? saved : p));
    }
    setEditing(null);
  };

  const editingPost = editing === 'new' ? {} : posts.find(p => p.id === editing) || null;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-800">Bài Viết ({posts.length})</h2>
        {editing !== 'new' && (
          <button onClick={() => setEditing('new')}
            className="flex items-center gap-1.5 bg-primary-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-primary-800 transition-colors">
            <Plus size={15} /> Thêm Bài Viết
          </button>
        )}
      </div>

      {editing === 'new' && (
        <div className="mb-4">
          <BlogForm post={{}} onSave={handleSave} onCancel={() => setEditing(null)} />
        </div>
      )}

      <div className="space-y-3">
        {posts.map(p => (
          <div key={p.id}>
            {editing === p.id ? (
              <BlogForm post={p} onSave={handleSave} onCancel={() => setEditing(null)} />
            ) : (
              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex gap-4">
                <img src={p.image} alt={p.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 bg-gray-100"
                  onError={e => { e.target.src = 'https://placehold.co/64x64/FFF8EE/D97308?text=B'; }} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800 leading-snug">{p.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{p.excerpt}</p>
                  <p className="text-xs text-gray-400 mt-1">{p.author} · {fmtDate(p.created_at)}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => setEditing(p.id)}
                    className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => del(p.id)}
                    className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ABOUT TAB ─────────────────────────────────────────────
const ABOUT_SECTIONS = [
  { key: 'story',      label: 'Câu Chuyện' },
  { key: 'stats',      label: 'Thống Kê' },
  { key: 'team',       label: 'Đội Ngũ' },
  { key: 'milestones', label: 'Hành Trình' },
];

function AboutTab() {
  const [data, setData] = useState(null);
  const [section, setSection] = useState('story');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/admin/about', authHeader()).then(r => setData(r.data)).catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/admin/about', data, authHeader());
      toast.success('Đã lưu nội dung trang Giới Thiệu');
    } catch { toast.error('Lưu thất bại'); }
    finally { setSaving(false); }
  };

  if (!data) return <div className="text-center py-16 text-gray-400">Đang tải...</div>;

  const setStory = (k, v) => setData(p => ({ ...p, about_story: { ...p.about_story, [k]: v } }));
  const setStat = (i, k, v) => setData(p => {
    const stats = [...(p.about_stats || [])];
    stats[i] = { ...stats[i], [k]: v };
    return { ...p, about_stats: stats };
  });
  const setMember = (i, k, v) => setData(p => {
    const team = [...(p.about_team || [])];
    team[i] = { ...team[i], [k]: v };
    return { ...p, about_team: team };
  });
  const setMilestone = (i, k, v) => setData(p => {
    const ms = [...(p.about_milestones || [])];
    ms[i] = { ...ms[i], [k]: v };
    return { ...p, about_milestones: ms };
  });
  const addMilestone = () => setData(p => ({
    ...p, about_milestones: [...(p.about_milestones || []), { year: '', event: '' }]
  }));
  const delMilestone = (i) => setData(p => ({
    ...p, about_milestones: (p.about_milestones || []).filter((_, idx) => idx !== i)
  }));
  const addMember = () => setData(p => ({
    ...p, about_team: [...(p.about_team || []), { name: '', role: '', img: '', desc: '' }]
  }));
  const delMember = (i) => setData(p => ({
    ...p, about_team: (p.about_team || []).filter((_, idx) => idx !== i)
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-800">Trang Giới Thiệu</h2>
        <button onClick={save} disabled={saving}
          className="bg-primary-700 hover:bg-primary-800 text-white text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-60">
          {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {ABOUT_SECTIONS.map(s => (
          <button key={s.key} onClick={() => setSection(s.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              section === s.key
                ? 'bg-primary-100 text-primary-700 border border-primary-200'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* STORY */}
      {section === 'story' && (
        <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-4 shadow-sm">
          <div>
            <label className="label">Tiêu đề chính</label>
            <input value={data.about_story?.heading || ''} onChange={e => setStory('heading', e.target.value)}
              className="input-field" placeholder="Từ Đam Mê Đến Sứ Mệnh" />
          </div>
          {['para1', 'para2', 'para3'].map((k, i) => (
            <div key={k}>
              <label className="label">Đoạn văn {i + 1}</label>
              <textarea value={data.about_story?.[k] || ''} onChange={e => setStory(k, e.target.value)}
                rows={4} className="input-field resize-none" placeholder={`Nội dung đoạn ${i + 1}...`} />
            </div>
          ))}
        </div>
      )}

      {/* STATS */}
      {section === 'stats' && (
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-4">4 con số thống kê hiển thị trên trang giới thiệu</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {(data.about_stats || []).map((stat, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-3">
                <div>
                  <label className="label">Con số (vd: 10.000+)</label>
                  <input value={stat.num || ''} onChange={e => setStat(i, 'num', e.target.value)}
                    className="input-field" placeholder="10.000+" />
                </div>
                <div>
                  <label className="label">Nhãn (vd: Khách hàng tin dùng)</label>
                  <input value={stat.label || ''} onChange={e => setStat(i, 'label', e.target.value)}
                    className="input-field" placeholder="Khách hàng tin dùng" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TEAM */}
      {section === 'team' && (
        <div className="space-y-4">
          {(data.about_team || []).map((member, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Thành viên {i + 1}</span>
                <button onClick={() => delMember(i)} className="text-red-400 hover:text-red-600 p-1">
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="label">Họ tên</label>
                  <input value={member.name || ''} onChange={e => setMember(i, 'name', e.target.value)}
                    className="input-field" placeholder="Nguyễn Văn A" />
                </div>
                <div>
                  <label className="label">Chức vụ</label>
                  <input value={member.role || ''} onChange={e => setMember(i, 'role', e.target.value)}
                    className="input-field" placeholder="CEO & Sáng Lập Viên" />
                </div>
              </div>
              <div>
                <label className="label">URL ảnh đại diện</label>
                <input value={member.img || ''} onChange={e => setMember(i, 'img', e.target.value)}
                  className="input-field" placeholder="https://..." />
              </div>
              <div>
                <label className="label">Mô tả</label>
                <textarea value={member.desc || ''} onChange={e => setMember(i, 'desc', e.target.value)}
                  rows={2} className="input-field resize-none" placeholder="Kinh nghiệm và chuyên môn..." />
              </div>
            </div>
          ))}
          <button onClick={addMember}
            className="flex items-center gap-2 text-sm text-primary-700 border border-primary-200 hover:bg-primary-50 px-4 py-2 rounded-lg transition-colors">
            <Plus size={15} /> Thêm Thành Viên
          </button>
        </div>
      )}

      {/* MILESTONES */}
      {section === 'milestones' && (
        <div className="space-y-3">
          {(data.about_milestones || []).map((m, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex gap-3 items-start">
              <GripVertical size={16} className="text-gray-300 mt-2 shrink-0" />
              <div className="flex-1 grid sm:grid-cols-4 gap-3">
                <div>
                  <label className="label">Năm</label>
                  <input value={m.year || ''} onChange={e => setMilestone(i, 'year', e.target.value)}
                    className="input-field" placeholder="2024" />
                </div>
                <div className="sm:col-span-3">
                  <label className="label">Sự kiện</label>
                  <input value={m.event || ''} onChange={e => setMilestone(i, 'event', e.target.value)}
                    className="input-field" placeholder="Mô tả sự kiện..." />
                </div>
              </div>
              <button onClick={() => delMilestone(i)} className="text-red-400 hover:text-red-600 p-1 mt-5 shrink-0">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          <button onClick={addMilestone}
            className="flex items-center gap-2 text-sm text-primary-700 border border-primary-200 hover:bg-primary-50 px-4 py-2 rounded-lg transition-colors">
            <Plus size={15} /> Thêm Mốc Thời Gian
          </button>
        </div>
      )}
    </div>
  );
}

// ── MAIN DASHBOARD ────────────────────────────────────────
const TABS = [
  { key: 'orders',   label: 'Đơn Hàng',   icon: ShoppingBag },
  { key: 'contacts', label: 'Tin Nhắn',    icon: MessageSquare },
  { key: 'products', label: 'Sản Phẩm',   icon: Package },
  { key: 'blog',     label: 'Tin Tức',     icon: Newspaper },
  { key: 'about',    label: 'Giới Thiệu',  icon: Info },
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

      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  tab === t.key ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}>
                <Icon size={16} /> {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {tab === 'orders'   && <OrdersTab />}
        {tab === 'contacts' && <ContactsTab />}
        {tab === 'products' && <ProductsTab />}
        {tab === 'blog'     && <BlogTab />}
        {tab === 'about'    && <AboutTab />}
      </div>

      {/* Global styles for form elements */}
      <style>{`
        .label { display: block; font-size: 0.75rem; font-weight: 500; color: #6b7280; margin-bottom: 0.375rem; }
        .input-field { width: 100%; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 0.5rem 0.875rem; font-size: 0.875rem; outline: none; transition: border-color 0.15s; }
        .input-field:focus { border-color: #d97308; }
      `}</style>
    </div>
  );
}
