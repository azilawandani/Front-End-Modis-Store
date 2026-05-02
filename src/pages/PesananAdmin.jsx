import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingBag, Clock, CheckCircle, Truck, Trash2, FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PesananAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders/all');
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

  // --- FUNGSI CETAK LAPORAN PENJUALAN (FOR ADMIN) ---
  const downloadSalesReport = () => {
    const doc = new jsPDF();
    
    // Header Laporan
    doc.setFontSize(18);
    doc.text("LAPORAN PENJUALAN - MODIS STORE", 14, 20);
    doc.setFontSize(10);
    doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 28);
    doc.line(14, 32, 196, 32);

    // Data Tabel
    const tableColumn = ["ID Pesanan", "Tanggal", "Pelanggan", "Status", "Total"];
    const tableRows = [];

    orders.forEach(order => {
      const rowData = [
        order._id.substring(order._id.length - 8).toUpperCase(),
        new Date(order.createdAt).toLocaleDateString('id-ID'),
        order.namaPelanggan || "Guest",
        order.status,
        `Rp ${order.totalHarga.toLocaleString()}`
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'striped',
      headStyles: { fillColor: [74, 70, 49] } // Warna tema Modis Store
    });

    // Ringkasan di bawah tabel
    const finalY = doc.lastAutoTable.finalY + 10;
    const totalOmzet = orders.reduce((acc, curr) => acc + (curr.totalHarga || 0), 0);
    
    doc.setFont("helvetica", "bold");
    doc.text(`Total Transaksi: ${orders.length}`, 14, finalY);
    doc.text(`Total Omzet Keseluruhan: Rp ${totalOmzet.toLocaleString()}`, 14, finalY + 7);

    doc.save(`Laporan-Penjualan-Modis-${new Date().getTime()}.pdf`);
  };

  const updateStatus = async (id, currentStatus) => {
    let nextStatus = '';
    let ket = '';

    if (currentStatus === 'Pending') { nextStatus = 'Dikemas'; ket = 'Penjual sedang mengemas paket'; }
    else if (currentStatus === 'Dikemas') { nextStatus = 'Dikirim'; ket = 'Paket telah diserahkan ke kurir'; }
    else if (currentStatus === 'Dikirim') { nextStatus = 'Selesai'; ket = 'Paket telah diterima pelanggan'; }

    if (!nextStatus) return;

    try {
      await axios.put(`http://localhost:5000/api/orders/update-status/${id}`, {
        status: nextStatus,
        keterangan: ket,
        lokasi: "Gudang MODIS Pekanbaru"
      });
      alert(`Status diperbarui menjadi ${nextStatus}`);
      fetchOrders();
    } catch (err) {
      alert("Gagal memperbarui status");
    }
  };

  if (loading) return <div className="text-center py-5 mt-5 fw-bold">Memuat pesanan masuk...</div>;

  return (
    <div className="container py-5 mt-4 text-start text-dark">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Daftar Pesanan Masuk</h2>
        <button 
          onClick={downloadSalesReport}
          className="btn btn-success rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2"
        >
          <FileDown size={18} /> Cetak Laporan
        </button>
      </div>
      
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card p-4 border-0 shadow-sm text-white" style={{ background: 'linear-gradient(45deg, #4A4631, #817b5a)' }}>
            <p className="small mb-1 opacity-75">Perlu Diproses</p>
            <h3 className="fw-bold mb-0">{orders.filter(o => o.status !== 'Selesai').length} Pesanan</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-4 border-0 shadow-sm bg-white border">
            <p className="small mb-1 text-muted">Total Omzet</p>
            <h3 className="fw-bold mb-0 text-dark">Rp {orders.reduce((acc, curr) => acc + (curr.totalHarga || 0), 0).toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="bg-light">
              <tr className="small text-muted">
                <th className="ps-4">ORDER ID</th>
                <th>PELANGGAN</th>
                <th>TOTAL BAYAR</th>
                <th>STATUS</th>
                <th className="text-center">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="ps-4 small fw-bold text-primary">
                    ...{order._id.substring(order._id.length - 8).toUpperCase()}
                  </td>
                  <td>
                    <div className="fw-bold text-dark">{order.namaPelanggan || "Pelanggan Modis"}</div>
                    <small className="text-muted">{new Date(order.createdAt).toLocaleDateString('id-ID')}</small>
                  </td>
                  <td className="fw-bold">Rp {order.totalHarga.toLocaleString()}</td>
                  <td>
                    <span className={`badge px-3 py-2 ${
                      order.status === 'Pending' ? 'bg-warning text-dark' : 
                      order.status === 'Selesai' ? 'bg-success' : 'bg-info text-white'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="text-center">
                    {order.status !== 'Selesai' && (
                      <button 
                        onClick={() => updateStatus(order._id, order.status)}
                        className="btn btn-sm btn-dark px-3 rounded-pill"
                      >
                        Proses ke {order.status === 'Pending' ? 'Kemas' : order.status === 'Dikemas' ? 'Kirim' : 'Selesai'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <div className="p-5 text-center text-muted">Belum ada pesanan masuk.</div>}
        </div>
      </div>
    </div>
  );
};

export default PesananAdmin;