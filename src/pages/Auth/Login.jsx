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
      // Di Login.jsx saat sukses
const userToStore = {
  id: response.data.user.id, // Pastikan backend mengirim field ini
  nama: response.data.user.nama,
  email: response.data.user.email
};


      // Simpan data ke localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(userToStore));
      
      // Update state navbar
      if (setIsLoggedIn) setIsLoggedIn(true);
      
      alert("Login Berhasil!");
      navigate('/profile');
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || "Login Gagal!");
    }
  };

  return (
    <div className="container-fluid p-0" style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <div className="row g-0 min-vh-100">
        <div className="col-12 col-lg-6 d-flex flex-column justify-content-center px-4 px-md-5">
          <div className="mx-auto w-100" style={{ maxWidth: '400px' }}>
            <h2 className="fw-bold text-dark mb-2 h3">Selamat Datang Kembali</h2>
            <p className="text-muted small mb-4">Masuk dengan akun yang sudah terdaftar</p>

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
                  <a href="#" className="text-decoration-none text-primary" style={{ fontSize: '11px' }}>Lupa password?</a>
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
                Login
              </button>
            </form>
            <p className="mt-5 text-center small text-muted font-medium">
              Belum Punya Akun? <Link to="/signup" className="text-primary text-decoration-none fw-bold">Daftar</Link>
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