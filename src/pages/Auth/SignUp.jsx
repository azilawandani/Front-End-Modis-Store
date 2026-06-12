import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const navigate = useNavigate();
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://back-end-modis-store.vercel.app/api/auth/register', {
        nama,
        email,
        password
      });

      alert("Akun berhasil dibuat! Silakan login.");
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || "Registrasi Gagal!");
    }
  };

  return (
    <div className="container-fluid p-0" style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <div className="row g-0 min-vh-100">
        <div className="col-12 col-lg-6 d-flex flex-column justify-content-center px-4 px-md-5">
          <div className="mx-auto w-100" style={{ maxWidth: '400px' }}>
            <h2 className="fw-bold text-dark mb-2 h3">Selamat Datang di Modis</h2>
            <p className="text-muted small mb-4">Buat Akun Belanjamu Yuk!</p>

            <form onSubmit={handleSignUp}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  className="form-control py-2 shadow-none" 
                  placeholder="Masukkan Nama" 
                  required 
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  style={{ borderRadius: '8px', fontSize: '14px' }} 
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted mb-1">Email</label>
                <input 
                  type="email" 
                  className="form-control py-2 shadow-none" 
                  placeholder="Masukkan Email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ borderRadius: '8px', fontSize: '14px' }} 
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted mb-1">Password</label>
                <input 
                  type="password" 
                  className="form-control py-2 shadow-none" 
                  placeholder="Buat Password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ borderRadius: '8px', fontSize: '14px' }} 
                />
              </div>
              <button 
                type="submit" 
                className="btn w-100 text-white py-2 fw-bold shadow-sm border-0" 
                style={{ backgroundColor: '#4A4A2A', borderRadius: '8px' }}
              >
                Daftar
              </button>
            </form>
            <p className="mt-4 text-center small text-muted font-medium">
              Sudah Punya Akun? <Link to="/login" className="text-primary text-decoration-none fw-bold">Login</Link>
            </p>
          </div>
        </div>
        <div className="col-lg-6 d-none d-lg-block p-4">
          <div className="w-100 h-100 overflow-hidden" style={{ borderRadius: '24px' }}>
            <img src="/assets/auth-banner.jpg" alt="Auth Banner" className="w-100 h-100 object-fit-cover" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;