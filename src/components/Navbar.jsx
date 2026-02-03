import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, X } from 'lucide-react';

const Navbar = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/produk?q=${keyword}`);
      setIsSearching(false);
      setKeyword('');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top border-bottom py-3 text-start">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img 
            src="/assets/logo-modis.png" 
            alt="Modis Store" 
            style={{ height: '50px', objectFit: 'contain' }} 
          />
        </Link>

        {/* Toggle Mobile */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu Navigasi */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {!isSearching ? (
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <NavLink className="nav-link px-3" to="/">Beranda</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link px-3" to="/produk">Produk</NavLink>
              </li>
              
              {/* Dropdown Kategori */}
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle px-3" href="#" id="catDrop" role="button" data-bs-toggle="dropdown">
                  Kategori
                </a>
                <ul className="dropdown-menu border-0 shadow-sm mt-2">
                  <li><NavLink className="dropdown-item" to="/kategori/baju">Baju</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/kategori/hijab">Hijab</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/kategori/gamis">Gamis</NavLink></li>
                  <li><NavLink className="dropdown-item" to="/kategori/mukena">Mukena</NavLink></li>
                </ul>
              </li>

              {/* PERBAIKAN: Menu Pesanan Tunggal (Tanpa Dropdown) */}
              <li className="nav-item">
                <NavLink className="nav-link px-3" to="/riwayat">Pesanan</NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link px-3" to="/kontak">Kontak</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link px-3" to="/bantuan">Bantuan</NavLink>
              </li>
            </ul>
          ) : (
            <div className="mx-auto" style={{ width: '50%' }}>
              <form onSubmit={handleSearchSubmit} className="d-flex align-items-center bg-light px-3 py-1 rounded-pill">
                <Search size={18} className="text-muted" />
                <input 
                  autoFocus
                  type="text" 
                  className="form-control border-0 bg-transparent shadow-none" 
                  placeholder="Cari produk muslimah..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <X 
                  size={18} 
                  className="text-muted cursor-pointer" 
                  onClick={() => setIsSearching(false)} 
                />
              </form>
            </div>
          )}

          {/* Icon Kanan */}
          <div className="d-flex align-items-center gap-4">
            <Search 
              size={20} 
              className={`text-secondary cursor-pointer ${isSearching ? 'd-none' : ''}`} 
              onClick={() => setIsSearching(true)}
            />
            
            <Link to="/cart" className="text-secondary position-relative">
              <ShoppingCart size={20} />
            </Link>
            <Link to="/login" className="text-secondary">
              <User size={20} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;