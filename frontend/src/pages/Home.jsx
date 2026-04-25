import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ArrowRight, Shield, Truck, Award, Leaf } from 'lucide-react';
import { getCategories, getProducts, getBlogPosts, getTestimonials } from '../lib/api';
import ProductCard from '../components/ProductCard';
import bannerImg from '../../assets/banner.jpg';

const benefits = [
  { icon: <Leaf size={28} className="text-green-600" />, title: '100% Tự Nhiên', desc: 'Không chất bảo quản, không phẩm màu nhân tạo, nguyên chất từ thiên nhiên' },
  { icon: <Shield size={28} className="text-blue-600" />, title: 'Kiểm Định An Toàn', desc: 'Sản phẩm được kiểm nghiệm tại phòng lab đạt chuẩn VSATTP Bộ Y Tế' },
  { icon: <Award size={28} className="text-amber-600" />, title: 'Chất Lượng Cao Cấp', desc: 'Yến sào tuyển chọn từ đảo Khánh Hòa và các vùng yến nổi tiếng Việt Nam' },
  { icon: <Truck size={28} className="text-primary-600" />, title: 'Giao Hàng Nhanh', desc: 'Ship toàn quốc, miễn phí đơn từ 500k, đảm bảo nguyên vẹn khi nhận hàng' },
];

function fmt(n) { return new Intl.NumberFormat('vi-VN').format(n) + 'đ'; }

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories);
    getProducts({ featured: 1, limit: 8 }).then(setFeatured);
    getProducts({ bestseller: 1, limit: 4 }).then(setBestsellers);
    getBlogPosts().then(d => setBlogs(d.slice(0, 3)));
    getTestimonials().then(setTestimonials);
  }, []);

  return (
    <div>
      {/* ===== HERO BANNER ===== */}
      <section className="w-full">
        <img
          src={bannerImg}
          alt="TARA NEST - Tinh Hoa Yến Sào Thiên Nhiên"
          className="w-full object-cover"
        />
      </section>

      {/* ===== BENEFITS ===== */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map(b => (
            <div key={b.title} className="flex flex-col md:flex-row items-center md:items-start gap-3 text-center md:text-left">
              <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center shrink-0">{b.icon}</div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm">{b.title}</h4>
                <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-14 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-primary-500 text-xs font-semibold tracking-widest uppercase mb-2">Danh Mục</p>
            <h2 className="section-title">Dòng Sản Phẩm TARA NEST</h2>
            <p className="section-sub">Khám phá đầy đủ các dòng yến sào cao cấp từ tự nhiên</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map(cat => (
              <Link key={cat.id} to={`/san-pham?category=${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] card-shadow">
                <img src={cat.image} alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={e => { e.target.src = 'https://placehold.co/400x300/E6F0EB/01472B?text=Yen+Sao'; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white font-bold text-sm leading-tight">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-primary-500 text-xs font-semibold tracking-widest uppercase mb-2">Nổi Bật</p>
            <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
            <p className="section-sub">Những sản phẩm được yêu thích nhất tại TARA NEST</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="text-center mt-8">
            <Link to="/san-pham" className="btn-outline inline-flex items-center gap-2">
              Xem Tất Cả Sản Phẩm <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== ABOUT BANNER ===== */}
      <section className="bg-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-gold text-xs font-semibold tracking-widest uppercase mb-3">Câu Chuyện Thương Hiệu</p>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-5">
              Từ Thiên Nhiên<br />Đến Bàn Ăn Của Bạn
            </h2>
            <p className="text-primary-200 leading-relaxed mb-5 text-sm md:text-base">
              TARA NEST được thành lập với sứ mệnh mang yến sào nguyên chất, an toàn và minh bạch đến từng gia đình Việt Nam. Chúng tôi hợp tác trực tiếp với các trang trại yến tại Khánh Hòa – vùng yến sào nổi tiếng nhất Việt Nam – để đảm bảo nguồn gốc rõ ràng, chất lượng tối ưu từ tổ đến tay khách hàng.
            </p>
            <div className="grid grid-cols-3 gap-6 mb-8">
              {[['5+', 'Năm kinh nghiệm'], ['10.000+', 'Khách hàng tin dùng'], ['100%', 'Hài lòng']].map(([num, label]) => (
                <div key={label} className="text-center">
                  <div className="text-gold text-2xl font-bold">{num}</div>
                  <div className="text-primary-300 text-xs mt-1">{label}</div>
                </div>
              ))}
            </div>
            <Link to="/gioi-thieu" className="inline-flex items-center gap-2 text-gold hover:text-white font-semibold transition-colors">
              Tìm Hiểu Thêm <ArrowRight size={16} />
            </Link>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=700&q=90"
              alt="TARA NEST Story" className="rounded-2xl object-cover h-72 md:h-96 w-full" />
            <div className="absolute -bottom-4 -left-4 bg-gold text-white p-4 rounded-xl shadow-xl max-w-48">
              <div className="text-2xl font-bold">★ 4.9/5</div>
              <div className="text-xs opacity-90">Đánh giá từ khách hàng</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BESTSELLERS ===== */}
      <section className="py-14 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-primary-500 text-xs font-semibold tracking-widest uppercase mb-2">Bán Chạy</p>
            <h2 className="section-title">Sản Phẩm Bán Chạy Nhất</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {bestsellers.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-primary-500 text-xs font-semibold tracking-widest uppercase mb-2">Khách Hàng Nói Gì</p>
            <h2 className="section-title">Đánh Giá Từ Khách Hàng</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.slice(0, 3).map(t => (
              <div key={t.id} className="bg-primary-50 rounded-2xl p-6 border border-primary-100">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5 italic">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold text-sm text-gray-800">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BLOG ===== */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-primary-500 text-xs font-semibold tracking-widest uppercase mb-2">Kiến Thức Sức Khỏe</p>
            <h2 className="section-title">Tin Tức & Blog</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {blogs.map(b => (
              <Link key={b.id} to={`/tin-tuc/${b.slug}`}
                className="bg-white rounded-2xl overflow-hidden card-shadow group">
                <div className="aspect-video overflow-hidden">
                  <img src={b.image} alt={b.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => { e.target.src = 'https://placehold.co/600x400/E6F0EB/01472B?text=Blog'; }} />
                </div>
                <div className="p-5">
                  <p className="text-xs text-primary-500 mb-2">{new Date(b.created_at).toLocaleDateString('vi-VN')}</p>
                  <h3 className="font-bold text-gray-800 text-sm leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors mb-2">{b.title}</h3>
                  <p className="text-gray-500 text-xs line-clamp-2">{b.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/tin-tuc" className="btn-outline inline-flex items-center gap-2">
              Xem Tất Cả Bài Viết <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Bắt Đầu Hành Trình Sức Khỏe Cùng TARA NEST</h2>
          <p className="text-primary-200 mb-8">Đặt hàng ngay hôm nay – giao hàng toàn quốc, miễn phí đơn từ 500.000đ</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/san-pham" className="bg-gold hover:bg-yellow-500 text-white font-semibold px-8 py-3 rounded-full transition-colors inline-flex items-center gap-2 justify-center">
              Mua Ngay <ArrowRight size={16} />
            </Link>
            <Link to="/lien-he" className="border-2 border-white text-white hover:bg-white hover:text-primary-800 font-semibold px-8 py-3 rounded-full transition-colors">
              Tư Vấn Miễn Phí
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
