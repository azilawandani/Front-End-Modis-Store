import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MapPin, Wallet, Phone, ShoppingBag, Truck, ChevronDown } from 'lucide-react';

const Help = () => {
  const faqData = [
    { 
      title: 'Ubah Alamat', 
      icon: <MapPin size={20} />, 
      desc: 'Anda dapat mengubah alamat pengiriman melalui menu Profil > Daftar Alamat sebelum pesanan diproses oleh admin kami.' 
    },
    { 
      title: 'Informasi Pembayaran', 
      icon: <Wallet size={20} />, 
      desc: 'Kami menggunakan sistem Cash on Delivery (COD).' 
    },
    { 
      title: 'Hubungi Toko', 
      icon: <Phone size={20} />, 
      desc: 'Layanan pelanggan kami tersedia setiap hari pukul 08.00 - 21.00 WIB melalui WhatsApp di nomor 081123456777.' 
    },
    { 
      title: 'Cara Pesan', 
      icon: <ShoppingBag size={20} />, 
      desc: 'Pilih produk favorit Anda, masukkan ke keranjang, klik checkout, lalu lakukan pembayaran sesuai instruksi yang tersedia.' 
    },
    { 
      title: 'Pengiriman', 
      icon: <Truck size={20} />, 
      desc: 'Seluruh pengiriman butik kami menggunakan layanan JNE (Reguler/YES).' 
    },
  ];

  return (
    <div className="bg-white min-vh-100 d-flex flex-column">
   

      <main className="flex-grow-1 py-5" style={{ backgroundColor: '#fdfdfd' }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <h1 className="fw-bold font-serif mb-3">Butuh Bantuan?</h1>
            <p className="text-muted">Klik pada kategori di bawah untuk melihat penjelasan lengkap.</p>
          </div>

          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-7">
              {/* Bootstrap Accordion */}
              <div className="accordion accordion-flush shadow-sm rounded-4 overflow-hidden border" id="helpAccordion">
                {faqData.map((item, index) => (
                  <div className="accordion-item border-bottom" key={index}>
                    <h2 className="accordion-header">
                      <button 
                        className="accordion-button collapsed py-4 px-4 shadow-none d-flex align-items-center" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target={`#collapse${index}`}
                        aria-expanded="false"
                      >
                        <div className="p-2 rounded-circle bg-light d-flex align-items-center justify-content-center me-3" 
                             style={{ color: '#4A4A2A', width: '40px', height: '40px' }}>
                          {item.icon}
                        </div>
                        <span className="fw-bold text-dark">{item.title}</span>
                      </button>
                    </h2>
                    <div 
                      id={`collapse${index}`} 
                      className="accordion-collapse collapse" 
                      data-bs-parent="#helpAccordion"
                    >
                      <div className="accordion-body px-5 pb-4 text-muted small lh-lg">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hubungi CS */}
              <div className="mt-5 p-4 rounded-4 text-center border" style={{ backgroundColor: '#f9f9f9' }}>
                <p className="small text-muted mb-0">
                  Masih punya pertanyaan lain? <br />
                  <a href="https://wa.me/6281123456777" target="_blank" rel="noreferrer" className="fw-bold text-decoration-none" style={{ color: '#4A4A2A' }}>
                    Tanya Admin via WhatsApp →
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

    
    </div>
  );
};

export default Help;