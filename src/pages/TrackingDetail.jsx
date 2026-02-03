import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ChevronLeft, Package, Truck, Home, CheckCircle } from 'lucide-react';

const TrackingDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders } = useCart();

  // Cari data pesanan spesifik berdasarkan ID di URL
  const currentOrder = orders.find(o => o.id === orderId || o.noPesanan === orderId);

  const trackingSteps = [
    { status: 'Pesanan Dibuat', time: currentOrder?.tanggal || '-', desc: 'Pesanan telah berhasil dibuat.', icon: <Package size={20} />, completed: true },
    { status: 'Pesanan Dikemas', time: '-', desc: 'Penjual sedang menyiapkan produk Anda.', icon: <Package size={20} />, completed: true },
    { status: 'Dalam Perjalanan', time: '-', desc: 'Paket telah diserahkan ke kurir JNE.', icon: <Truck size={20} />, completed: false },
    { status: 'Tiba di Tujuan', time: '-', desc: 'Pesanan akan segera sampai.', icon: <Home size={20} />, completed: false },
  ];

  if (!currentOrder) return <div className="mt-5 pt-5 text-center">Data tidak ditemukan.</div>;

  return (
    <div className="bg-white min-vh-100 py-5 mt-5 text-start">
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
          <button onClick={() => navigate(-1)} className="btn btn-light rounded-circle shadow-sm"><ChevronLeft size={20} /></button>
          <h4 className="fw-bold mb-0">Detail Pelacakan</h4>
        </div>

        <div className="ps-3 mt-4">
          {trackingSteps.map((step, index) => (
            <div key={index} className="d-flex gap-4 mb-4 position-relative">
              {index !== trackingSteps.length - 1 && (
                <div className="position-absolute" style={{ left: '19px', top: '40px', bottom: '-25px', width: '2px', backgroundColor: step.completed ? '#4A4631' : '#E9ECEF' }}></div>
              )}
              <div className="rounded-circle d-flex align-items-center justify-content-center shadow-sm position-relative" style={{ width: '40px', height: '40px', backgroundColor: step.completed ? '#4A4631' : '#F8F9FA', color: step.completed ? 'white' : '#ADB5BD', zIndex: 1 }}>
                {step.completed ? <CheckCircle size={18} /> : step.icon}
              </div>
              <div>
                <h6 className={`fw-bold mb-1 ${step.completed ? 'text-dark' : 'text-muted'}`}>{step.status}</h6>
                <p className="text-muted small mb-0">{step.time}</p>
                <p className="text-muted small mb-0 lh-sm">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrackingDetail;