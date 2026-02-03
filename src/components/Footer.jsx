import React from 'react';
import { Send, Instagram, Facebook, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  // Fungsi untuk handle newsletter sederhana
  const handleSubscribe = (e) => {
    e.preventDefault();
    alert("Terima kasih telah mendaftar! Info terbaru akan dikirim ke email Anda.");
  };

  return (
    <footer className="py-5 text-white" style={{ backgroundColor: '#4A4A2A' }}>
      <div className="container">
        <div className="row g-5 py-5 justify-content-between">
          
          {/* Kolom 1: Alamat & Map Interaktif */}
          <div className="col-lg-5 col-md-6">
            <h5 className="fw-bold mb-4 font-serif">Offline Store</h5>
            <div className="d-flex mb-4">
              <MapPin size={24} className="me-2 flex-shrink-0" />
              <p className="small opacity-75 mb-0" style={{ lineHeight: '1.8' }}>
                <strong>Butik Modis Store</strong><br />
                Air Jamban, Kec. Mandau, Kabupaten Bengkalis, Riau.
              </p>
            </div>
            
            {/* Map Link: Membuka Google Maps asli di tab baru */}
            <a 
              href="https://www.google.com/maps/search/Modis+Store+Mandau" 
              target="_blank" 
              rel="noopener noreferrer"
              className="rounded overflow-hidden border border-white border-opacity-25 shadow-sm d-block" 
              style={{ height: '180px' }}
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.1234567890!2d101.2144!3d1.2725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTYnMjEuMCJOIDEwMcKwMTInNTEuOCJF!5e0!3m2!1sid!2sid!4v1234567890" 
                width="100%" 
                height="100%" 
                style={{ border: 0, pointerEvents: 'none' }} 
                allowFullScreen="" 
                loading="lazy" 
                title="Lokasi Modis Store"
              ></iframe>
            </a>
          </div>

          {/* Kolom 2: Info Kontak & Sosmed */}
          <div className="col-lg-3 col-md-6">
            <h5 className="fw-bold mb-4 font-serif">Hubungi Kami</h5>
            <ul className="list-unstyled">
              <li className="mb-3">
                <a href="https://instagram.com/modisstore.duri" target="_blank" rel="noopener noreferrer" className="d-flex align-items-center text-white text-decoration-none hover-opacity">
                  <div className="bg-white bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '38px', height: '38px' }}>
                    <Instagram size={18} />
                  </div>
                  <span className="small opacity-75">@modisstore.duri</span>
                </a>
              </li>
              <li className="mb-3">
                <a href="https://facebook.com/modisstore" target="_blank" rel="noopener noreferrer" className="d-flex align-items-center text-white text-decoration-none hover-opacity">
                  <div className="bg-white bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '38px', height: '38px' }}>
                    <Facebook size={18} />
                  </div>
                  <span className="small opacity-75">Modis Store</span>
                </a>
              </li>
              <li className="mb-3">
                <a href="https://wa.me/6281123456777" target="_blank" rel="noopener noreferrer" className="d-flex align-items-center text-white text-decoration-none hover-opacity">
                  <div className="bg-white bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '38px', height: '38px' }}>
                    <Phone size={18} />
                  </div>
                  <span className="small opacity-75">0811-2345-6777</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Newsletter */}
          <div className="col-lg-3 col-md-12">
            <h5 className="fw-bold mb-4 font-serif">Langganan</h5>
            <p className="small opacity-75 mb-4">Dapatkan informasi mengenai koleksi terbaru dan promo eksklusif.</p>
            <form onSubmit={handleSubscribe} className="input-group mb-3 shadow-sm">
              <input 
                type="email" 
                required
                className="form-control border-0 py-2 shadow-none" 
                placeholder="Email Anda" 
                style={{ fontSize: '14px', borderRadius: '4px 0 0 4px' }}
              />
              <button 
                className="btn btn-dark px-3" 
                type="submit"
                style={{ borderRadius: '0 4px 4px 0', backgroundColor: '#2d2d1a' }}
              >
                <Send size={16} />
              </button>
            </form>
          </div>

        </div>

        {/* Garis Bawah & Copyright */}
        <div className="border-top border-white border-opacity-10 pt-4 mt-4 text-center">
          <p className="mb-0 opacity-50" style={{ fontSize: '11px', letterSpacing: '2px' }}>
            © 2026 MODIS STORE. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;