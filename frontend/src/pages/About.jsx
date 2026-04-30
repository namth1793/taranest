import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Shield, Award, Heart, ArrowRight } from 'lucide-react';
import api from '../lib/api';

const values = [
  { icon: <Leaf size={32} className="text-green-600" />, title: 'Tự Nhiên & Thuần Khiết', desc: 'Mọi sản phẩm đều 100% tự nhiên, không chất bảo quản, không phẩm màu nhân tạo. Yến sào được khai thác và chế biến theo quy trình nghiêm ngặt.' },
  { icon: <Shield size={32} className="text-blue-600" />, title: 'Minh Bạch Nguồn Gốc', desc: 'Chúng tôi công bố đầy đủ thông tin về nguồn gốc sản phẩm. Mọi lô hàng đều có giấy kiểm định chất lượng từ cơ quan có thẩm quyền.' },
  { icon: <Award size={32} className="text-amber-500" />, title: 'Chất Lượng Hàng Đầu', desc: 'Chỉ chọn những tổ yến đạt tiêu chuẩn chất lượng cao nhất từ đảo Khánh Hòa. Quy trình chế biến hiện đại kết hợp kinh nghiệm truyền thống.' },
  { icon: <Heart size={32} className="text-red-500" />, title: 'Tận Tâm Phục Vụ', desc: 'Đội ngũ tư vấn luôn sẵn sàng hỗ trợ 7 ngày/tuần. Chúng tôi coi sức khỏe của khách hàng là ưu tiên hàng đầu.' },
];

const DEFAULT_STATS = [
  { num: '10.000+', label: 'Khách hàng tin dùng' },
  { num: '5+', label: 'Năm kinh nghiệm' },
  { num: '20+', label: 'Sản phẩm đa dạng' },
  { num: '4.9/5', label: 'Đánh giá trung bình' },
];
const DEFAULT_TEAM = [
  { name: 'Nguyễn Thành Đạt', role: 'Nhà Sáng Lập & CEO', img: 'https://i.pravatar.cc/200?img=68', desc: 'Hơn 10 năm kinh nghiệm trong ngành thực phẩm cao cấp và yến sào. Tốt nghiệp Đại học Kinh tế TP.HCM.' },
  { name: 'Trần Thị Minh Anh', role: 'Giám Đốc Chất Lượng', img: 'https://i.pravatar.cc/200?img=47', desc: 'Chuyên gia dinh dưỡng với 8 năm nghiên cứu về yến sào và thực phẩm chức năng. Thạc sĩ Công nghệ Thực phẩm.' },
  { name: 'Lê Văn Phúc', role: 'Quản Lý Khai Thác', img: 'https://i.pravatar.cc/200?img=12', desc: 'Người con của Khánh Hòa với 15 năm kinh nghiệm khai thác và sơ chế yến sào từ các đảo tự nhiên.' },
];
const DEFAULT_MILESTONES = [
  { year: '2019', event: 'TARA NEST ra đời tại Hà Nội với cửa hàng đầu tiên' },
  { year: '2020', event: 'Mở rộng sang TP.HCM, đạt 1.000 khách hàng thân thiết' },
  { year: '2021', event: 'Ra mắt dòng sản phẩm yến chưng tươi và website bán hàng online' },
  { year: '2022', event: 'Đạt chứng nhận VSATTP, hợp tác với 5 trang trại yến lớn tại Khánh Hòa' },
  { year: '2023', event: 'Đạt mốc 5.000 đơn/tháng, ra mắt dòng sản phẩm Baby và Set Quà Tặng' },
  { year: '2024', event: 'Mở rộng toàn quốc, 10.000+ khách hàng tin dùng trên cả nước' },
];
const DEFAULT_STORY = {
  heading: 'Từ Đam Mê Đến Sứ Mệnh',
  para1: 'TARA NEST được thành lập năm 2019 bởi một nhóm những người yêu sức khỏe và trân trọng các giá trị tự nhiên. Xuất phát từ câu chuyện cá nhân của người sáng lập – khi chứng kiến sức khỏe của cha mẹ được cải thiện rõ rệt nhờ yến sào – chúng tôi quyết tâm xây dựng một thương hiệu yến sào đáng tin cậy, minh bạch và chất lượng.',
  para2: 'Chúng tôi tin rằng thiên nhiên có đủ những gì cơ thể cần. Sứ mệnh của TARA NEST là kết nối nguồn dưỡng chất quý giá từ tổ yến tự nhiên đến tay từng gia đình Việt, với quy trình kiểm soát chất lượng nghiêm ngặt và giá cả minh bạch.',
  para3: 'Hơn 5 năm xây dựng và phát triển, TARA NEST tự hào đã phục vụ hơn 10.000 khách hàng trên toàn quốc với tỷ lệ hài lòng 4.9/5 sao.',
};

export default function About() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    api.get('/about-content').then(r => setContent(r.data)).catch(() => {});
  }, []);

  const story = content?.about_story || DEFAULT_STORY;
  const stats = content?.about_stats || DEFAULT_STATS;
  const team = content?.about_team || DEFAULT_TEAM;
  const milestones = content?.about_milestones || DEFAULT_MILESTONES;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1600&q=90"
          alt="About TARA NEST" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary-900/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p className="text-gold text-xs tracking-widest uppercase mb-2">Về Chúng Tôi</p>
          <h1 className="text-white text-3xl md:text-4xl font-bold">TARA NEST</h1>
          <p className="text-primary-200 mt-3 text-sm max-w-xl">Tinh Hoa Yến Sào Thiên Nhiên – Sứ Mệnh Mang Sức Khỏe Đến Mọi Gia Đình</p>
        </div>
      </div>

      {/* Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-primary-500 text-xs font-semibold tracking-widest uppercase mb-3">Câu Chuyện Thương Hiệu</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-5">{story.heading}</h2>
            <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
              {story.para1 && <p>{story.para1}</p>}
              {story.para2 && <p>{story.para2}</p>}
              {story.para3 && <p>{story.para3}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=500&q=80"
              alt="Yến sào" className="rounded-2xl w-full object-cover aspect-square" />
            <img src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80"
              alt="Saffron" className="rounded-2xl w-full object-cover aspect-square mt-6" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary-600 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.num}</div>
              <div className="text-primary-200 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary-500 text-xs font-semibold tracking-widest uppercase mb-2">Giá Trị Cốt Lõi</p>
            <h2 className="text-3xl font-bold text-gray-900">Những Điều Chúng Tôi Tin Tưởng</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(v => (
              <motion.div key={v.title}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">{v.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary-500 text-xs font-semibold tracking-widest uppercase mb-2">Hành Trình</p>
            <h2 className="text-3xl font-bold text-gray-900">Lịch Sử Phát Triển</h2>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-primary-100" />
            {milestones.map((m, i) => (
              <div key={m.year} className={`flex items-center gap-6 mb-8 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <div className="inline-block bg-white rounded-xl shadow-sm border border-primary-100 p-4">
                    <p className="text-xs text-primary-500 font-semibold mb-1">{m.year}</p>
                    <p className="text-sm text-gray-700">{m.event}</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold shrink-0 z-10 border-4 border-white shadow">
                  {i + 1}
                </div>
                <div className="flex-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary-500 text-xs font-semibold tracking-widest uppercase mb-2">Đội Ngũ</p>
            <h2 className="text-3xl font-bold text-gray-900">Con Người Đứng Sau TARA NEST</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {team.map((m, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <img src={m.img} alt={m.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-4 border-primary-100" />
                <h3 className="font-bold text-gray-800">{m.name}</h3>
                <p className="text-primary-600 text-xs font-medium mb-3">{m.role}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-800 text-white py-14 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Cùng Nhau Chăm Sóc Sức Khỏe</h2>
          <p className="text-primary-200 mb-8">Hãy để TARA NEST đồng hành cùng hành trình sức khỏe của gia đình bạn</p>
          <Link to="/san-pham" className="bg-gold hover:bg-amber-500 text-white font-semibold px-10 py-3 rounded-full transition-colors inline-flex items-center gap-2">
            Khám Phá Sản Phẩm <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
