import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Provider
import { CartProvider } from './context/CartContext'; 

// Assets & Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'leaflet/dist/leaflet.css';

// Komponen Global
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Halaman
import Landing from './pages/Landing';
import ProductPage from './pages/ProductPage';
import DetailProduct from './pages/DetailProduct'; 
import CategoryPage from './pages/CategoryPage';
import Contact from './pages/Contact';
import Help from './pages/Help';
import OrderStatus from './pages/OrderStatus'; // Halaman Resi setelah Checkout
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Profile from './pages/Profile';
import CartPage from './pages/CartPage'; 
import CheckoutPage from './pages/CheckoutPage';
// TrackingPage dihapus sesuai permintaan
import LacakPaket from './pages/LacakPaket'; // Halaman Detail Timeline
import RiwayatPesanan from './pages/RiwayatPesanan'; // Daftar Pesanan Aktif
import PesananEmpty from './pages/PesananEmpty';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    };
    window.addEventListener('storage', checkLogin);
    return () => window.removeEventListener('storage', checkLogin);
  }, []);

  return (
    <CartProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar isLoggedIn={isLoggedIn} />
          
          <main className="flex-grow-1" style={{ paddingTop: '70px' }}>
            <Routes>
              {/* --- Public Routes --- */}
              <Route path="/" element={<Landing />} />
              <Route path="/produk" element={<ProductPage />} />
              <Route path="/produk/:slug" element={<DetailProduct />} />
              <Route path="/kategori/:categoryName" element={<CategoryPage />} />
              <Route path="/kontak" element={<Contact />} />
              <Route path="/bantuan" element={<Help />} />
              <Route path="/cart" element={<CartPage isLoggedIn={isLoggedIn} />} />

              {/* --- Auth Routes --- */}
              <Route 
                path="/login" 
                element={isLoggedIn ? <Navigate to="/profile" /> : <Login setIsLoggedIn={setIsLoggedIn} />} 
              />
              <Route path="/signup" element={<SignUp />} />
              
              {/* --- Protected Routes (Harus Login) --- */}
              <Route 
                path="/profile" 
                element={isLoggedIn ? <Profile isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/checkout" 
                element={isLoggedIn ? <CheckoutPage /> : <Navigate to="/login" />} 
              />
              
              {/* Halaman Konfirmasi Resi (setelah klik bayar) */}
              <Route 
                path="/pesanan" 
                element={isLoggedIn ? <OrderStatus /> : <PesananEmpty />} 
              />

              {/* Halaman Utama Daftar Pesanan Aktif (menggantikan tracking page) */}
              <Route 
                path="/riwayat" 
                element={isLoggedIn ? <RiwayatPesanan /> : <Navigate to="/login" />} 
              />

              {/* Halaman Detail Timeline Pengiriman */}
              <Route 
                path="/lacak-paket/:orderId" 
                element={isLoggedIn ? <LacakPaket /> : <Navigate to="/login" />} 
              />

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;