import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { ChevronLeft, Calendar, Package, Clock, History, Truck, CheckCircle2, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const RiwayatPesanan = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const userId = storedUser?.id || storedUser?._id;

      if (userId) {
        const response = await axios.get(`http://localhost:5000/api/orders/user/${userId}`);
        // Pastikan response.data adalah array, jika tidak set array kosong
        setOrders(Array.isArray(response.data) ? response.data : []);
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

  // --- FUNGSI CETAK INVOICE (DENGAN PENGAMAN DATA) ---
  const handleDownloadInvoice = (order) => {
    const doc = jsPDF(); 
    
    // Header
    doc.setFontSize(20);
    doc.text("MODIS STORE", 14, 22);
    doc.setFontSize(10);
    doc.text("Pusat Fashion Muslim - Duri, Riau", 14, 30);
    doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`, 14, 35);
    doc.line(14, 40, 196, 40);

    // Detail Pesanan
    doc.setFontSize(12);
    doc.text("INVOICE PEMESANAN (COD)", 14, 50);
    doc.setFontSize(10);
    doc.text(`No. Resi      : ${order.noResi || 'DIPROSES'}`, 14, 58);
    doc.text(`ID Pesanan    : ${(order._id || '').toUpperCase()}`, 14, 63);
    doc.text(`Status        : ${(order.status || 'PENDING').toUpperCase()}`, 14, 68);
    doc.text(`Metode Bayar  : COD (Bayar di Tempat)`, 14, 73);

    // Tabel Barang
    const tableColumn = ["Nama Produk", "Varian", "Harga", "Qty", "Subtotal"];
    const tableRows = [];

    // Pengaman jika items undefined
    const items = order.items || [];

    items.forEach(item => {
      const rowData = [
        item.nama || 'Produk',
        item.varian || "-",
        `Rp${(item.harga || 0).toLocaleString()}`,
        item.jumlah || 0,
        `Rp${((item.harga || 0) * (item.jumlah || 0)).toLocaleString()}`
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 80,
      theme: 'grid',
      headStyles: { fillColor: [74, 74, 42] } 
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Total Belanja : Rp${((order.totalHarga || 0) - (order.ongkir || 0)).toLocaleString()}`, 140, finalY);
    doc.text(`Ongkos Kirim  : Rp${(order.ongkir || 0).toLocaleString()}`, 140, finalY + 6);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL BAYAR   : Rp${(order.totalHarga || 0).toLocaleString()}`, 140, finalY + 12);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.text("* Harap siapkan uang pas sesuai total bayar untuk kurir.", 14, finalY + 25);
    doc.text("* Invoice ini adalah bukti transaksi sah dari Modis Store.", 14, finalY + 30);

    doc.save(`Invoice-Modis-${(order._id || 'order').substring(0, 7)}.pdf`);
  };

  const handleKonfirmasiSelesai = async (orderId) => {
    if (!window.confirm("Apakah paket sudah Anda terima dengan baik?")) return;
    try {
      await axios.put(`http://localhost:5000/api/orders/confirm-finish/${orderId}`);
      alert("✅ Pesanan Selesai! Terima kasih telah berbelanja.");
      fetchOrders(); 
    } catch (error) {
      alert("Gagal memperbarui status pesanan.");
    }
  };

  // Filter dengan pengaman jika status undefined
  const activeOrders = orders.filter(order => (order.status || '') !== 'Selesai');
  const completedOrders = orders.filter(order => (order.status || '') === 'Selesai');

  if (loading) return <div className="text-center py-5 mt-5 fw-bold text-dark">Mengambil data dari database...</div>;

  return (
    <div className="bg-light min-vh-100 py-5 mt-5 text-start text-dark">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="d-flex align-items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="btn btn-white rounded-circle shadow-sm p-2 bg-white border-0">
            <ChevronLeft size={20} />
          </button>
          <h4 className="fw-bold mb-0">Riwayat Pesanan Saya</h4>
        </div>

        <div className="mb-5">
          <h6 className="fw-bold text-muted mb-3 text-uppercase small">Sedang Diproses</h6>
          {activeOrders.length === 0 ? (
            <div className="text-center py-5 bg-white rounded-4 shadow-sm border border-dashed">
              <Package size={40} className="text-muted mb-2 opacity-50" />
              <p className="text-muted small mb-0">Belum ada pesanan yang sedang berjalan.</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {activeOrders.map((order) => (
                <div key={order._id} className="card border-0 shadow-sm rounded-4 overflow-hidden">
                  <div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center">
                    <span className="small text-muted fw-bold"><Calendar size={14} className="me-2"/>{new Date(order.createdAt).toLocaleDateString()}</span>
                    <span className="badge bg-warning text-dark px-3 py-2 rounded-pill small fw-bold text-uppercase">{order.status || 'PENDING'}</span>
                  </div>
                  <div className="card-body px-4">
                    {(order.items || []).map((item, idx) => (
                      <div key={idx} className="d-flex justify-content-between align-items-center mb-2">
                        <div className="small fw-bold">{item.nama} <span className="text-muted fw-normal">x{item.jumlah}</span></div>
                        <div className="small fw-bold">Rp.{(item.harga || 0).toLocaleString()}</div>
                      </div>
                    ))}
                    <hr />
                    <div className="d-flex justify-content-between align-items-end">
                      <div>
                        <p className="text-muted mb-0" style={{fontSize: '10px'}}>Total Tagihan</p>
                        <h6 className="fw-bold mb-0">Rp.{(order.totalHarga || 0).toLocaleString()}</h6>
                      </div>
                      <div className="d-flex gap-2">
                        <button className="btn btn-light border btn-sm px-3 rounded-pill fw-bold" onClick={() => handleDownloadInvoice(order)}>
                          <FileText size={14} className="me-1"/> Invoice
                        </button>
                        <button className="btn btn-outline-dark btn-sm px-3 rounded-pill fw-bold" onClick={() => navigate(`/lacak-paket/${order._id}`)}>
                          <Truck size={14} className="me-1"/> Lacak
                        </button>
                        <button className="btn btn-success btn-sm px-3 rounded-pill fw-bold" onClick={() => handleKonfirmasiSelesai(order._id)}>
                          Diterima
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {completedOrders.length > 0 && (
          <div className="mt-5">
            <h6 className="fw-bold text-muted mb-3 text-uppercase small">Selesai</h6>
            <div className="d-flex flex-column gap-2">
              {completedOrders.map((order) => (
                <div key={order._id} className="p-3 bg-white rounded-4 border-0 shadow-sm d-flex justify-content-between align-items-center opacity-75">
                  <div className="d-flex align-items-center gap-3">
                    <CheckCircle2 size={20} className="text-success" />
                    <div>
                      <h6 className="fw-bold mb-0 small text-dark">{(order.items?.[0]?.nama) || 'Produk'} {order.items?.length > 1 && '...'}</h6>
                      <span className="text-muted" style={{fontSize: '10px'}}>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div className="text-end">
                      <span className="fw-bold d-block small">Rp.{(order.totalHarga || 0).toLocaleString()}</span>
                      <span className="badge bg-light text-success border extra-small">SELESAI</span>
                    </div>
                    <button className="btn btn-light btn-sm rounded-circle border p-2" onClick={() => handleDownloadInvoice(order)}>
                      <FileText size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiwayatPesanan;