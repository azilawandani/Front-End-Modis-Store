import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; 
import axios from 'axios'; // IMPORT AXIOS
import ProductCard from '../components/ProductCard';

const ProductPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const q = queryParams.get('q') || ''; 

  // --- STATE DATA ASLI DARI DATABASE ---
  const [products, setProducts] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState(q); 
  const [visibleItems, setVisibleItems] = useState(8);
  const [loading, setLoading] = useState(true);

  // --- AMBIL DATA DARI BACKEND ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get('https://back-end-modis-store.vercel.app/api/products');
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Gagal mengambil produk asli:", err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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
      {/* Header Tetap Sama */}
      <div className="relative position-relative" style={{ height: '400px' }}>
        <img src="/assets/product-header-bg.jpg" alt="Header" className="w-100 h-100 object-fit-cover" />
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center bg-dark bg-opacity-25">
          <div className="container px-4 px-md-5 text-white text-center">
            <h1 className="display-5 fw-bold font-serif italic mb-2">Our Collections</h1>
            <p className="lead opacity-75">
               {searchQuery ? `Hasil pencarian untuk "${searchQuery}"` : "Temukan koleksi muslim wear terbaik kami."}
            </p>
          </div>
        </div>
      </div>

      <div className="container py-5">
        {/* Kontrol Kategori */}
        <div className="row g-3 mb-5 align-items-center">
          <div className="col-md-8 text-center text-md-start">
            {searchQuery && (
              <p className="mb-0 text-muted">
                Menampilkan {filteredProducts.length} produk untuk <strong>"{searchQuery}"</strong>
                <span className="ms-2 cursor-pointer text-danger small" style={{cursor: 'pointer'}} onClick={() => setSearchQuery('')}>(Hapus)</span>
              </p>
            )}
          </div>
          <div className="col-md-4">
            <div className="d-flex align-items-center border px-3 py-2 rounded shadow-sm bg-light">
              <span className="small text-muted me-2 fw-bold text-uppercase" style={{ fontSize: '10px' }}>FILTER:</span>
              <select 
                className="form-select form-select-sm border-0 bg-transparent fw-bold text-uppercase shadow-none"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="Semua">Semua Produk</option>
                <option value="Gamis">Gamis</option>
                <option value="Hijab">Hijab</option>
                <option value="Mukena">Mukena</option>
                <option value="Baju">Baju</option>
              </select>
            </div>
          </div>
        </div>

        {/* --- TAMPILAN PRODUK --- */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-dark" role="status"></div>
            <p className="mt-3">Memuat produk Modis...</p>
          </div>
        ) : (
          <div className="row g-4 g-md-5">
            {filteredProducts.slice(0, visibleItems).map((item) => (
              <div key={item._id} className="col-6 col-md-4 col-lg-3">
                <ProductCard 
                  name={item.name} 
                  // Karena di database price berupa angka, kita format ke Rupiah
                  price={`Rp ${item.price.toLocaleString()}`} 
                  image={item.img} 
                  slug={item.slug} 
                />
              </div>
            ))}
          </div>
        )}

        {/* Not Found */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-5">
            <h5 className="text-muted">Maaf, koleksi belum tersedia.</h5>
            <button className="btn btn-link text-dark" onClick={() => {setSearchQuery(''); setSelectedCategory('Semua');}}>Reset Filter</button>
          </div>
        )}

        {/* Load More */}
        {!loading && visibleItems < filteredProducts.length && (
          <div className="mt-5 pt-5 text-center">
            <button 
              onClick={handleLoadMore}
              className="btn btn-dark btn-lg px-5 py-3 shadow-sm rounded-0 border-0" 
              style={{ backgroundColor: '#4A4A2A', fontSize: '12px', letterSpacing: '2px' }}
            >
              TAMPILKAN LEBIH BANYAK →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;