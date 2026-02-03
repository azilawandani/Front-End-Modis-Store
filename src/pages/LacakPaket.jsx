import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Check, ChevronLeft, Package, MapPin } from 'lucide-react';

const LacakPaket = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/track/${orderId}`);
        setCurrentOrder(response.data);
      } catch (error) {
        console.error("Gagal mengambil detail pelacakan:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
    window.scrollTo(0, 0);
  }, [orderId]);

  const getSteps = (status) => {
    const allSteps = [
      { label: 'Pesanan Dibuat', key: 'Pending' },
      { label: 'Sedang Dikemas', key: 'Dikemas' },
      { label: 'Sedang Dikirim', key: 'Dikirim' },
      { label: 'Pesanan Tiba', key: 'Selesai' },
    ];
    const statusIndex = allSteps.findIndex(s => s.key === status);
    return allSteps.map((step, index) => ({
      ...step,
      completed: index <= statusIndex,
      active: index === statusIndex
    }));
  };

  if (loading) return <div className="text-center py-5 mt-5 fw-bold">Memuat data pelacakan...</div>;
  
  if (!currentOrder) return (
    <div className="container py-5 mt-5 text-center">
      <Package size={50} className="text-muted mb-3" />
      <h5>Data pelacakan tidak ditemukan.</h5>
      <button className="btn btn-warning mt-3 text-white fw-bold" onClick={() => navigate('/riwayat')}>Kembali</button>
    </div>
  );

  const steps = getSteps(currentOrder.status);

  return (
    <div className="bg-white min-vh-100 py-5 mt-5">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="text-start mb-4">
          <button onClick={() => navigate(-1)} className="btn btn-link text-dark text-decoration-none d-flex align-items-center gap-2 p-0">
            <ChevronLeft size={20} /> <span className="fw-bold text-uppercase" style={{ fontSize: '14px' }}>Status Pesanan</span>
          </button>
        </div>

        {/* --- STEPPER HORIZONTAL --- */}
        <div className="d-flex justify-content-center align-items-center mb-5 flex-wrap">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="d-flex flex-column align-items-center position-relative" style={{ width: '100px' }}>
                <div className="rounded-circle d-flex align-items-center justify-content-center mb-2 shadow-sm"
                  style={{ 
                    width: '35px', height: '35px', 
                    border: `2px solid ${step.completed ? '#E19E44' : '#dee2e6'}`,
                    backgroundColor: step.completed ? '#E19E44' : 'white',
                    color: step.completed ? 'white' : '#dee2e6'
                  }}>
                  {step.completed ? <Check size={18} strokeWidth={3} /> : index + 1}
                </div>
                <span className="text-center fw-bold" style={{ fontSize: '10px', color: step.active ? '#E19E44' : '#6c757d' }}>
                  {step.label}
                </span>
              </div>
              {index !== steps.length - 1 && (
                <div className="flex-grow-1 d-none d-md-block" style={{ height: '2px', backgroundColor: step.completed ? '#E19E44' : '#dee2e6', marginBottom: '15px', maxWidth: '80px' }}></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* --- TIMELINE VERTIKAL DINAMIS --- */}
        <div className="mt-5 mx-auto border-0 p-4 rounded-4 shadow-sm bg-light bg-opacity-50 text-start" style={{ maxWidth: '600px' }}>
          <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
            <h6 className="fw-bold mb-0">Detail Perjalanan</h6>
            <span className="badge bg-dark">MODIS-{currentOrder._id.substring(currentOrder._id.length - 8).toUpperCase()}</span>
          </div>
          
          <div className="position-relative">
            {currentOrder.trackingHistory && currentOrder.trackingHistory.length > 0 ? (
              // Mengurutkan riwayat (terbaru di paling atas)
              [...currentOrder.trackingHistory].reverse().map((log, index) => (
                <div key={index} className="d-flex gap-4 position-relative">
                  {/* Garis Vertikal Oranye */}
                  {index !== currentOrder.trackingHistory.length - 1 && (
                    <div className="position-absolute" style={{ left: '17px', top: '35px', bottom: '0', width: '2px', backgroundColor: '#E19E44' }}></div>
                  )}
                  
                  {/* Ikon Bulatan */}
                  <div className="position-relative" style={{ zIndex: 2 }}>
                    <div className="rounded-circle d-flex align-items-center justify-content-center text-white shadow-sm" 
                         style={{ width: '35px', height: '35px', backgroundColor: index === 0 ? '#E19E44' : '#adb5bd' }}>
                      {index === 0 ? <MapPin size={16} /> : <div style={{width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white'}}></div>}
                    </div>
                  </div>

                  {/* Konten Riwayat */}
                  <div className="flex-grow-1 pb-5">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        {/* Nama field disesuaikan persis dengan MongoDB: keterangan & lokasi */}
                        <h6 className={`fw-bold mb-1 ${index === 0 ? 'text-dark' : 'text-muted'}`}>{log.keterangan}</h6>
                        <p className="text-muted small mb-0">{log.lokasi}</p>
                      </div>
                      <div className="text-end text-muted small">
                        <span className="fw-bold d-block">{log.waktu ? new Date(log.waktu).toLocaleDateString('id-ID', {day:'2-digit', month:'short'}) : '-'}</span>
                        <span>{log.waktu ? new Date(log.waktu).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'}) : '--:--'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                 <p className="text-muted small">Belum ada riwayat pengiriman.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LacakPaket;