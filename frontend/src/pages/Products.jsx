import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, X, Search } from 'lucide-react';
import { getProducts, getCategories } from '../lib/api';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

  const catSlug = searchParams.get('category') || '';
  const searchQ = searchParams.get('search') || '';

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (catSlug) params.category = catSlug;
    if (searchQ) params.search = searchQ;
    getProducts(params).then(d => { setProducts(d); setLoading(false); });
    setLocalSearch(searchQ);
  }, [catSlug, searchQ]);

  const currentCat = categories.find(c => c.slug === catSlug);

  const handleSearch = (e) => {
    e.preventDefault();
    const p = new URLSearchParams(searchParams);
    if (localSearch.trim()) p.set('search', localSearch.trim());
    else p.delete('search');
    p.delete('category');
    setSearchParams(p);
  };

  const setCategory = (slug) => {
    const p = new URLSearchParams();
    if (slug) p.set('category', slug);
    setSearchParams(p);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-primary-50 border-b border-primary-100 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-primary-600">Trang chủ</Link>
            <span>›</span>
            <span className="text-gray-800 font-medium">
              {currentCat ? currentCat.name : searchQ ? `Tìm: "${searchQ}"` : 'Tất Cả Sản Phẩm'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className={`lg:w-60 shrink-0 ${filterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-24">
              {/* Search */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <input value={localSearch} onChange={e => setLocalSearch(e.target.value)}
                    placeholder="Tìm sản phẩm..."
                    className="w-full border border-gray-200 rounded-full px-4 py-2 text-sm pr-10 focus:outline-none focus:border-primary-400" />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600">
                    <Search size={15} />
                  </button>
                </div>
              </form>

              {/* Categories */}
              <div>
                <h3 className="font-bold text-gray-800 text-sm mb-3 uppercase tracking-wider">Danh Mục</h3>
                <ul className="space-y-1">
                  <li>
                    <button onClick={() => setCategory('')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!catSlug ? 'bg-primary-600 text-white font-semibold' : 'text-gray-700 hover:bg-primary-50'}`}>
                      Tất Cả Sản Phẩm
                    </button>
                  </li>
                  {categories.map(cat => (
                    <li key={cat.id}>
                      <button onClick={() => setCategory(cat.slug)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${catSlug === cat.slug ? 'bg-primary-600 text-white font-semibold' : 'text-gray-700 hover:bg-primary-50'}`}>
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-bold text-gray-800 text-xl">
                  {currentCat ? currentCat.name : searchQ ? `Kết quả: "${searchQ}"` : 'Tất Cả Sản Phẩm'}
                </h1>
                <p className="text-gray-500 text-sm mt-0.5">{products.length} sản phẩm</p>
              </div>
              <button onClick={() => setFilterOpen(v => !v)}
                className="lg:hidden flex items-center gap-2 text-sm border border-gray-200 px-3 py-2 rounded-lg">
                <SlidersHorizontal size={15} /> Lọc
              </button>
            </div>

            {/* Active filter chips */}
            {(catSlug || searchQ) && (
              <div className="flex gap-2 mb-5 flex-wrap">
                {catSlug && (
                  <span className="flex items-center gap-1 bg-primary-100 text-primary-700 text-xs px-3 py-1.5 rounded-full">
                    {currentCat?.name}
                    <button onClick={() => setCategory('')}><X size={12} /></button>
                  </span>
                )}
                {searchQ && (
                  <span className="flex items-center gap-1 bg-primary-100 text-primary-700 text-xs px-3 py-1.5 rounded-full">
                    Tìm: {searchQ}
                    <button onClick={() => { setSearchParams({}); setLocalSearch(''); }}><X size={12} /></button>
                  </span>
                )}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <div className="text-5xl mb-4">🫙</div>
                <p className="font-medium">Không tìm thấy sản phẩm</p>
                <button onClick={() => setSearchParams({})} className="mt-4 text-sm text-primary-600 hover:underline">
                  Xem tất cả sản phẩm
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
