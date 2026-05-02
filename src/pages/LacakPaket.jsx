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
      { label: 'Pending', key: 'Pending' },
      { label: 'Dikemas', key: 'Dikemas' },
      { label: 'Dikirim', key: 'Dikirim' },
      { label: 'Selesai', key: 'Selesai' },
    ];
    const statusIndex = allSteps.findIndex(s => s.key === status);
    return allSteps.map((step, index) => ({
      ...step,
      completed: index <= statusIndex,
      active: index === statusIndex
    }));
  };

  if (loading) return <div className="text-center py-5 mt-5 fw-bold">Menghubungkan ke Satelit Kurir...</div>;
  
  if (!currentOrder) return (
    <div className="container py-5 mt-5 text-center">
      <Package size={50} className="text-muted mb-3" />
      <h5>Data pengiriman tidak ditemukan.</h5>
      <button className="btn btn-warning mt-3 text-white fw-bold" onClick={() => navigate('/riwayat')}>Kembali ke Riwayat</button>
    </div>
  );

  const steps = getSteps(currentOrder.status);

  return (
    <div className="bg-white min-vh-100 py-5 mt-5 text-start">
      <div className="container" style={{ maxWidth: '800px' }}>
        <button onClick={() => navigate(-1)} className="btn btn-link text-dark text-decoration-none d-flex align-items-center gap-2 p-0 mb-4">
          <ChevronLeft size={20} /> <span className="fw-bold text-uppercase">Pelacakan Paket</span>
        </button>

        <div className="d-flex justify-content-between align-items-center mb-5 flex-nowrap overflow-auto pb-3">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="d-flex flex-column align-items-center" style={{ minWidth: '80px' }}>
                <div className={`rounded-circle d-flex align-items-center justify-content-center mb-2 shadow-sm`}
                  style={{ 
                    width: '35px', height: '35px', 
                    backgroundColor: step.completed ? '#E19E44' : '#f8f9fa',
                    color: step.completed ? 'white' : '#adb5bd',
                    border: `2px solid ${step.completed ? '#E19E44' : '#dee2e6'}`
                  }}>
                  {step.completed ? <Check size={18} strokeWidth={3} /> : index + 1}
                </div>
                <span className="fw-bold" style={{ fontSize: '10px', color: step.active ? '#E19E44' : '#6c757d' }}>{step.label}</span>
              </div>
              {index !== steps.length - 1 && (
                <div className="flex-grow-1 mx-2" style={{ height: '2px', backgroundColor: step.completed ? '#E19E44' : '#dee2e6', marginTop: '-20px', minWidth: '30px' }}></div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="card border-0 shadow-sm rounded-4 p-4 bg-light bg-opacity-50">
          <div className="d-flex justify-content-between border-bottom pb-3 mb-4">
            <h6 className="fw-bold mb-0">Riwayat Perjalanan</h6>
            <span className="badge bg-dark">ID: {currentOrder._id.substring(0,8).toUpperCase()}</span>
          </div>

          {currentOrder.trackingHistory && [...currentOrder.trackingHistory].reverse().map((log, index) => (
            <div key={index} className="d-flex gap-3 position-relative pb-4">
              {index !== currentOrder.trackingHistory.length - 1 && (
                <div className="position-absolute" style={{ left: '17px', top: '35px', bottom: '0', width: '2px', backgroundColor: '#E19E44' }}></div>
              )}
              <div className="z-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center text-white" 
                     style={{ width: '35px', height: '35px', backgroundColor: index === 0 ? '#E19E44' : '#adb5bd' }}>
                  {index === 0 ? <MapPin size={16} /> : <div style={{width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'white'}}></div>}
                </div>
              </div>
              <div className="flex-grow-1">
                <h6 className={`fw-bold mb-1 ${index === 0 ? 'text-dark' : 'text-muted'}`}>{log.keterangan}</h6>
                <p className="text-muted small mb-0">{log.lokasi || "Modis Center"}</p>
                <small className="text-muted">{new Date(log.waktu).toLocaleString('id-ID')}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LacakPaket;