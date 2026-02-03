import React from 'react';
import { Link } from 'react-router-dom';

const PesananEmpty = () => {
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ backgroundColor: '#F2F2F2' }}>
      <div className="container px-4">
        {/* Kontainer Putih Tengah */}
        <div className="bg-white rounded-4 shadow-sm p-5 mx-auto text-center" style={{ maxWidth: '650px' }}>
          
          {/* Ilustrasi Karakter */}
          <div className="mb-4">
            <img 
              src="/assets/illustration-no-account.png" 
              alt="Belum memiliki akun" 
              className="img-fluid"
              style={{ maxHeight: '220px', objectFit: 'contain' }}
            />
          </div>

          <h2 className="fw-bold text-dark mb-3 font-serif">
            Kamu belum memiliki akun!
          </h2>
          
          <p className="text-muted small lh-lg mb-5 mx-auto" style={{ maxWidth: '400px' }}>
            Untuk melakukan pemesanan, kamu harus memiliki akun terlebih dahulu. 
            Jika sudah punya, silakan login untuk melanjutkan belanja kamu ya!
          </p>

          {/* Grup Tombol */}
          <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mt-2">
            <Link 
              to="/login" 
              className="btn px-5 py-3 fw-bold shadow-sm"
              style={{ 
                backgroundColor: '#E19E44', // Warna Gold Butik
                color: '#fff',
                borderRadius: '8px',
                minWidth: '200px',
                border: 'none'
              }}
            >
              Login Sekarang
            </Link>
            
            <Link 
              to="/signup" 
              className="btn px-5 py-3 fw-bold shadow-sm"
              style={{ 
                backgroundColor: '#4A4A2A', // Warna Olive Butik
                color: '#fff',
                borderRadius: '8px',
                minWidth: '200px',
                border: 'none'
              }}
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PesananEmpty;