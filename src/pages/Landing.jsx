import React, { useState, useEffect } from 'react';
import { ArrowRight, ShoppingBag, Star, ShieldCheck, Sparkles, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Recommendation from '../components/Recommendation'; 

const Landing = () => {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // MAINTENANCE ACTION: Mendeteksi profil user untuk memicu Onboarding Tooltip Guide
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const profiling = parsedUser.profiling || {};
      
      // Jika pengguna sudah login tetapi data Tinggi Badan belum diisi atau bernilai 0
      if (!profiling.tinggiBadan || profiling.tinggiBadan === 0 || profiling.tinggiBadan === "0") {
        // Berikan delay 2 detik setelah halaman dimuat agar muncul secara halus (smooth transition)
        const timer = setTimeout(() => {
          setShowTooltip(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  return (
    <div className="bg-white position-relative">
      {/* Hero Section */}
      <header className="py-5" style={{ backgroundColor: '#f9f9f7' }}>
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 order-2 order-lg-1">
              <h1 className="display-3 fw-bold mb-4 font-serif italic" style={{ color: '#2d2d2d' }}>
                Tampil Manis, <br /> 
                <span style={{ color: '#4A4A2A' }}>Selalu Modis.</span>
              </h1>
              <p className="lead text-muted mb-5 pe-lg-5">
                Temukan koleksi hijab, gamis, dan pakaian muslimah elegan yang dirancang khusus untuk kenyamanan dan kepercayaan diri Anda di setiap kesempatan.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3">
                <Link to="/produk" className="btn btn-lg px-5 py-3 text-white shadow-sm border-0" style={{ backgroundColor: '#4A4A2A', borderRadius: '4px' }}>
                  Belanja Sekarang <ArrowRight size={20} className="ms-2" />
                </Link>
              </div>
            </div>
            <div className="col-lg-6 order-1 order-lg-2">
              <div className="position-relative">
                <img 
                  src="/assets/hero-model.jpg" 
                  alt="Model Modis" 
                  className="img-fluid shadow-lg w-100"
                  style={{ borderRadius: '10px', objectFit: 'cover', height: '500px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Keunggulan Section */}
      <section className="py-5 border-bottom border-top bg-white">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-md-4">
              <div className="p-4">
                <ShoppingBag className="mb-3" size={32} style={{ color: '#4A4A2A' }} />
                <h5 className="fw-bold">Bahan Premium</h5>
                <p className="text-muted small">Menggunakan material terbaik yang adem dan nyaman digunakan seharian.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 border-start border-end">
                <Star className="mb-3" size={32} style={{ color: '#4A4A2A' }} />
                <h5 className="fw-bold">Desain Eksklusif</h5>
                <p className="text-muted small">Setiap koleksi dirancang unik untuk memberikan kesan mewah dan elegan.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4">
                <ShieldCheck className="mb-3" size={32} style={{ color: '#4A4A2A' }} />
                <h5 className="fw-bold">Kualitas Terjamin</h5>
                <p className="text-muted small">Melalui proses pengecekan kualitas yang ketat sebelum sampai ke tangan Anda.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION REKOMENDASI */}
      <Recommendation />

      {/* Categories Section */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h6 className="text-uppercase mb-2" style={{ color: '#4A4A2A', letterSpacing: '2px', fontWeight: '600' }}>Kategori Pilihan</h6>
            <h2 className="fw-bold font-serif display-6">Telusuri Berdasarkan Kategori</h2>
          </div>

          <div className="row g-4 justify-content-center">
            {[
              { name: 'HIJAB', path: '/kategori/hijab', image: '/assets/hijab.jpg' },
              { name: 'GAMIS', path: '/kategori/gamis', image: '/assets/gamis.jpg' },
              { name: 'MUKENA', path: '/kategori/mukena', image: '/assets/mukena.jpg' },
              { name: 'BAJU & BLOUSE', path: '/kategori/baju', image: '/assets/blouse.jpg' }
            ].map((cat) => (
              <div key={cat.name} className="col-6 col-md-3">
                <Link to={cat.path} className="text-decoration-none text-dark">
                  <div className="card border-0 shadow-sm h-100 overflow-hidden position-relative shadow-hover transition">
                    <div className="overflow-hidden" style={{ height: '300px' }}>
                      <img 
                        src={cat.image} 
                        alt={cat.name} 
                        className="w-100 h-100 object-fit-cover scale-hover"
                        style={{ transition: 'transform 0.5s ease' }}
                      />
                    </div>
                    <div className="card-body bg-white text-center py-3">
                      <h5 className="mb-1 fw-bold" style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>{cat.name}</h5>
                      <small className="text-muted">Lihat Koleksi →</small>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 🛠️ MAINTENANCE COMPONENT: FLOATING ONBOARDING TOOLTIP GUIDE */}
      {/* ======================================================== */}
      {showTooltip && (
        <div 
          className="position-fixed bottom-0 end-0 m-4 p-3 border-0 shadow-lg text-start d-flex align-items-start gap-3 bg-white"
          style={{ 
            zIndex: '1050', 
            maxWidth: '350px', 
            borderRadius: '16px',
            borderLeft: '5px solid #E19E44',
            animation: 'slideUp 0.5s ease-out'
          }}
        >
          <div className="p-2 rounded-3 text-white shadow-sm d-flex align-items-center justify-content-center" style={{ backgroundColor: '#E19E44' }}>
            <Sparkles size={20} />
          </div>
          
          <div className="flex-grow-1 pe-2">
            <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '14px' }}>Rekomendasi Belum Maksimal!</h6>
            <p className="text-muted mb-2" style={{ fontSize: '12px', lineHeight: '1.4' }}>
              Sistem mendeteksi Anda belum melengkapi data ukuran fisik. Yuk atur sekarang agar AI pintar kami bisa mencocokkan baju yang pas untuk lingkar dada Anda.
            </p>
            <button 
              onClick={() => navigate('/profile')} 
              className="btn btn-sm text-white fw-bold px-3 py-1.5 rounded-pill"
              style={{ backgroundColor: '#4A4A2A', fontSize: '11px' }}
            >
              Atur Ukuran Tubuh
            </button>
          </div>

          <button 
            onClick={() => setShowTooltip(false)} 
            className="btn p-0 text-muted border-0 bg-transparent mt-1"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* CSS Tambahan untuk animasi kelayakan UI (Opsional jika dipasang di file index.css) */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Landing;