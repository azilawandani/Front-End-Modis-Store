import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; 
import ProductCard from '../components/ProductCard';

const ProductPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const q = queryParams.get('q') || ''; 

  // DATA PRODUK DENGAN TAMBAHAN SLUG
  const products = [
    { id: 1, slug: 'abaya-turki', name: 'Abaya Turki', price: 'Rp 195.000', img: '/assets/abaya-turki.jpg', category: 'Gamis' },
    { id: 2, slug: 'kemeja', name: 'Kemeja', price: 'Rp 80.000', img: '/assets/kemeja.jpg', category: 'Baju' },
    { id: 3, slug: 'tunik', name: 'Tunik', price: 'Rp 100.000', img: '/assets/tunik.jpg', category: 'Baju' },
    { id: 4, slug: 'blouse-barkat', name: 'Blouse Barkat', price: 'Rp 120.000', img: '/assets/blouse-barkat.jpg', category: 'Baju' },
    { id: 5, slug: 'blouse-balon', name: 'Blouse Balon', price: 'Rp 130.000', img: '/assets/blouse-balon.jpg', category: 'Baju' },
    { id: 6, slug: 'baju-casual', name: 'Baju', price: 'Rp 200.000', img: '/assets/Baju.jpg', category: 'Baju' },
    { id: 7, slug: 'mukena-premium', name: 'Mukena', price: 'Rp 160.000', img: '/assets/Mukena.jpg', category: 'Mukena' },
    { id: 8, slug: 'viscose-set', name: 'Viscose', price: 'Rp 140.000', img: '/assets/Viscose.jpg', category: 'Hijab' },
    { id: 9, slug: 'pashmina-silk', name: 'Pashmina Silk', price: 'Rp 45.000', img: '/assets/v1.jpg', category: 'Hijab' },
    { id: 10, slug: 'gamis-aisyah', name: 'Gamis Aisyah', price: 'Rp 210.000', img: '/assets/g1.jpg', category: 'Gamis' },
    { id: 11, slug: 'blouse-rumple', name: 'Blouse Rumple', price: 'Rp 145.000', img: '/assets/baju1.jpg', category: 'Baju' },
    { id: 12, slug: 'blouse-kanaya', name: 'Blouse Kanaya', price: 'Rp 80.000', img: '/assets/baju2.jpg', category: 'Baju' },
    { id: 13, slug: 'tunik-elis', name: 'Tunik Elis', price: 'Rp 100.000', img: '/assets/tu1.jpg', category: 'Baju' },
    { id: 14, slug: 'tunik-maya', name: 'Tunik Maya', price: 'Rp 120.000', img: '/assets/tu2.jpg', category: 'Baju' },
    { id: 15, slug: 'mukena-miskah', name: 'Mukena Miskah', price: 'Rp 130.000', img: '/assets/m1.jpg', category: 'Mukena' },
    { id: 16, slug: 'mukena-aisyah', name: 'Mukena Aisyah', price: 'Rp 200.000', img: '/assets/m2.jpg', category: 'Mukena' },
    { id: 17, slug: 'mukena-manis', name: 'Mukena Manis', price: 'Rp 160.000', img: '/assets/m3.jpg', category: 'Mukena' },
    { id: 18, slug: 'gamis-airya', name: 'Gamis Airya', price: 'Rp 140.000', img: '/assets/g8.jpg', category: 'Gamis' },
    { id: 19, slug: 'hijab-motif', name: 'Hijab Motif', price: 'Rp 45.000', img: '/assets/v9.jpg', category: 'Hijab' },
    { id: 20, slug: 'gamis-aminah', name: 'Gamis Aminah', price: 'Rp 210.000', img: '/assets/g10.jpg', category: 'Gamis' },
    { id: 21, slug: 'mukena-marisca', name: 'Mukena Marisca', price: 'Rp 200.000', img: '/assets/m5.jpg', category: 'Mukena' },
    { id: 22, slug: 'mukena-arab', name: 'Mukena Arab', price: 'Rp 160.000', img: '/assets/m6.jpg', category: 'Mukena' },
    { id: 23, slug: 'mukena-anisa', name: 'Mukena Anisa', price: 'Rp 140.000', img: '/assets/m7.jpg', category: 'Mukena' },
    { id: 24, slug: 'mukena-rumple', name: 'Mukena Rumple', price: 'Rp 45.000', img: '/assets/m8.jpg', category: 'Mukena' },
    { id: 25, slug: 'gamis-raya', name: 'Gamis Raya', price: 'Rp 195.000', img: '/assets/g3.jpg', category: 'Gamis' },
    { id: 26, slug: 'gamis-manisa', name: 'Gamis Manisa', price: 'Rp 195.000', img: '/assets/g4.jpg', category: 'Gamis' },
    { id: 27, slug: 'gamis-bangkok', name: 'Gamis Bangkok', price: 'Rp 195.000', img: '/assets/g5.jpg', category: 'Gamis' },
    { id: 28, slug: 'gamis-viral', name: 'Gamis Viral', price: 'Rp 195.000', img: '/assets/g7.jpg', category: 'Gamis' },
  ];

  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState(q); 
  const [visibleItems, setVisibleItems] = useState(8);

  useEffect(() => {
    setSearchQuery(q);
    setVisibleItems(8); 
  }, [q]);

  const filteredProducts = products.filter((item) => {
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLoadMore = () => {
    setVisibleItems((prevValue) => prevValue + 8);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setVisibleItems(8);
  };

  return (
    <div className="bg-white min-vh-100">
      <div className="relative position-relative" style={{ height: '500px' }}>
        <img src="/assets/product-header-bg.jpg" alt="Header" className="w-100 h-100 object-fit-cover" />
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center bg-dark bg-opacity-25">
          <div className="container px-4 px-md-5 text-white">
            <h1 className="display-5 fw-bold font-serif italic mb-2">Muslim Wear Product</h1>
            <p className="lead opacity-75">
               {searchQuery ? `Hasil pencarian untuk "${searchQuery}"` : "Temukan koleksi muslim wear terbaik kami."}
            </p>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-3 mb-5 align-items-center">
          <div className="col-md-8">
            {searchQuery && (
              <p className="mb-0 text-muted">
                Menampilkan {filteredProducts.length} produk untuk kata kunci <strong>"{searchQuery}"</strong>
                <span className="ms-2 cursor-pointer text-danger small" style={{cursor: 'pointer'}} onClick={() => setSearchQuery('')}>(Hapus)</span>
              </p>
            )}
          </div>

          <div className="col-md-4">
            <div className="d-flex align-items-center border px-3 py-2 rounded shadow-sm bg-light">
              <span className="small text-muted me-2 fw-bold text-uppercase" style={{ fontSize: '10px' }}>KATEGORI:</span>
              <select 
                className="form-select form-select-sm border-0 bg-transparent fw-bold text-uppercase shadow-none cursor-pointer"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="Semua">Semua</option>
                <option value="Gamis">Gamis</option>
                <option value="Hijab">Hijab</option>
                <option value="Mukena">Mukena</option>
                <option value="Baju">Baju</option>
              </select>
            </div>
          </div>
        </div>

        <div className="row g-4 g-md-5">
          {filteredProducts.slice(0, visibleItems).map((item) => (
            <div key={item.id} className="col-6 col-md-4 col-lg-3">
              {/* SLUG DIKIRIM KE SINI */}
              <ProductCard 
                name={item.name} 
                price={item.price} 
                image={item.img} 
                slug={item.slug} 
              />
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-5">
            <h5 className="text-muted">Maaf, produk tidak ditemukan.</h5>
            <button className="btn btn-link text-dark" onClick={() => {setSearchQuery(''); setSelectedCategory('Semua');}}>Lihat semua produk</button>
          </div>
        )}

        {visibleItems < filteredProducts.length && (
          <div className="mt-5 pt-5 text-center">
            <button 
              onClick={handleLoadMore}
              className="btn btn-dark btn-lg px-5 py-3 shadow-sm rounded-0 border-0" 
              style={{ backgroundColor: '#4A4A2A', fontSize: '14px', letterSpacing: '2px' }}
            >
              LIHAT LAINNYA →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;