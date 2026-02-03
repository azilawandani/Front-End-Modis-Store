import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CartEmpty = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <Navbar />

      <main className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              {/* Kartu Konten Utama */}
              <div className="bg-white rounded-4 shadow-sm p-5 text-center">
                
                {/* Ilustrasi sesuai gambar desain */}
                <div className="mb-4">
                  <img 
                    src="/assets/illustration-no-account.png" 
                    alt="Belum Login" 
                    className="img-fluid"
                    style={{ maxHeight: '250px', objectFit: 'contain' }}
                  />
                </div>

                <h2 className="fw-bold mb-3 font-serif" style={{ color: '#2d2d2d' }}>
                  Keranjangmu masih kosong!
                </h2>
                
                <p className="text-muted small lh-lg mb-5 mx-auto" style={{ maxWidth: '400px' }}>
                  Sepertinya Anda belum login. Yuk, login atau daftar akun terlebih dahulu 
                  untuk mulai menyimpan produk favorit dan melakukan pemesanan di Modis Store.
                </p>

                {/* Tombol Aksi */}
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                  <Link 
                    to="/login" 
                    className="btn px-5 py-3 fw-bold text-white border-0 shadow-sm"
                    style={{ 
                      backgroundColor: '#C5A059', // Warna Gold sesuai tema
                      borderRadius: '10px',
                      minWidth: '180px'
                    }}
                  >
                    Login Sekarang
                  </Link>
                  
                  <Link 
                    to="/signup" 
                    className="btn px-5 py-3 fw-bold text-white border-0 shadow-sm"
                    style={{ 
                      backgroundColor: '#4A4A2A', // Warna Olive sesuai tema
                      borderRadius: '10px',
                      minWidth: '180px'
                    }}
                  >
                    Daftar Akun
                  </Link>
                </div>

                <div className="mt-4">
                  <Link to="/produk" className="text-decoration-none small fw-bold" style={{ color: '#4A4A2A' }}>
                    ← Kembali Lihat Produk
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CartEmpty;