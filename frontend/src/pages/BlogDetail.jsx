import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { getBlogPost, getBlogPosts } from '../lib/api';

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [others, setOthers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getBlogPost(slug), getBlogPosts()]).then(([p, all]) => {
      setPost(p);
      setOthers(all.filter(x => x.slug !== slug).slice(0, 3));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-16 animate-pulse">
      <div className="h-10 bg-gray-200 rounded mb-4 w-3/4" />
      <div className="h-64 bg-gray-200 rounded-2xl mb-6" />
      <div className="space-y-3">
        {[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-gray-200 rounded" />)}
      </div>
    </div>
  );

  if (!post) return (
    <div className="text-center py-24 text-gray-400">
      <p>Không tìm thấy bài viết</p>
      <Link to="/tin-tuc" className="mt-4 inline-block text-primary-600 hover:underline text-sm">← Quay lại blog</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-10">
        {/* Article */}
        <article className="flex-1 bg-white rounded-2xl shadow-sm overflow-hidden">
          <img src={post.image} alt={post.title}
            className="w-full h-64 md:h-80 object-cover"
            onError={e => { e.target.src = 'https://placehold.co/800x400/FFF8EE/C8861A?text=Blog'; }} />
          <div className="p-6 md:p-10">
            <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
              <span className="flex items-center gap-1"><Calendar size={12} />{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
              <span className="flex items-center gap-1"><User size={12} />{post.author}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-snug">{post.title}</h1>
            <div className="text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
              {post.content}
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100">
              <Link to="/tin-tuc" className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm">
                <ArrowLeft size={16} /> Quay Lại Blog
              </Link>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:w-72 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-24">
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-4">Bài Viết Khác</h3>
            <div className="space-y-4">
              {others.map(b => (
                <Link key={b.id} to={`/tin-tuc/${b.slug}`} className="flex gap-3 group">
                  <img src={b.image} alt={b.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                    onError={e => { e.target.src = 'https://placehold.co/64x64/FFF8EE/C8861A?text=B'; }} />
                  <div>
                    <p className="text-xs text-gray-400 mb-1">{new Date(b.created_at).toLocaleDateString('vi-VN')}</p>
                    <p className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-primary-700 transition-colors">{b.title}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100">
              <div className="bg-primary-50 rounded-xl p-4 text-center">
                <p className="text-sm font-bold text-primary-800 mb-2">Tư Vấn Miễn Phí</p>
                <p className="text-xs text-gray-500 mb-3">Gọi ngay để được tư vấn sản phẩm phù hợp</p>
                <a href="tel:0909123456" className="btn-primary text-sm block">0909 123 456</a>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
