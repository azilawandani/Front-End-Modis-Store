import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Instagram, Facebook, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="bg-white min-vh-100 d-flex flex-column">
      

      <main className="flex-grow-1">
        {/* Header Section */}
        <div className="py-5 bg-light border-bottom">
          <div className="container text-center">
            <h1 className="display-5 fw-bold font-serif mb-2">Hubungi Kami</h1>
            <p className="text-muted">Kami siap membantu Anda menemukan koleksi muslimah terbaik.</p>
          </div>
        </div>

        <div className="container py-5 my-lg-5">
          <div className="row g-5 align-items-start">
            
            {/* Sisi Kiri: Info Kontak */}
            <div className="col-lg-4">
              <div className="card border-0 bg-transparent">
                <div className="mb-5">
                  <div className="d-flex align-items-center mb-3">
                    <MapPin className="me-2" style={{ color: '#4A4A2A' }} size={24} />
                    <h4 className="fw-bold mb-0">Offline Store</h4>
                  </div>
                  <p className="text-muted lh-lg ps-4 ms-2">
                    <strong>Butik Modis Store</strong><br />
                    Air Jamban, Kec. Mandau, Kabupaten Bengkalis, Riau.
                  </p>
                </div>

                <div>
                  <h4 className="fw-bold mb-4">Media Sosial & WhatsApp</h4>
                  <ul className="list-unstyled">
                    <li className="mb-4">
                      <a href="#" className="d-flex align-items-center text-decoration-none text-dark group">
                        <div className="p-3 rounded-circle border me-3 transition-all shadow-sm bg-white" 
                             style={{ width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Instagram size={20} />
                        </div>
                        <div className="d-flex flex-column">
                          <span className="small text-muted">Instagram</span>
                          <span className="fw-bold">@modisstore.duri</span>
                        </div>
                      </a>
                    </li>
                    <li className="mb-4">
                      <a href="#" className="d-flex align-items-center text-decoration-none text-dark group">
                        <div className="p-3 rounded-circle border me-3 transition-all shadow-sm bg-white" 
                             style={{ width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Facebook size={20} />
                        </div>
                        <div className="d-flex flex-column">
                          <span className="small text-muted">Facebook</span>
                          <span className="fw-bold">Modis Store</span>
                        </div>
                      </a>
                    </li>
                    <li className="mb-4">
                      <a href="#" className="d-flex align-items-center text-decoration-none text-dark group">
                        <div className="p-3 rounded-circle border me-3 transition-all shadow-sm bg-white" 
                             style={{ width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Phone size={20} />
                        </div>
                        <div className="d-flex flex-column">
                          <span className="small text-muted">WhatsApp</span>
                          <span className="fw-bold">081123456777</span>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sisi Kanan: Map Interaktif */}
            <div className="col-lg-8">
              <div className="rounded-4 overflow-hidden shadow-lg border" style={{ height: '500px' }}>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15957.199999999999!2d101.2166667!3d1.2666667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTYnMDAuMCJOIDEwMcKwMTMnMDAuMCJF!5e0!3m2!1sid!2sid!4v1234567890" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Modis Store"
                ></iframe>
              </div>
              <div className="mt-3 p-3 bg-light rounded-3 border d-flex align-items-center">
                <small className="text-muted italic">
                  *Klik <strong>"View larger map"</strong> pada peta untuk melihat rute dari lokasi Anda saat ini.
                </small>
              </div>
            </div>

          </div>
        </div>
      </main>

     
    </div>
  );
};

export default Contact;