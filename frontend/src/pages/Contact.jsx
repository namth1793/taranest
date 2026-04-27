import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, Facebook, Youtube, MessageCircle } from 'lucide-react';
import { postContact } from '../lib/api';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) { toast.error('Vui lòng nhập họ tên và số điện thoại'); return; }
    setLoading(true);
    try {
      await postContact(form);
      toast.success('Gửi thành công! Chúng tôi sẽ liên hệ bạn sớm nhất.', { duration: 5000 });
      setForm({ name: '', phone: '', email: '', message: '' });
    } catch { toast.error('Có lỗi xảy ra, vui lòng thử lại'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-primary-900 text-white py-14 text-center">
        <p className="text-gold text-xs tracking-widest uppercase mb-2">Liên Hệ</p>
        <h1 className="text-3xl font-bold">Liên Hệ Với TARA NEST</h1>
        <p className="text-primary-300 mt-3 text-sm">Chúng tôi luôn sẵn sàng tư vấn và hỗ trợ bạn 7 ngày/tuần</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Thông Tin Liên Hệ</h2>

            <div className="space-y-5 mb-8">
              {[
                { icon: <MapPin className="text-primary-600" size={20} />, title: 'Địa Chỉ', lines: ['59 Đốc Ngữ - Ba Đình - Hà Nội'] },
                { icon: <Phone className="text-primary-600" size={20} />, title: 'Điện Thoại', lines: ['0349 166 669 (Kinh doanh)', '0349 166 669 (Hỗ trợ)'] },
                { icon: <Mail className="text-primary-600" size={20} />, title: 'Email', lines: ['info@taranest.vn', 'sales@taranest.vn'] },
                { icon: <Clock className="text-primary-600" size={20} />, title: 'Giờ Làm Việc', lines: ['Thứ 2 – Thứ 7: 8:00 – 20:00', 'Chủ Nhật: 9:00 – 17:00'] },
              ].map(item => (
                <div key={item.title} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center shrink-0">{item.icon}</div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm mb-1">{item.title}</p>
                    {item.lines.map(l => <p key={l} className="text-gray-500 text-sm">{l}</p>)}
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-bold text-gray-800 text-sm mb-4">Kết Nối Với Chúng Tôi</h3>
              <div className="flex gap-3">
                {[
                  { icon: <Facebook size={18} />, label: 'Facebook', href: '#', color: 'bg-blue-600' },
                  { icon: <Youtube size={18} />, label: 'YouTube', href: '#', color: 'bg-red-600' },
                  { icon: <MessageCircle size={18} />, label: 'Zalo', href: '#', color: 'bg-sky-500' },
                ].map(s => (
                  <a key={s.label} href={s.href}
                    className={`${s.color} text-white flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity`}>
                    {s.icon} {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="mt-6 bg-white rounded-xl shadow-sm overflow-hidden h-56">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=105.819,21.042,105.839,21.052&layer=mapnik&marker=21.047,105.829"
                className="w-full h-full border-0"
                title="TARA NEST Location"
              />
            </div>
          </div>

          {/* Form */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm p-7">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Gửi Tin Nhắn</h2>
              <p className="text-gray-500 text-sm mb-6">Điền thông tin bên dưới, chúng tôi sẽ liên hệ trong vòng 24 giờ</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Họ và Tên <span className="text-red-500">*</span>
                    </label>
                    <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Nguyễn Văn A"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Số Điện Thoại <span className="text-red-500">*</span>
                    </label>
                    <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      placeholder="0349 166 669" type="tel"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="email@example.com" type="email"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 transition-colors" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nội Dung</label>
                  <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    placeholder="Tôi muốn hỏi về sản phẩm yến chưng tươi..."
                    rows={5}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 transition-colors resize-none" />
                </div>

                <button type="submit" disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-60">
                  <Send size={16} />
                  {loading ? 'Đang Gửi...' : 'Gửi Tin Nhắn'}
                </button>
              </form>
            </div>

            {/* Hotline box */}
            <div className="mt-5 bg-gradient-to-r from-primary-700 to-primary-900 text-white rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Phone size={22} />
              </div>
              <div>
                <p className="font-bold text-lg">0349 166 669</p>
                <p className="text-primary-200 text-sm">Hotline tư vấn miễn phí – Mở cửa 8:00 – 20:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
