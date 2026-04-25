import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Youtube, Instagram } from 'lucide-react';
const logo = '/logo.png';

export default function Footer() {
  return (
    <footer className="bg-primary-950 text-primary-100">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="mb-4">
            <img src={logo} alt="TARA NEST" className="h-20 w-auto object-contain brightness-0 invert opacity-90" />
          </div>
          <p className="text-sm text-primary-300 leading-relaxed mb-5">
            TARA NEST – thương hiệu yến sào cao cấp với cam kết 100% nguyên chất từ thiên nhiên, không chất bảo quản, không phẩm màu.
          </p>
          <div className="flex gap-3">
            <a href="#" className="w-9 h-9 rounded-full bg-primary-800 hover:bg-gold flex items-center justify-center transition-colors">
              <Facebook size={16} />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-primary-800 hover:bg-gold flex items-center justify-center transition-colors">
              <Youtube size={16} />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-primary-800 hover:bg-gold flex items-center justify-center transition-colors">
              <Instagram size={16} />
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-bold text-white mb-4 uppercase text-sm tracking-wider">Sản Phẩm</h4>
          <ul className="space-y-2 text-sm text-primary-300">
            {[
              ['Yến Chưng Tươi', '/san-pham?category=yen-chung-tuoi'],
              ['Yến Chưng Sẵn', '/san-pham?category=yen-chung-san'],
              ['Yến Khô', '/san-pham?category=yen-kho'],
              ['Set Quà Tặng', '/san-pham?category=set-qua-tang'],
              ['Saffron & Đông Trùng', '/san-pham?category=san-pham-khac'],
            ].map(([label, to]) => (
              <li key={label}>
                <Link to={to} className="hover:text-gold transition-colors">» {label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Info */}
        <div>
          <h4 className="font-bold text-white mb-4 uppercase text-sm tracking-wider">Thông Tin</h4>
          <ul className="space-y-2 text-sm text-primary-300">
            {[
              ['Giới Thiệu', '/gioi-thieu'],
              ['Tin Tức & Blog', '/tin-tuc'],
              ['Liên Hệ', '/lien-he'],
              ['Chính Sách Đổi Trả', '/lien-he'],
              ['Chính Sách Bảo Mật', '/lien-he'],
            ].map(([label, to]) => (
              <li key={label}>
                <Link to={to} className="hover:text-gold transition-colors">» {label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-white mb-4 uppercase text-sm tracking-wider">Liên Hệ</h4>
          <div className="space-y-3 text-sm text-primary-300">
            <div className="flex gap-2">
              <MapPin size={16} className="text-gold shrink-0 mt-0.5" />
              <span>123 Đường Lê Văn Lương, Thanh Xuân, Hà Nội</span>
            </div>
            <div className="flex gap-2">
              <Phone size={16} className="text-gold shrink-0" />
              <div>
                <a href="tel:0349166669" className="block hover:text-gold">0349 166 669</a>
              </div>
            </div>
            <div className="flex gap-2">
              <Mail size={16} className="text-gold shrink-0" />
              <a href="mailto:info@taranest.vn" className="hover:text-gold">info@taranest.vn</a>
            </div>
          </div>
          <div className="mt-5">
            <p className="text-xs text-primary-400 mb-2">Giờ làm việc:</p>
            <p className="text-sm text-primary-200">T2 – T7: 8:00 – 20:00</p>
            <p className="text-sm text-primary-200">CN: 9:00 – 17:00</p>
          </div>
        </div>
      </div>

      {/* Payment logos */}
      <div className="border-t border-primary-900 max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-xs text-primary-400">Chấp nhận thanh toán:</p>
        <div className="flex gap-2 text-xs text-primary-300">
          <span className="bg-primary-900 px-3 py-1 rounded">COD</span>
          <span className="bg-primary-900 px-3 py-1 rounded">Chuyển Khoản</span>
          <span className="bg-primary-900 px-3 py-1 rounded">MoMo</span>
          <span className="bg-primary-900 px-3 py-1 rounded">VNPay</span>
        </div>
      </div>

      <div className="border-t border-primary-900 text-center py-4 text-xs text-primary-500">
        © 2024 TARA NEST – Tinh Hoa Yến Sào Thiên Nhiên. All rights reserved.
      </div>
    </footer>
  );
}
