import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Phone, HelpCircle, PackageCheck, Truck, ShoppingBag } from 'lucide-react';
// Hapus useCart jika Anda tidak menggunakannya untuk lastOrder, 
// atau biarkan jika masih dibutuhkan untuk fungsi lain.

const OrderStatus = () => {
  const navigate = useNavigate();
  const [lastOrder, setLastOrder] = useState(null);

  // Mengambil data dari sessionStorage saat komponen dimuat
  useEffect(() => {
    const data = sessionStorage.getItem('lastOrder');
    if (data) {
      setLastOrder(JSON.parse(data));
    }
  }, []);

  if (!lastOrder) {
    return (
      <div className="container py-5 mt-5 text-center">
        <PackageCheck size={60} className="text-muted mb-3 opacity-25" />
        <p className="text-muted">Tidak ada pesanan aktif saat ini.</p>
        <button className="btn btn-dark px-4 rounded-pill" onClick={() => navigate('/produk')}>Belanja Produk Terbaru</button>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-5 mt-5 text-start text-dark">
      <div className="container d-flex justify-content-center">
        <div className="bg-white shadow rounded-4 overflow-hidden w-100" style={{ maxWidth: '500px' }}>
          
          <div className="p-4 text-white text-center" style={{ backgroundColor: '#4A4631' }}>
            <h5 className="fw-bold mb-1">Pesanan Berhasil!</h5>
            <p className="mb-0 small opacity-75">Estimasi Tiba: 2-3 Hari Kerja (JNE)</p>
          </div>

          <div className="p-4 border-bottom">
            {lastOrder.items.map((item, index) => (
              <div key={index} className="d-flex align-items-center gap-3 mb-3">
                {/* Pastikan menggunakan item.image atau item.img sesuai data dari CheckoutPage */}
                <img src={item.image || item.img} alt={item.nama} style={{ width: '60px', height: '60px', objectFit: 'cover' }} className="rounded" />
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-0 small">{item.nama}</h6>
                  {/* Menggunakan item.varian dan item.jumlah sesuai struktur CheckoutPage */}
                  <p className="small text-muted mb-0">{item.varian} | {item.jumlah}x</p>
                </div>
                {/* Menangani toLocaleString agar tidak error jika harga kosong */}
                <span className="small fw-bold">Rp.{(item.harga || 0).toLocaleString('id-ID')}</span>
              </div>
            ))}
            <div className="d-flex justify-content-between pt-3 border-top mt-2">
              <span className="fw-bold small">Total Pembayaran (COD)</span>
              {/* Menggunakan totalHarga sesuai yang dikirim dari CheckoutPage */}
              <span className="fw-bold text-warning">Rp.{(lastOrder.totalHarga || 0).toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="p-4 d-grid gap-2">
            <button 
              className="btn text-white py-2 fw-bold d-flex align-items-center justify-content-center gap-2" 
              style={{ backgroundColor: '#E19E44', border: 'none' }}
              // Navigasi ke halaman riwayat pesanan (path /pesanan)
              onClick={() => navigate('/pesanan')}
            >
              <Truck size={18} /> Lihat Riwayat Pesanan
            </button>
            <button className="btn btn-outline-dark py-2 fw-bold d-flex align-items-center justify-content-center gap-2" onClick={() => navigate('/produk')}>
              <ShoppingBag size={18} /> Kembali Belanja
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderStatus;