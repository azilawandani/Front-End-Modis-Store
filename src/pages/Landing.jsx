import React from 'react';
import { ArrowRight, ShoppingBag, Star, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Recommendation from '../components/Recommendation'; // 1. Import Komponen Rekomendasi

const Landing = () => {
  return (
    <div className="bg-white">
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

      {/* 2. SECTION REKOMENDASI (DITAMPILKAN DI SINI) */}
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
    </div>
  );
};

export default Landing;