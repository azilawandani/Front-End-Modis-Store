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
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;

      // --- SINRONISASI DATA TERBARU ---
      // Kita memetakan ulang data dari database ke object localStorage
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
        // Pastikan profiling membawa field kategoriFavorit, TB, dan BB terbaru
        profiling: {
          tinggiBadan: user.profiling?.tinggiBadan || 0,
          beratBadan: user.profiling?.beratBadan || 0,
          rekomendasiUkuran: user.profiling?.rekomendasiUkuran || "",
          warnaFavorit: user.profiling?.warnaFavorit || "",
          favBahan: user.profiling?.favBahan || "",
          gayaPakaian: user.profiling?.gayaPakaian || "",
          motifDisukai: user.profiling?.motifDisukai || "",
          kategoriFavorit: user.profiling?.kategoriFavorit || "" // FIELD KRUSIAL
        }
      };

      // Simpan ke localStorage sebagai sesi aktif
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userToStore));
      localStorage.setItem('isLoggedIn', 'true');
      
      if (setIsLoggedIn) setIsLoggedIn(true);
      
      alert(`Login Berhasil! Selamat datang, ${userToStore.nama}`);

      // REDIRECT BERDASARKAN ROLE
      if (userToStore.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }

      window.location.reload();
    } catch (error) {
      console.error("Login Error:", error.response);
      alert(error.response?.data?.message || "Login Gagal! Periksa email dan password.");
    }
  };

  return (
    <div className="container-fluid p-0" style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <div className="row g-0 min-vh-100">
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
        <div className="col-lg-6 d-none d-lg-block p-4">
          <div className="w-100 h-100 overflow-hidden" style={{ borderRadius: '24px' }}>
            <img src="/assets/auth-banner.jpg" alt="Login Banner" className="w-100 h-100 object-fit-cover" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;