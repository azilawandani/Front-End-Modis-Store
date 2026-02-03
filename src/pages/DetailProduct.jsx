import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { Minus, Plus, X, Check, ShoppingCart, CreditCard, ChevronLeft } from 'lucide-react';
import { useCart } from '../context/CartContext'; 

const DetailProduct = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  // Ambil fungsi addToCart untuk keranjang umum
  // Ambil fungsi setDirectOrder untuk pembelian instan
  const { addToCart, setDirectOrder } = useCart(); 
  
  const product = products.find((p) => p.slug === slug);

  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return `Rp ${price.toLocaleString('id-ID')}`;
    }
    return price;
  };

  useEffect(() => {
    if (product) {
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0].name);
      }
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
    }
    window.scrollTo(0, 0);
  }, [product]);

  // Fungsi Helper untuk menyiapkan data produk yang akan dikirim (Reusable)
  const getSelectedProductData = () => {
    let cleanPrice = product.price;
    if (typeof product.price === 'string') {
        cleanPrice = parseInt(product.price.replace(/[^0-9]/g, ""));
    }

    return {
      id: product.id || product.slug, 
      name: product.name,
      price: cleanPrice,
      img: product.img, 
      slug: product.slug,
      color: selectedColor,
      size: selectedSize,
      qty: quantity 
    };
  };

  // LOGIKA 1: Handler untuk Masukkan Keranjang
  const handleAddToCart = () => {
    addToCart(getSelectedProductData());
    navigate('/cart');
  };

  // LOGIKA 2: Handler untuk Beli Sekarang (Hanya fokus pada satu barang ini)
  const handleBuyNow = () => {
    const directProduct = getSelectedProductData();
    
    // MENGGUNAKAN FUNGSI setDirectOrder 
    // Data disimpan di state buyNowItem (bukan cartItems)
    setDirectOrder(directProduct); 
    
    // Navigasi langsung ke checkout dengan parameter mode direct
    navigate('/checkout?mode=direct');
  };

  if (!product) {
    return (
      <div className="container py-5 mt-5 text-center">
        <div className="py-5">
          <h4 className="text-muted mb-4">Maaf, produk tidak ditemukan.</h4>
          <button className="btn btn-dark px-4 py-2" onClick={() => navigate('/produk')}>
            Kembali ke Katalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-vh-100 py-4 py-md-5">
      <div className="container mt-4 mt-md-5">
        
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-link text-decoration-none text-dark d-flex align-items-center gap-1 mb-4 d-md-none"
        >
          <ChevronLeft size={20} /> Kembali
        </button>

        <div className="card border-0 shadow-lg rounded-4 overflow-hidden p-3 p-md-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0" style={{ color: '#4A4A2A', letterSpacing: '2px' }}>MODIS</h4>
            <button 
              onClick={() => navigate(-1)} 
              className="btn border-0 p-2 rounded-circle bg-light d-flex align-items-center justify-content-center shadow-sm hover-bg-secondary transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <div className="row g-4 g-lg-5">
            <div className="col-lg-6">
              <div className="bg-light rounded-4 overflow-hidden d-flex align-items-center justify-content-center p-3" style={{ minHeight: '350px' }}>
                <img 
                  src={product.img} 
                  alt={product.name} 
                  className="img-fluid object-fit-contain shadow-sm rounded-3" 
                  style={{ maxHeight: '500px', width: 'auto' }}
                />
              </div>
              
              <div className="mt-4 mt-md-5 text-start px-1">
                <h6 className="fw-bold text-uppercase mb-3" style={{ letterSpacing: '1px' }}>Deskripsi Produk</h6>
                <p className="text-muted small lh-lg" style={{ textAlign: 'justify' }}>
                  {product.description || "Koleksi eksklusif dengan bahan berkualitas tinggi yang dirancang untuk memberikan kenyamanan sekaligus tampilan yang elegan."}
                </p>
                
                <div className="row mt-4 g-2">
                  {(product.features || ['Bahan Adem', 'Premium Quality', 'Jahitan Rapi', 'Limited Edition']).map((feat, idx) => (
                    <div key={idx} className="col-6">
                      <div className="d-flex align-items-center gap-2 small text-muted">
                        <div className="p-1 bg-success bg-opacity-10 rounded-circle flex-shrink-0">
                          <Check size={12} className="text-success" />
                        </div>
                        <span className="text-truncate">{feat}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-6 ps-lg-5">
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

              {/* Bagian Pilihan Warna */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-4">
                  <p className="small fw-bold mb-3 text-uppercase">Warna: <span className="text-muted fw-normal">{selectedColor}</span></p>
                  <div className="d-flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <div 
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className="rounded-circle border cursor-pointer d-flex align-items-center justify-content-center transition-all"
                        style={{ 
                          width: '35px', 
                          height: '35px', 
                          backgroundColor: color.code,
                          outline: selectedColor === color.name ? '2px solid #4A4A2A' : 'none',
                          outlineOffset: '3px'
                        }}
                      >
                        {selectedColor === color.name && (
                          <Check size={16} className={color.name.toLowerCase() === 'white' ? 'text-dark' : 'text-white'} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bagian Pilihan Ukuran */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-4 pt-2">
                  <p className="small fw-bold mb-3 text-uppercase">Pilih Ukuran</p>
                  <div className="d-flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`btn btn-sm px-4 py-2 rounded-2 transition-all fw-bold ${
                          selectedSize === size 
                          ? 'btn-dark' 
                          : 'btn-outline-secondary border-opacity-25'
                        }`}
                        style={{ minWidth: '65px' }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Bagian Kuantitas */}
              <div className="mb-5 pt-2">
                <p className="small fw-bold mb-3 text-uppercase">Kuantitas</p>
                <div className="d-flex align-items-center border rounded-2 p-1 bg-light" style={{ width: 'fit-content' }}>
                  <button 
                    className="btn btn-sm px-3 border-0 shadow-none hover-scale" 
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  >
                    <Minus size={16} />
                  </button>
                  <input 
                    type="text" 
                    className="form-control form-control-sm border-0 bg-transparent text-center fw-bold shadow-none" 
                    value={quantity} 
                    readOnly 
                    style={{ width: '50px' }}
                  />
                  <button 
                    className="btn btn-sm px-3 border-0 shadow-none hover-scale" 
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Tombol Aksi */}
              <div className="d-grid gap-3 pt-2">
                <button 
                  onClick={handleBuyNow}
                  className="btn btn-lg text-white py-3 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2 hover-opacity" 
                  style={{ backgroundColor: '#4A4A2A', border: 'none' }}
                >
                  <CreditCard size={20} /> Beli Sekarang
                </button>
                <button 
                  onClick={handleAddToCart}
                  className="btn btn-lg btn-outline-dark py-3 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2"
                >
                  <ShoppingCart size={20} /> Masukkan Keranjang
                </button>
              </div>

              <div className="mt-4 p-3 rounded-3 bg-light border border-dashed border-secondary border-opacity-25">
                <p className="small text-muted mb-0 text-center">
                  🚚 <strong>Gratis Ongkir</strong> Se-Sumatera untuk pembelian di atas Rp 500.000
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hover-bg-secondary:hover { background-color: #e2e6ea !important; }
        .hover-scale:active { transform: scale(0.9); }
        .hover-opacity:hover { opacity: 0.9; }
        .transition-all { transition: all 0.2s ease-in-out; }
      `}</style>
    </div>
  );
};

export default DetailProduct;