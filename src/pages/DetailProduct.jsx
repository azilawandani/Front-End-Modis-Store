import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  Minus, Plus, X, Check, ShoppingCart, 
  CreditCard, ChevronLeft, Sparkles, Ruler, Heart 
} from 'lucide-react';
import { useCart } from '../context/CartContext'; 

const DetailProduct = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, setDirectOrder } = useCart(); 

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState(null); 
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/products');
        const foundProduct = res.data.find((p) => p.slug === slug);
        
        if (foundProduct) {
          setProduct(foundProduct);
          setMainImage(foundProduct.img); 
          if (foundProduct.colors?.length > 0) {
            setSelectedColor(foundProduct.colors[0].name);
            if (foundProduct.colors[0].image) setMainImage(foundProduct.colors[0].image);
          }
          const recommendedLabel = location.state?.recommendedSize;
          const matchedSize = foundProduct.sizes?.find(s => s.label === recommendedLabel);
          if (matchedSize) {
            setSelectedSize(matchedSize);
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

  const handleColorSelection = (colorObj) => {
    setSelectedColor(colorObj.name);
    if (colorObj.image) setMainImage(colorObj.image);
  };

  const handleAddToCart = () => {
    if (!selectedSize) return alert("Pilih ukuran terlebih dahulu");
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      img: mainImage,
      slug: product.slug,
      color: selectedColor,
      size: selectedSize.label,
      qty: quantity 
    });
    alert("Berhasil dimasukkan ke keranjang");
  };

  // --- PERBAIKAN DI SINI ---
  const handleBuyNow = () => {
    if (!selectedSize) return alert("Pilih ukuran terlebih dahulu");
    
    const orderData = {
      id: product._id,
      _id: product._id, // Memastikan ID sinkron untuk filter di Checkout
      name: product.name,
      price: product.price,
      img: mainImage,
      slug: product.slug,
      color: selectedColor,
      size: selectedSize.label,
      qty: quantity
    };

    // 1. Simpan ke Context
    setDirectOrder(orderData); 
    
    // 2. Simpan ke Local Storage (Cadangan jika context delay/kosong)
    localStorage.setItem('temp_buy_now', JSON.stringify(orderData));
    
    // 3. Navigasi dengan parameter mode agar Checkout tahu ini 'Beli Sekarang'
    navigate('/checkout?mode=direct');
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="spinner-border text-dark" role="status"></div>
    </div>
  );

  if (!product) return <div className="container py-5 mt-5 text-center">Produk tidak ditemukan.</div>;

  return (
    <div className="bg-white min-vh-100 py-4 py-md-5 text-start">
      <div className="container mt-4 mt-md-5">
        <button onClick={() => navigate(-1)} className="btn btn-link text-decoration-none text-dark d-flex align-items-center gap-1 mb-4 d-md-none">
          <ChevronLeft size={20} /> Kembali
        </button>

        <div className="card border-0 shadow-lg rounded-4 overflow-hidden p-3 p-md-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0" style={{ color: '#4A4A2A', letterSpacing: '2px' }}>MODIS STORE</h4>
            <div className="d-flex gap-2">
               <button className="btn btn-light rounded-circle p-2 shadow-sm"><Heart size={20}/></button>
               <button onClick={() => navigate(-1)} className="btn btn-light rounded-circle p-2 shadow-sm"><X size={20} /></button>
            </div>
          </div>

          <div className="row g-4 g-lg-5">
            <div className="col-lg-6">
              <div className="bg-light rounded-4 overflow-hidden border shadow-sm mb-3">
                <img src={mainImage} alt={product.name} className="img-fluid w-100 object-fit-cover transition-all" style={{ maxHeight: '550px' }} />
              </div>
              <div className="d-flex gap-2 overflow-auto pb-2">
                {product.colors?.map((c, idx) => (
                  <div key={idx} onClick={() => handleColorSelection(c)} className={`rounded-3 border cursor-pointer overflow-hidden flex-shrink-0 ${selectedColor === c.name ? 'border-dark border-2' : 'opacity-75'}`} style={{ width: '70px', height: '70px' }}>
                    <img src={c.image || product.img} alt={c.name} className="w-100 h-100 object-fit-cover" />
                  </div>
                ))}
              </div>
              <div className="mt-4 px-1">
                <h6 className="fw-bold text-uppercase mb-3 small" style={{ letterSpacing: '1px' }}>Karakteristik & Fitur</h6>
                <div className="row g-2">
                  {product.features?.map((feat, idx) => (
                    <div key={idx} className="col-6 d-flex align-items-center gap-2 small text-muted">
                      <Check size={14} className="text-success" /> <span>{feat}</span>
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
              <h3 className="text-warning fw-bold mb-4">Rp {product.price.toLocaleString('id-ID')}</h3>
              <hr className="my-4 opacity-50" />
              <div className="mb-4">
                <p className="small fw-bold mb-3 text-uppercase">Warna: <span className="text-muted fw-normal">{selectedColor}</span></p>
                <div className="d-flex flex-wrap gap-2">
                  {product.colors?.map((color) => (
                    <button key={color.name} onClick={() => handleColorSelection(color)} className={`btn btn-sm rounded-pill px-4 py-2 fw-bold transition-all ${selectedColor === color.name ? 'btn-dark shadow' : 'btn-outline-dark'}`} style={{ fontSize: '11px' }}>
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <p className="small fw-bold mb-3 text-uppercase">Pilih Ukuran:</p>
                <div className="d-flex flex-wrap gap-2">
                  {product.sizes?.map((size) => (
                    <button key={size.label} onClick={() => setSelectedSize(size)} className={`btn btn-sm px-4 py-2 rounded-3 transition-all fw-bold position-relative ${selectedSize?.label === size.label ? 'btn-dark shadow' : 'btn-outline-secondary'}`}>
                      {size.label}
                      {location.state?.recommendedSize === size.label && (
                        <span className="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-warning text-dark border border-white shadow-sm" style={{ fontSize: '8px' }}>
                           <Sparkles size={8} className="me-1" />REC
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              {selectedSize && (
                <div className="p-3 bg-light rounded-4 mb-4 border d-flex align-items-center gap-3">
                  <div className="p-2 bg-white rounded-circle shadow-sm"><Ruler size={20} className="text-primary" /></div>
                  <div>
                    <p className="small mb-0 fw-bold">Klasifikasi Ukuran {selectedSize.label}:</p>
                    <span className="text-muted" style={{ fontSize: '12px' }}>LD: <b>{selectedSize.ld} cm</b> | PP: <b>{selectedSize.pp} cm</b></span>
                  </div>
                </div>
              )}
              <div className="mb-4">
                <p className="small fw-bold mb-3 text-uppercase">Jumlah</p>
                <div className="d-flex align-items-center border rounded-3 p-1 bg-light shadow-sm" style={{ width: 'fit-content' }}>
                  <button className="btn btn-sm px-3 border-0" onClick={() => quantity > 1 && setQuantity(quantity - 1)}><Minus size={16} /></button>
                  <input type="text" className="form-control form-control-sm border-0 bg-transparent text-center fw-bold shadow-none" value={quantity} readOnly style={{ width: '50px' }} />
                  <button className="btn btn-sm px-3 border-0" onClick={() => setQuantity(quantity + 1)}><Plus size={16} /></button>
                </div>
              </div>
              <div className="d-grid gap-3 pt-2">
                <div className="row g-2">
                  <div className="col-md-6">
                    <button onClick={handleAddToCart} className="btn btn-lg w-100 btn-outline-dark py-3 fw-bold rounded-4 d-flex align-items-center justify-content-center gap-2"><ShoppingCart size={20} /> + Keranjang</button>
                  </div>
                  <div className="col-md-6">
                    <button onClick={handleBuyNow} className="btn btn-lg w-100 text-white py-3 fw-bold rounded-4 shadow-lg d-flex align-items-center justify-content-center gap-2" style={{ backgroundColor: '#4A4A2A', border: 'none' }}><CreditCard size={20} /> Beli Sekarang</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;