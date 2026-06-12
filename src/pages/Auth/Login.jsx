import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://back-end-modis-store.vercel.app/api/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;

      // --- SINKRONISASI DATA TERBARU ---
      // Memetakan data dari database (termasuk hitungan backend LD/PP) ke localStorage
      const userToStore = {
        id: user.id || user._id,
        nama: user.nama,
        email: user.email,
        role: user.role || 'user',
        phone: user.phone || "",
        province: user.province || "",
        city: user.city || "",
        district: user.district || "",
        postalCode: user.postalCode || "",
        address: user.address || "",
        location: user.location,
        // Pastikan profiling membawa seluruh hasil hitungan cerdas backend
        profiling: {
          tinggiBadan: user.profiling?.tinggiBadan || 0,
          beratBadan: user.profiling?.beratBadan || 0,
          rekomendasiUkuran: user.profiling?.rekomendasiUkuran || "",
          estimasiLD: user.profiling?.estimasiLD || 0, // FIELD KRUSIAL SKRIPSI
          estimasiPP: user.profiling?.estimasiPP || 0, // FIELD KRUSIAL SKRIPSI
          warnaFavorit: user.profiling?.warnaFavorit || "",
          favBahan: user.profiling?.favBahan || "",
          gayaPakaian: user.profiling?.gayaPakaian || "",
          motifDisukai: user.profiling?.motifDisukai || "",
          kategoriFavorit: user.profiling?.kategoriFavorit || ""
        }
      };

      // Simpan data utuh ke localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userToStore));
      localStorage.setItem('isLoggedIn', 'true');
      
      // Update state aplikasi jika ada
      if (setIsLoggedIn) setIsLoggedIn(true);
      
      alert(`Login Berhasil! Selamat datang, ${userToStore.nama}`);

      // REDIRECT BERDASARKAN ROLE
      if (userToStore.role === 'admin') {
        navigate('/admin');
      } else {
        // Arahkan ke profile untuk memastikan user melihat datanya sudah tersimpan
        navigate('/profile');
      }

      // Reload untuk memastikan context/state membaca localStorage terbaru
      window.location.reload();
    } catch (error) {
      console.error("Login Error:", error.response);
      const errorMsg = error.response?.data?.message || "Login Gagal! Periksa email dan password.";
      alert(errorMsg);
    }
  };

  return (
    <div className="container-fluid p-0" style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <div className="row g-0 min-vh-100">
        {/* SISI KIRI: FORM LOGIN */}
        <div className="col-12 col-lg-6 d-flex flex-column justify-content-center px-4 px-md-5">
          <div className="mx-auto w-100" style={{ maxWidth: '400px' }}>
            <h2 className="fw-bold text-dark mb-2 h3">Selamat Datang Kembali</h2>
            <p className="text-muted small mb-4">Masuk ke Modis Store untuk personalisasi belanja Anda</p>

            <form onSubmit={handleLogin}>
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
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label small fw-bold text-muted mb-0">Password</label>
                  <a href="#!" className="text-decoration-none text-primary" style={{ fontSize: '11px' }}>
                    Lupa password?
                  </a>
                </div>
                <input 
                  type="password" 
                  className="form-control py-2 shadow-none" 
                  placeholder="Masukkan Password" 
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
                Masuk Sekarang
              </button>
            </form>
            <p className="mt-5 text-center small text-muted font-medium">
              Belum Punya Akun? <Link to="/signup" className="text-primary text-decoration-none fw-bold">Daftar Disini</Link>
            </p>
          </div>
        </div>

        {/* SISI KANAN: BANNER VISUAL */}
        <div className="col-lg-6 d-none d-lg-block p-4">
          <div className="w-100 h-100 overflow-hidden" style={{ borderRadius: '24px' }}>
            <img 
              src="/assets/auth-banner.jpg" 
              alt="Login Banner" 
              className="w-100 h-100 object-fit-cover" 
              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80"; }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;