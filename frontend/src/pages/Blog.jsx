import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { getBlogPosts } from '../lib/api';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogPosts().then(d => { setPosts(d); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-primary-900 text-white py-14 text-center">
        <p className="text-gold text-xs tracking-widest uppercase mb-2">Kiến Thức Sức Khỏe</p>
        <h1 className="text-3xl font-bold">Tin Tức & Blog</h1>
        <p className="text-primary-300 mt-3 text-sm">Chia sẻ kiến thức về yến sào và sức khỏe từ chuyên gia</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {loading ? (
          <div className="space-y-6">
            {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-52 animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post, i) => (
              <Link key={post.id} to={`/tin-tuc/${post.slug}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row group">
                <div className={`md:w-72 shrink-0 aspect-video md:aspect-auto overflow-hidden ${i === 0 ? 'md:w-80' : ''}`}>
                  <img src={post.image} alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => { e.target.src = 'https://placehold.co/600x400/FFF8EE/C8861A?text=Blog'; }} />
                </div>
                <div className="p-6 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><Calendar size={12} />{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                    <span className="flex items-center gap-1"><User size={12} />{post.author}</span>
                  </div>
                  <h2 className="font-bold text-gray-800 text-lg leading-snug mb-3 group-hover:text-primary-700 transition-colors line-clamp-2">{post.title}</h2>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>
                  <span className="text-primary-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Đọc Tiếp <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
