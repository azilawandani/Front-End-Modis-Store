import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { CartProvider } from './context/CartContext'; 
import { AuthProvider } from './context/AuthContext'; 

// Assets & Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'leaflet/dist/leaflet.css';

// Komponen Global
import Navbar from './components/Navbar';
import NavbarAdmin from './components/NavbarAdmin'; 
import Footer from './components/Footer';

// Halaman
import Landing from './pages/Landing';
import ProductPage from './pages/ProductPage';
import DetailProduct from './pages/DetailProduct'; 
import CategoryPage from './pages/CategoryPage';
import Contact from './pages/Contact';
import Help from './pages/Help';
import OrderStatus from './pages/OrderStatus'; 
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Profile from './pages/Profile';
import CartPage from './pages/CartPage'; 
import CheckoutPage from './pages/CheckoutPage';
import LacakPaket from './pages/LacakPaket'; 
import RiwayatPesanan from './pages/RiwayatPesanan'; 
import PesananEmpty from './pages/PesananEmpty';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard'; 
import StokProduk from './pages/StokProduk';
import PesananAdmin from './pages/PesananAdmin';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [userRole, setUserRole] = useState('');

  const checkAuth = () => {
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);
    
    if (loggedInStatus) {
      const user = JSON.parse(localStorage.getItem('user'));
      setUserRole(user?.role || 'user');
    } else {
      setUserRole('');
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="d-flex flex-column min-vh-100">
            
            {/* Navigasi Dinamis Berdasarkan Role */}
            {isLoggedIn && userRole === 'admin' ? (
              <NavbarAdmin setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navbar isLoggedIn={isLoggedIn} />
            )}
            
            <main className="flex-grow-1" style={{ paddingTop: '80px' }}>
              <Routes>
                {/* --- Public Routes --- */}
                <Route 
                  path="/" 
                  element={userRole === 'admin' ? <Navigate to="/admin" /> : <Landing />} 
                />
                <Route path="/produk" element={<ProductPage />} />
                <Route path="/produk/:slug" element={<DetailProduct />} />
                <Route path="/kategori/:categoryName" element={<CategoryPage />} />
                <Route path="/kontak" element={<Contact />} />
                <Route path="/bantuan" element={<Help />} />
                <Route path="/cart" element={<CartPage isLoggedIn={isLoggedIn} />} />

                {/* --- Auth Routes --- */}
                <Route 
                  path="/login" 
                  element={isLoggedIn ? (userRole === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/profile" />) : <Login setIsLoggedIn={setIsLoggedIn} />} 
                />
                <Route path="/signup" element={<SignUp />} />
                
                {/* --- Protected Routes (User) --- */}
                <Route 
                  path="/profile" 
                  element={isLoggedIn ? <Profile isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/login" />} 
                />
                <Route 
                  path="/checkout" 
                  element={isLoggedIn ? <CheckoutPage /> : <Navigate to="/login" />} 
                />

                {/* PERUBAHAN DI SINI: /pesanan sekarang mengarah ke RiwayatPesanan agar daftar muncul */}
                <Route 
                  path="/pesanan" 
                  element={isLoggedIn ? <RiwayatPesanan /> : <PesananEmpty />} 
                />

                {/* PERUBAHAN DI SINI: Rute baru untuk struk sukses setelah konfirmasi checkout */}
                <Route 
                  path="/status-pesanan" 
                  element={isLoggedIn ? <OrderStatus /> : <Navigate to="/login" />} 
                />

                {/* Rute lama /riwayat dialihkan juga ke RiwayatPesanan agar konsisten */}
                <Route 
                  path="/riwayat" 
                  element={isLoggedIn ? <RiwayatPesanan /> : <Navigate to="/login" />} 
                />

                <Route 
                  path="/lacak-paket/:orderId" 
                  element={isLoggedIn ? <LacakPaket /> : <Navigate to="/login" />} 
                />

                {/* --- Admin Routes --- */}
                <Route 
                  path="/admin" 
                  element={isLoggedIn && userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} 
                />
                <Route path="/admin/list-produk" element={isLoggedIn && userRole === 'admin' ? <StokProduk /> : <Navigate to="/" />} />
                <Route path="/admin/pesanan" element={isLoggedIn && userRole === 'admin' ? <PesananAdmin /> : <Navigate to="/" />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>

            {/* Sembunyikan footer untuk admin */}
            {userRole !== 'admin' && <Footer />}
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;