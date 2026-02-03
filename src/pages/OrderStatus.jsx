import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Phone, HelpCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const OrderStatus = () => {
  const navigate = useNavigate();
  const { lastOrder } = useCart(); // Ambil data pesanan terakhir dari context

  // Tampilan jika data pesanan tidak ditemukan
  if (!lastOrder) {
    return (
      <div className="container py-5 mt-5 text-center">
        <p className="text-muted">Tidak ada data pesanan terbaru.</p>
        <button className="btn btn-dark" onClick={() => navigate('/produk')}>Belanja Sekarang</button>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-5 mt-5 text-start">
      <div className="container d-flex justify-content-center">
        <div className="bg-white shadow-sm rounded-0 w-100" style={{ maxWidth: '500px' }}>
          
          {/* Status Estimasi */}
          <div className="p-3 text-white" style={{ backgroundColor: '#4A4631' }}>
            <p className="mb-0 small">Estimasi Tiba: 2-3 Hari Kerja</p>
          </div>

          {/* Rincian Produk yang Dipesan secara Dinamis */}
          <div className="p-4 border-bottom">
            <p className="small text-muted mb-3">Info Pengiriman : JNE Express (Reguler)</p>
            
            {lastOrder.items.map((item, index) => (
              <div key={index} className="d-flex align-items-center gap-3 mb-4">
                <img 
                  src={item.img || item.image} 
                  alt={item.name} 
                  style={{ width: '80px', height: '100px', objectFit: 'cover' }} 
                />
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between">
                    <h6 className="fw-bold mb-1">{item.name}</h6>
                    <span className="small fw-bold">Rp.{item.price.toLocaleString('id-ID')}</span>
                  </div>
                  <p className="small text-muted mb-0 mt-2">
                    Size: {item.size} | Color: {item.color} | Qty: {item.qty}
                  </p>
                </div>
              </div>
            ))}

            <div className="d-flex justify-content-between pt-3 border-top">
              <span className="fw-bold">Total Pembayaran</span>
              <span className="fw-bold h5 mb-0" style={{ color: '#E19E44' }}>
                Rp.{lastOrder.total.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Nomor Pesanan */}
          <div className="p-2 text-white d-flex justify-content-between px-4" style={{ backgroundColor: '#4A4631' }}>
            <span className="small">No. Pesanan</span>
            <span className="small">{lastOrder.noPesanan}</span>
          </div>

          <div className="p-4 border-bottom bg-white">
            <div className="d-flex justify-content-between mb-3 small">
              <span className="text-muted">Metode Pembayaran</span>
              <span className="fw-bold">Cash on Delivery (COD)</span>
            </div>
            <div className="d-flex justify-content-between mb-3 small">
              <span className="text-muted">Waktu Pemesanan</span>
              <span>{lastOrder.tanggal}</span>
            </div>
          </div>

          {/* Bagian Bantuan */}
          <div className="p-4 bg-light bg-opacity-50 text-center">
            <h6 className="fw-bold mb-3 small">Terima kasih telah berbelanja di MODIS Store!</h6>
            <div className="d-grid gap-2">
              <button className="btn btn-outline-dark btn-sm d-flex align-items-center justify-content-center gap-2">
                <Phone size={14}/> Hubungi Penjual
              </button>
            </div>
          </div>

         {/* Tombol Aksi */}
<div className="p-4 d-flex flex-column gap-2">
  <button 
    className="btn text-white w-100 fw-bold rounded-1 py-2"
    style={{ backgroundColor: '#E19E44', border: 'none' }}
    // PERBAIKAN: Arahkan ke rute Riwayat Pesanan (sesuai App.js kamu)
    onClick={() => navigate('/riwayat')} 
  >
    Lacak Pesanan
  </button>
  
  <button 
    className="btn btn-outline-dark w-100 fw-bold rounded-1 py-2"
    onClick={() => navigate('/produk')}
  >
    Belanja Lagi
  </button>
</div>

        </div>
      </div>
    </div>
  );
};

export default OrderStatus;