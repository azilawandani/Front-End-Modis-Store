import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, LogOut, Package, Monitor } from 'lucide-react';

const NavbarAdmin = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top border-bottom py-3">
      <div className="container">
        {/* Logo Menggunakan Gambar yang Sama dengan User */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/admin">
          <img 
            src="/assets/logo-modis.png" 
            alt="Modis Admin" 
            style={{ height: '50px', objectFit: 'contain' }} 
          />

        </Link>
        
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#adminNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="adminNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link px-3 d-flex align-items-center gap-2" to="/admin">
                <LayoutDashboard size={18} /> Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link px-3 d-flex align-items-center gap-2" to="/admin/list-produk">
                <Package size={18} /> Stok Produk
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link px-3 d-flex align-items-center gap-2" to="/admin/pesanan">
                <ShoppingBag size={18} /> Pesanan
              </NavLink>
            </li>
          </ul>
          
          <div className="d-flex align-items-center gap-3">
            <div className="text-end d-none d-lg-block border-end pe-3">
                <p className="text-dark small mb-0 fw-bold">Admin Modis</p>
            </div>
            <button 
              onClick={handleLogout} 
              className="btn btn-outline-danger btn-sm px-3 rounded-pill d-flex align-items-center gap-2"
              style={{ fontWeight: '600' }}
            >
              <LogOut size={16} /> Keluar
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarAdmin;