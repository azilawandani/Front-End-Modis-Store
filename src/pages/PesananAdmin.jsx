import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User, MapPin, Package, FileDown, X, Phone, Mail } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PesananAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('https://back-end-modis-store.vercel.app/api/orders/all');
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Gagal mengambil data pesanan:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const downloadSalesReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("LAPORAN PENJUALAN - MODIS STORE", 14, 20);
    const tableColumn = ["ID Pesanan", "Tanggal", "Pelanggan", "Status", "Total"];
    const tableRows = orders.map(order => [
      order._id?.substring(order._id.length - 8).toUpperCase(),
      new Date(order.createdAt).toLocaleDateString('id-ID'),
      order.namaPelanggan || "Guest",
      order.status,
      `Rp ${(order.totalHarga || 0).toLocaleString()}`
    ]);
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 40, headStyles: { fillColor: [74, 70, 49] } });
    doc.save(`Laporan-Modis-${Date.now()}.pdf`);
  };

  const updateStatus = async (id, currentStatus) => {
    let nextStatus = '';
    let ket = '';

    if (currentStatus === 'Pending') {
      nextStatus = 'Dikemas';
      ket = 'Penjual sedang mengemas paket';
    } else if (currentStatus === 'Dikemas') {
      nextStatus = 'Dikirim';
      ket = 'Paket telah diserahkan ke kurir';
    } else if (currentStatus === 'Dikirim') {
      nextStatus = 'Selesai';
      ket = 'Pesanan telah diterima pelanggan';
    }

    if (!nextStatus) return;

    try {
      await axios.put(`https://back-end-modis-store.vercel.app/api/orders/update-status/${id}`, {
        status: nextStatus,
        keterangan: ket,
        lokasi: "Gudang MODIS Pekanbaru"
      });
      alert(`Status diperbarui menjadi ${nextStatus}`);
      fetchOrders();
      setShowModal(false);
    } catch (err) {
      alert("Gagal memperbarui status");
    }
  };

  const OrderDetailModal = () => {
    if (!selectedOrder) return null;

    return (
      <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050 }}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '25px' }}>
            <div className="modal-header border-0 p-4 pb-0">
              <h5 className="fw-bold">Detail Pesanan #{selectedOrder._id?.substring(selectedOrder._id.length - 8).toUpperCase()}</h5>
              <button onClick={() => setShowModal(false)} className="btn-close shadow-none"></button>
            </div>
            
            <div className="modal-body p-4 text-start">
              <div className="row g-4">
                {/* Informasi Pelanggan */}
                <div className="col-md-5">
                  <div className="p-3 bg-light rounded-4 mb-3 border">
                    <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 small text-muted text-uppercase">
                      <User size={16}/> Informasi Pelanggan
                    </h6>
                    <p className="small mb-2 fw-bold text-dark">{selectedOrder.namaPelanggan || "Nama tidak tersedia"}</p>
                    
                    {/* PERBAIKAN: Memanggil Email & HP dari objek userId hasil populate di Backend */}
                    <div className="d-flex align-items-center gap-2 text-muted mb-1" style={{ fontSize: '11px' }}>
                      <Mail size={12} /> {selectedOrder.userId?.email || "Email tidak ditemukan"}
                    </div>
                    <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '11px' }}>
                      <Phone size={12} /> {selectedOrder.userId?.phone || "No. HP tidak ditemukan"}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-light rounded-4 border">
                    <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 small text-muted text-uppercase">
                      <MapPin size={16}/> Alamat Pengiriman
                    </h6>
                    <p className="small text-dark mb-0" style={{ lineHeight: '1.6' }}>
                      {selectedOrder.alamatPengiriman?.alamatLengkap || "Alamat tidak ditemukan"}
                    </p>
                  </div>
                </div>

                {/* Produk yang Dipesan */}
                <div className="col-md-7">
                  <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 small text-muted text-uppercase">
                    <Package size={16}/> Produk yang Dipesan {selectedOrder.items?.length > 0 && `(${selectedOrder.items.length})`}
                  </h6>
                  <div className="overflow-auto pe-2" style={{ maxHeight: '320px' }}>
                    {(selectedOrder.items || []).map((item, index) => (
                      <div key={index} className="d-flex align-items-center gap-3 mb-3 p-3 bg-white border rounded-4 shadow-sm">
                        <div className="bg-secondary rounded-3 d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: '70px', height: '70px', fontSize: '9px' }}>
                          MODIS
                        </div>
                        <div className="flex-grow-1">
                          <p className="small fw-bold mb-1 text-dark">{item.nama || "Produk Modis"}</p>
                          <p className="mb-2 text-muted" style={{ fontSize: '11px' }}>
                            Varian: <span className="text-dark fw-bold">{item.varian || '-'}</span>
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                             <span className="badge bg-primary-subtle text-primary rounded-pill fw-bold" style={{ fontSize: '10px' }}>{item.jumlah || 1} Pcs</span>
                             <span className="small fw-bold text-dark">Rp {(item.harga || 0).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3 p-3 bg-dark text-white rounded-4 d-flex justify-content-between align-items-center shadow">
                    <span className="small opacity-75">Total Pembayaran</span>
                    <h5 className="fw-bold mb-0">Rp {(selectedOrder.totalHarga || 0).toLocaleString()}</h5>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-0 p-4 pt-0">
              <button className="btn btn-light px-4 rounded-pill fw-bold border" onClick={() => setShowModal(false)}>Tutup</button>
              {/* BUTTON UPDATE TETAP MUNCUL JIKA STATUS BUKAN SELESAI */}
              {selectedOrder.status !== 'Selesai' && (
                <button 
                  className="btn btn-dark px-4 rounded-pill fw-bold shadow" 
                  onClick={() => updateStatus(selectedOrder._id, selectedOrder.status)}
                >
                  Proses ke {selectedOrder.status === 'Pending' ? 'Kemas' : selectedOrder.status === 'Dikemas' ? 'Kirim' : 'Selesai'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div className="text-center py-5 mt-5 fw-bold text-muted">Memuat data pesanan...</div>;

  return (
    <div className="container py-5 mt-4 text-start">
      {showModal && <OrderDetailModal />}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0 text-dark">Daftar Pesanan Masuk</h2>
        <button onClick={downloadSalesReport} className="btn btn-success rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2">
          <FileDown size={18} /> Cetak Laporan
        </button>
      </div>
      
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card p-4 border-0 shadow-sm text-white" style={{ background: 'linear-gradient(45deg, #4A4631, #817b5a)', borderRadius: '20px' }}>
            <p className="small mb-1 opacity-75">Perlu Diproses</p>
            <h3 className="fw-bold mb-0">{orders.filter(o => o.status !== 'Selesai').length} Pesanan</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-4 border-0 shadow-sm bg-white border" style={{ borderRadius: '20px' }}>
            <p className="small mb-1 text-muted">Total Omzet</p>
            <h3 className="fw-bold mb-0 text-dark">Rp {orders.reduce((acc, curr) => acc + (curr.totalHarga || 0), 0).toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="bg-light">
              <tr className="small text-muted text-uppercase" style={{ letterSpacing: '0.5px' }}>
                <th className="ps-4 py-3">Order ID</th>
                <th className="py-3">Pelanggan</th>
                <th className="py-3">Total</th>
                <th className="py-3">Status</th>
                <th className="text-center py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="ps-4">
                    <button onClick={() => { setSelectedOrder(order); setShowModal(true); }} className="btn btn-link p-0 text-decoration-none fw-bold small text-primary">
                      #{order._id?.substring(order._id.length - 8).toUpperCase()}
                    </button>
                  </td>
                  <td>
                    <div className="fw-bold text-dark">{order.namaPelanggan || "User"}</div>
                    <small className="text-muted" style={{ fontSize: '11px' }}>{new Date(order.createdAt).toLocaleDateString('id-ID')}</small>
                  </td>
                  <td className="fw-bold small text-dark">Rp {(order.totalHarga || 0).toLocaleString()}</td>
                  <td>
                    <span className={`badge px-3 py-2 rounded-pill ${order.status === 'Pending' ? 'bg-warning text-dark' : order.status === 'Selesai' ? 'bg-success' : 'bg-info text-white'}`} style={{ fontSize: '10px' }}>
                      {order.status}
                    </span>
                  </td>
                  <td className="text-center">
                    <button onClick={() => { setSelectedOrder(order); setShowModal(true); }} className="btn btn-sm btn-outline-dark px-3 rounded-pill me-2 fw-bold" style={{ fontSize: '11px' }}>Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <div className="p-5 text-center text-muted small">Belum ada pesanan masuk.</div>}
        </div>
      </div>
    </div>
  );
};

export default PesananAdmin;