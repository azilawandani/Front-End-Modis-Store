import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // TAMBAHKAN useLocation
import axios from 'axios';
import { Minus, Plus, X, Check, ShoppingCart, CreditCard, ChevronLeft, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext'; 

const DetailProduct = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // UNTUK MENANGKAP STATE (REKOMENDASI UKURAN)
  const { addToCart, setDirectOrder } = useCart(); 

  // --- STATE DATA DARI DATABASE ---
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  // --- FETCH DATA DARI BACKEND BERDASARKAN SLUG ---
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/products');
        const foundProduct = res.data.find((p) => p.slug === slug);
        
        if (foundProduct) {
          setProduct(foundProduct);
          
          // DEFAULT WARNA
          if (foundProduct.colors?.length > 0) setSelectedColor(foundProduct.colors[0].name);
          
          // --- LOGIKA AUTO-SELECT UKURAN ---
          // Jika ada rekomendasi ukuran dari halaman sebelumnya, langsung pilihkan ukuran tersebut
          if (location.state?.recommendedSize && foundProduct.sizes.includes(location.state.recommendedSize)) {
            setSelectedSize(location.state.recommendedSize);
          } else if (foundProduct.sizes?.length > 0) {
            setSelectedSize(foundProduct.sizes[0]);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error("Gagal mengambil detail produk:", err);
        setLoading(false);
      }
    };
    fetchProductDetail();
    window.scrollTo(0, 0);
  }, [slug, location.state]);

  const formatPrice = (price) => {
    return `Rp ${Number(price).toLocaleString('id-ID')}`;
  };

  const getSelectedProductData = () => {
    return {
      id: product._id,
      name: product.name,
      price: product.price,
      img: product.img, 
      slug: product.slug,
      color: selectedColor,
      size: selectedSize,
      qty: quantity 
    };
  };

  const handleAddToCart = () => {
    addToCart(getSelectedProductData());
    navigate('/cart');
  };

  const handleBuyNow = () => {
    const directProduct = getSelectedProductData();
    setDirectOrder(directProduct); 
    navigate('/checkout?mode=direct');
  };

  if (loading) {
    return (
      <div className="container py-5 mt-5 text-center">
        <div className="spinner-border text-dark" role="status"></div>
        <p className="mt-3">Memuat detail koleksi Modis...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 mt-5 text-center">
        <h4 className="text-muted mb-4">Maaf, produk tidak ditemukan.</h4>
        <button className="btn btn-dark px-4 py-2" onClick={() => navigate('/produk')}>Kembali ke Katalog</button>
      </div>
    );
  }

  return (
    <div className="bg-white min-vh-100 py-4 py-md-5 text-start">
      <div className="container mt-4 mt-md-5">
        
        <button onClick={() => navigate(-1)} className="btn btn-link text-decoration-none text-dark d-flex align-items-center gap-1 mb-4 d-md-none">
          <ChevronLeft size={20} /> Kembali
        </button>

        <div className="card border-0 shadow-lg rounded-4 overflow-hidden p-3 p-md-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0" style={{ color: '#4A4A2A', letterSpacing: '2px' }}>MODIS STORE</h4>
            <button onClick={() => navigate(-1)} className="btn border-0 p-2 rounded-circle bg-light d-flex align-items-center justify-content-center shadow-sm">
              <X size={20} />
            </button>
          </div>

          <div className="row g-4 g-lg-5">
            <div className="col-lg-6">
              <div className="bg-light rounded-4 overflow-hidden d-flex align-items-center justify-content-center p-3" style={{ minHeight: '400px' }}>
                <img 
                  src={product.img} 
                  alt={product.name} 
                  className="img-fluid object-fit-contain shadow-sm rounded-3" 
                  style={{ maxHeight: '550px', width: 'auto' }}
                />
              </div>
              
              <div className="mt-4 mt-md-5 text-start px-1">
                <h6 className="fw-bold text-uppercase mb-3" style={{ letterSpacing: '1px' }}>Karakteristik Produk</h6>
                <p className="text-muted small lh-lg" style={{ textAlign: 'justify' }}>
                  {product.description}
                </p>
                
                <div className="row mt-4 g-2">
                  {product.features?.map((feat, idx) => (
                    <div key={idx} className="col-6">
                      <div className="d-flex align-items-center gap-2 small text-muted">
                        <div className="p-1 bg-success bg-opacity-10 rounded-circle flex-shrink-0">
                          <Check size={12} className="text-success" />
                        </div>
                        <span className="text-truncate">{idx === 0 ? `Bahan: ${feat}` : feat}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-6 ps-lg-5 text-start">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb small mb-2">
                  <li className="breadcrumb-item text-muted">{product.category}</li>
                  <li className="breadcrumb-item active text-dark fw-bold">{product.name}</li>
                </ol>
              </nav>
              
              <h1 className="fw-bold mb-2 h2">{product.name}</h1>
              <h3 className="text-warning fw-bold mb-4">
                {formatPrice(product.price)}
              </h3>

              <hr className="my-4 opacity-50" />

              {/* Varian Warna */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-4">
                  <p className="small fw-bold mb-3 text-uppercase">Pilih Warna: <span className="text-muted fw-normal">{selectedColor}</span></p>
                  <div className="d-flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <div 
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className="rounded-circle border cursor-pointer d-flex align-items-center justify-content-center transition-all shadow-sm"
                        style={{ 
                          width: '35px', 
                          height: '35px', 
                          backgroundColor: '#f8f9fa',
                          outline: selectedColor === color.name ? '2px solid #4A4A2A' : '1px solid #dee2e6',
                          outlineOffset: '3px'
                        }}
                      >
                        <span style={{ fontSize: '10px', fontWeight: 'bold' }}>{color.name.charAt(0)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Varian Ukuran dengan Fitur Auto-Select & Label Recommended */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-4 pt-2">
                  <p className="small fw-bold mb-3 text-uppercase">Pilih Ukuran</p>
                  <div className="d-flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`btn btn-sm px-4 py-2 rounded-2 transition-all fw-bold position-relative ${
                          selectedSize === size ? 'btn-dark' : 'btn-outline-secondary'
                        }`}
                        style={{ minWidth: '65px' }}
                      >
                        {size}
                        {/* LABEL RECOMMENDED JIKA SESUAI DENGAN PROFIL USER */}
                        {location.state?.recommendedSize === size && (
                          <span className="position-absolute top-0 start-50 translate-middle-y badge rounded-pill bg-warning text-dark border border-white" style={{ fontSize: '8px', marginTop: '-5px' }}>
                             <Sparkles size={8} className="me-1" />REC
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-5 pt-2">
                <p className="small fw-bold mb-3 text-uppercase">Kuantitas</p>
                <div className="d-flex align-items-center border rounded-2 p-1 bg-light" style={{ width: 'fit-content' }}>
                  <button className="btn btn-sm px-3 border-0 shadow-none" onClick={() => quantity > 1 && setQuantity(quantity - 1)}>
                    <Minus size={16} />
                  </button>
                  <input type="text" className="form-control form-control-sm border-0 bg-transparent text-center fw-bold shadow-none" value={quantity} readOnly style={{ width: '50px' }} />
                  <button className="btn btn-sm px-3 border-0 shadow-none" onClick={() => setQuantity(quantity + 1)}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="d-grid gap-3 pt-2">
                <button onClick={handleBuyNow} className="btn btn-lg text-white py-3 fw-bold rounded-3 shadow d-flex align-items-center justify-content-center gap-2" style={{ backgroundColor: '#4A4A2A', border: 'none' }}>
                  <CreditCard size={20} /> Beli Sekarang
                </button>
                <button onClick={handleAddToCart} className="btn btn-lg btn-outline-dark py-3 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2">
                  <ShoppingCart size={20} /> Masukkan Keranjang
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;