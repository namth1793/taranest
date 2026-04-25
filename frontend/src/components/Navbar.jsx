import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, Phone, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import logo from '../../assets/logo.png';

const navItems = [
  { label: 'Trang Chủ', to: '/' },
  {
    label: 'Sản Phẩm', to: '/san-pham',
    children: [
      { label: 'Yến Chưng Tươi', to: '/san-pham?category=yen-chung-tuoi' },
      { label: 'Yến Chưng Sẵn', to: '/san-pham?category=yen-chung-san' },
      { label: 'Yến Khô', to: '/san-pham?category=yen-kho' },
      { label: 'Set Quà Tặng', to: '/san-pham?category=set-qua-tang' },
      { label: 'Sản Phẩm Khác', to: '/san-pham?category=san-pham-khac' },
    ]
  },
  { label: 'Tin Tức', to: '/tin-tuc' },
  { label: 'Giới Thiệu', to: '/gioi-thieu' },
  { label: 'Liên Hệ', to: '/lien-he' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const { totalItems, setIsOpen } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQ.trim()) {
      navigate(`/san-pham?search=${encodeURIComponent(searchQ.trim())}`);
      setSearchOpen(false);
      setSearchQ('');
    }
  };

  return (
    <>
      {/* Top bar */}
      <div className="bg-primary-800 text-primary-100 text-xs py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span>🎁 Miễn phí vận chuyển đơn hàng từ 500.000đ</span>
          <div className="flex items-center gap-4">
            <a href="tel:03491666669" className="flex items-center gap-1 hover:text-white">
              <Phone size={12} /> 0349 166 669
            </a>
            <span>|</span>
            <a href="mailto:info@taranest.vn" className="hover:text-white">info@taranest.vn</a>
          </div>
        </div>
      </div>

      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur shadow-md' : 'bg-white shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="shrink-0">
            <img src={logo} alt="TARA NEST" className="h-16 w-auto object-contain" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              item.children ? (
                <div key={item.label} className="relative group">
                  <NavLink to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'}`
                    }>
                    {item.label} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                  </NavLink>
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    {item.children.map(c => (
                      <Link key={c.label} to={c.to}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink key={item.label} to={item.to}
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'}`
                  }>
                  {item.label}
                </NavLink>
              )
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(v => !v)}
              className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
              <Search size={20} />
            </button>
            <button onClick={() => setIsOpen(true)} className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
            <button className="lg:hidden p-2 text-gray-600" onClick={() => setMobileOpen(v => !v)}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t border-gray-100 bg-white px-4 py-3">
            <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
              <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
                placeholder="Tìm kiếm sản phẩm yến sào..."
                className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary-400"
                autoFocus />
              <button type="submit" className="btn-primary py-2 text-sm">Tìm</button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-4 pb-4">
            {navItems.map(item => (
              <div key={item.label}>
                <NavLink to={item.to} onClick={() => setMobileOpen(false)}
                  className="block py-3 text-gray-700 font-medium border-b border-gray-50 hover:text-primary-600">
                  {item.label}
                </NavLink>
                {item.children?.map(c => (
                  <Link key={c.label} to={c.to} onClick={() => setMobileOpen(false)}
                    className="block py-2 pl-4 text-sm text-gray-500 hover:text-primary-600">
                    — {c.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
