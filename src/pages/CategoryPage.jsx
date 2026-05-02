import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios'; 
import ProductCard from '../components/ProductCard';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState(8);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/products');
      
      const filtered = res.data.filter(
        (item) => item.category.toLowerCase() === categoryName?.toLowerCase()
      );
      
      setProducts(filtered);
      setLoading(false);
    } catch (err) {
      console.error("Gagal mengambil data kategori:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    setVisibleItems(8); 
  }, [categoryName]);

  const handleLoadMore = () => {
    setVisibleItems((prev) => prev + 4);
  };

  return (
    <div className="bg-white min-vh-100 mt-5">
      {/* Banner Section */}
      <div className="position-relative w-100 overflow-hidden" style={{ height: '350px' }}>
        <img 
          src={
            categoryName === 'hijab' ? '/assets/banner-hijab.jpg' :
            categoryName === 'gamis' ? '/assets/banner-gamis.jpg' :
            categoryName === 'mukena' ? '/assets/banner-mukena.jpg' :
            '/assets/banner-blouse.jpg'
          } 
          alt={categoryName} 
          className="w-100 h-100 object-fit-cover"
        />
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-25">
          <h1 className="text-white fw-bold display-3 font-serif text-uppercase" style={{ letterSpacing: '0.3em', textShadow: '2px 2px 10px rgba(0,0,0,0.3)' }}>
            {categoryName === 'baju' ? 'BAJU & BLOUSE' : categoryName}
          </h1>
        </div>
      </div>

      <div className="container py-5 mt-4 text-start">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h4 className="fw-bold border-start border-4 border-dark ps-3 mb-0 text-uppercase">
            KOLEKSI {categoryName}
          </h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 small uppercase fw-bold">
              <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/produk" className="text-decoration-none text-muted">Produk</Link></li>
              <li className="breadcrumb-item active text-dark text-uppercase font-bold" aria-current="page">{categoryName}</li>
            </ol>
          </nav>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="row g-4 g-md-5">
              {products.slice(0, visibleItems).map((item) => (
                <div key={item._id} className="col-6 col-md-4 col-lg-3">
                  <ProductCard 
                    name={item.name}
                    // PERUBAHAN DI SINI: Format harga menjadi Rp. 150.000
                    price={`Rp. ${item.price.toLocaleString('id-ID')}`}
                    image={item.img}
                    slug={item.slug}
                  />
                </div>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-5">
                <p className="text-muted">Produk kategori "{categoryName}" belum tersedia.</p>
              </div>
            )}

            {visibleItems < products.length && (
              <div className="mt-5 pt-5 text-center">
                <button 
                  onClick={handleLoadMore}
                  className="btn btn-dark btn-lg px-5 py-3 shadow-sm rounded-0 border-0" 
                  style={{ backgroundColor: '#4A4A2A', fontSize: '13px', letterSpacing: '2px' }}
                >
                  TAMPILKAN LEBIH BANYAK <span className="ms-2">→</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;