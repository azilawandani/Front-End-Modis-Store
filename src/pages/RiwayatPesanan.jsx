import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { ChevronLeft, Calendar, Package, CheckCircle2, Clock, History, Truck } from 'lucide-react';

const RiwayatPesanan = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser && storedUser.id) {
        const response = await axios.get(`http://localhost:5000/api/orders/user/${storedUser.id}`);
        setOrders(response.data);
      }
    } catch (error) {
      console.error("Gagal memuat riwayat pesanan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    window.scrollTo(0, 0);
  }, []);

  const handleKonfirmasiSelesai = async (orderId) => {
    const confirmAction = window.confirm("Konfirmasi bahwa pesanan telah diterima?");
    if (!confirmAction) return;

    try {
      const response = await axios.put(`http://localhost:5000/api/orders/confirm-finish/${orderId}`);
      if (response.status === 200) {
        alert("Pesanan Selesai! Data telah diarsipkan.");
        fetchOrders(); 
      }
    } catch (error) {
      alert("Gagal memperbarui status pesanan.");
    }
  };

  const activeOrders = orders.filter(order => order.status !== 'Selesai');
  const completedOrders = orders.filter(order => order.status === 'Selesai');

  if (loading) return <div className="text-center py-5 mt-5 fw-bold">Menghubungkan ke Server...</div>;

  return (
    <div className="bg-light min-vh-100 py-5 mt-5 text-start">
      <div className="container" style={{ maxWidth: '800px' }}>
        
        <div className="d-flex align-items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="btn btn-white rounded-circle shadow-sm p-2 bg-white border-0">
            <ChevronLeft size={20} />
          </button>
          <h4 className="fw-bold mb-0">Status Pesanan</h4>
        </div>

        <div className="mb-5">
          <h6 className="fw-bold text-muted mb-3 text-uppercase small tracking-wider">Sedang Berjalan</h6>
          {activeOrders.length === 0 ? (
            <div className="text-center py-4 bg-white rounded-4 shadow-sm border border-dashed">
              <Package size={40} className="text-muted mb-2 opacity-50" />
              <p className="text-muted small mb-0">Tidak ada pesanan yang sedang diproses.</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {activeOrders.map((order) => (
                <div key={order._id} className="card border-0 shadow-sm rounded-4 overflow-hidden">
                  <div className="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2 text-muted small font-monospace">
                      <Calendar size={14} />
                      <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString('id-ID') : '-'}</span>
                    </div>
                    <div className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-3 py-2 rounded-pill d-flex align-items-center gap-1">
                      <Clock size={14} />
                      <span className="small fw-bold">{order.status}</span>
                    </div>
                  </div>

                  <div className="card-body px-4 py-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="d-flex align-items-center gap-3 mb-2">
                        <div className="bg-light rounded-3 p-2 border">
                           <Package size={20} className="text-muted" />
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="fw-bold mb-0 small">{item.nama}</h6>
                          <span className="text-muted extra-small">Jumlah: {item.jumlah}</span>
                        </div>
                        <span className="fw-bold small">Rp.{item.harga.toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                  </div>

                  <div className="card-footer bg-white border-top-0 px-4 py-3 d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted extra-small mb-0">Total Tagihan</p>
                      <h6 className="fw-bold text-dark mb-0">Rp.{order.totalHarga.toLocaleString('id-ID')}</h6>
                    </div>
                    {/* BUTTON GROUP */}
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-outline-dark btn-sm fw-bold px-3 py-2 rounded-3 d-flex align-items-center gap-1"
                        onClick={() => navigate(`/lacak-paket/${order._id}`)}
                      >
                        <Truck size={14} /> Lacak
                      </button>
                      <button 
                        className="btn btn-success btn-sm fw-bold px-3 py-2 rounded-3 shadow-sm"
                        onClick={() => handleKonfirmasiSelesai(order._id)}
                      >
                        Diterima
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {completedOrders.length > 0 && (
          <div className="mt-5">
            <h6 className="fw-bold text-muted mb-3 text-uppercase small tracking-wider d-flex align-items-center gap-2">
              <History size={16} /> Riwayat Selesai
            </h6>
            <div className="d-flex flex-column gap-2 opacity-75">
              {completedOrders.map((order) => (
                <div key={order._id} className="p-3 bg-white rounded-4 border-0 shadow-sm d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-success bg-opacity-10 p-2 rounded-circle">
                      <CheckCircle2 size={18} className="text-success" />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0 small text-dark">
                        {order.items.length > 1 ? `${order.items[0].nama} dan lainnya` : order.items[0].nama}
                      </h6>
                      <span className="extra-small text-muted">{new Date(order.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                  <div className="text-end d-flex align-items-center gap-3">
                    <div>
                      <span className="fw-bold d-block small">Rp.{order.totalHarga.toLocaleString('id-ID')}</span>
                      <span className="badge bg-light text-success extra-small border">SELESAI</span>
                    </div>
                    {/* Tetap bisa lacak di riwayat selesai jika diperlukan */}
                    <button 
                      className="btn btn-light btn-sm rounded-circle p-2"
                      onClick={() => navigate(`/lacak-paket/${order._id}`)}
                      title="Lihat Detail Pengiriman"
                    >
                      <Truck size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .extra-small { font-size: 11px; }
        .font-monospace { font-family: 'Courier New', Courier, monospace; }
        .tracking-wider { letter-spacing: 0.05em; }
      `}</style>
    </div>
  );
};

export default RiwayatPesanan;