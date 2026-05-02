import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Package, PlusCircle, DollarSign, LayoutGrid, 
  ShoppingCart, ArrowRight, Trash2, TrendingUp, PieChart as PieIcon
} from 'lucide-react';

// Import Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler, // IMPORT PLUGIN FILLER
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

// Registrasi Komponen Chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler, // REGISTRASI PLUGIN FILLER
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); 
  const [stats, setStats] = useState({ totalProducts: 0, orders: 0, revenue: 0 });
  const [recentProducts, setRecentProducts] = useState([]);
  const [orderData, setOrderData] = useState([]); 
  
  const [product, setProduct] = useState({
    name: '', price: '', category: '', img: '', warna: '', ukuran: '', bahan: '', gaya: '', motif: '' 
  });

  const colorMap = {
    "Black": "#000000",
    "Brown": "#6F4E37",
    "Sage Green": "#B2AC88",
    "Maroon": "#800000",
    "Navy Blue": "#000080",
    "Mocha": "#A38068"
  };

  const fetchData = async () => {
    try {
      const resProd = await axios.get('http://localhost:5000/api/products');
      const resOrders = await axios.get('http://localhost:5000/api/orders/all');
      
      const allOrders = resOrders.data || [];
      const totalRevenue = allOrders.reduce((acc, curr) => acc + (curr.totalHarga || 0), 0);

      setStats({
        totalProducts: resProd.data.length,
        orders: allOrders.length,
        revenue: totalRevenue
      });
      setRecentProducts(resProd.data.slice(0, 5));
      setOrderData(allOrders);
    } catch (err) {
      console.error("Gagal sinkronisasi data database:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const lineChartData = {
    labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
    datasets: [
      {
        label: 'Pendapatan (Rp)',
        data: [1200000, 1900000, 1500000, 2500000, 2200000, 3100000, stats.revenue / 10], 
        fill: true, // Opsi ini sekarang aman karena Filler sudah diregistrasi
        backgroundColor: 'rgba(78, 115, 223, 0.1)',
        borderColor: '#4e73df',
        tension: 0.4,
      },
    ],
  };

  const pieChartData = {
    labels: ['Gamis', 'Baju', 'Hijab', 'Mukena'],
    datasets: [
      {
        data: [45, 25, 20, 10], 
        backgroundColor: ['#4e73df', '#1cc88a', '#f6c23e', '#e74a3b'],
        hoverOffset: 4,
      },
    ],
  };

  const handleInputChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        alert("✅ Produk berhasil dihapus!");
        fetchData();
      } catch (err) {
        alert("❌ Gagal menghapus produk.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const arrayWarna = product.warna 
        ? product.warna.split(',').map(item => item.trim()) 
        : [];

      const arrayUkuran = product.ukuran 
        ? product.ukuran.split(',').map(item => item.trim()) 
        : [];

      const dataToSend = {
        name: product.name,
        slug: product.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        price: Number(product.price),
        category: product.category,
        description: `${product.name} bahan ${product.bahan} gaya ${product.gaya}`,
        img: product.img,
        colors: arrayWarna.map(w => ({ 
          name: w, 
          code: colorMap[w] || "#CCCCCC" 
        })), 
        sizes: arrayUkuran,
        features: [product.bahan, product.gaya, product.motif] 
      };

      await axios.post('http://localhost:5000/api/products/add', dataToSend);
      alert("✅ Produk Berhasil Ditambahkan!");
      setActiveTab('overview');
      fetchData(); 
      setProduct({ name: '', price: '', category: '', img: '', warna: '', ukuran: '', bahan: '', gaya: '', motif: '' });
    } catch (error) {
      alert("❌ Gagal menambah produk.");
    }
  };

  return (
    <div className="container py-5 mt-4 text-start text-dark">
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h2 className="fw-bold mb-1 text-dark">Halo, Admin Modis 👋</h2>
          <p className="text-muted mb-0">Kelola toko dan pantau statistik transaksi real-time.</p>
        </div>
        <div className="btn-group shadow-sm">
          <button className={`btn ${activeTab === 'overview' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setActiveTab('overview')}>Ringkasan</button>
          <button className={`btn ${activeTab === 'addProduct' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setActiveTab('addProduct')}><PlusCircle size={18} className="me-2" /> Tambah Produk</button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <>
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-4 text-white" style={{ background: 'linear-gradient(45deg, #4e73df, #224abe)' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div><p className="small mb-1 opacity-75">Total Koleksi</p><h3 className="fw-bold mb-0">{stats.totalProducts} Item</h3></div>
                  <Package size={35} className="opacity-50" />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-4 text-white" style={{ background: 'linear-gradient(45deg, #1cc88a, #13855c)' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div><p className="small mb-1 opacity-75">Pesanan Masuk</p><h3 className="fw-bold mb-0">{stats.orders} Transaksi</h3></div>
                  <ShoppingCart size={35} className="opacity-50" />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-4 text-white" style={{ background: 'linear-gradient(45deg, #f6c23e, #dda20a)' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div><p className="small mb-1 opacity-75">Total Omzet</p><h3 className="fw-bold mb-0">Rp {stats.revenue.toLocaleString('id-ID')}</h3></div>
                  <DollarSign size={35} className="opacity-50" />
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mb-5">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white h-100">
                <div className="d-flex align-items-center gap-2 mb-4">
                  <TrendingUp size={20} className="text-primary" />
                  <h6 className="fw-bold mb-0">Tren Penjualan Mingguan</h6>
                </div>
                <div style={{ height: '300px' }}>
                  <Line data={lineChartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white h-100">
                <div className="d-flex align-items-center gap-2 mb-4">
                  <PieIcon size={20} className="text-success" />
                  <h6 className="fw-bold mb-0">Minat Kategori</h6>
                </div>
                <div style={{ height: '300px' }} className="d-flex justify-content-center">
                  <Pie data={pieChartData} />
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-5">
              <div className="card-header bg-white py-3 border-bottom"><h6 className="fw-bold mb-0">Koleksi Terakhir</h6></div>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light text-muted small">
                    <tr>
                      <th className="ps-4">PRODUK</th>
                      <th>KATEGORI</th>
                      <th>HARGA</th>
                      <th className="text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProducts.map((item) => (
                      <tr key={item._id}>
                        <td className="ps-4">
                          <div className="d-flex align-items-center gap-3">
                            <img src={item.img} className="rounded-2" width="40" height="40" style={{objectFit: 'cover'}} alt="img" />
                            <span className="fw-semibold">{item.name}</span>
                          </div>
                        </td>
                        <td>{item.category}</td>
                        <td className="fw-bold">Rp {item.price.toLocaleString('id-ID')}</td>
                        <td className="text-center">
                          <button onClick={() => handleDelete(item._id)} className="btn btn-sm btn-outline-danger border-0"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </div>
        </>
      ) : (
        <div className="card border-0 shadow-sm p-4 p-md-5 rounded-4 bg-white">
            <h5 className="fw-bold mb-4">Input Data Koleksi Baru</h5>
            <form onSubmit={handleSubmit}>
                <div className="row g-4">
                    <div className="col-md-6">
                        <label className="form-label fw-bold small">NAMA PRODUK</label>
                        <input name="name" className="form-control shadow-none" value={product.name} onChange={handleInputChange} required placeholder="Aika Dress Silk Premium" />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold small">HARGA (RP)</label>
                        <input name="price" type="number" className="form-control shadow-none" value={product.price} onChange={handleInputChange} required placeholder="425000" />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold small">KATEGORI</label>
                        <select name="category" className="form-select shadow-none" value={product.category} onChange={handleInputChange} required>
                            <option value="">Pilih...</option>
                            <option value="Gamis">Gamis</option>
                            <option value="Baju">Baju</option>
                            <option value="Hijab">Hijab</option>
                            <option value="Mukena">Mukena</option>
                        </select>
                    </div>
             <div className="col-12">
                <div className="p-4 rounded-4 bg-light border border-2 border-white">
                  <p className="small fw-bold text-primary mb-3">ATRIBUT REKOMENDASI (CBF)</p>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="small fw-bold">BAHAN</label>
                      <select name="bahan" className="form-select form-select-sm shadow-none" value={product.bahan} onChange={handleInputChange} required>
                        <option value="">Pilih Bahan...</option>
                        <option value="Ceruty">Ceruty</option>
                        <option value="Silk">Silk</option>
                        <option value="Katun">Katun</option>
                        <option value="Jersey">Jersey</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold">WARNA (PISAH KOMA)</label>
                      <input name="warna" className="form-control form-control-sm shadow-none" value={product.warna} onChange={handleInputChange} placeholder="Black, Mocha, Sage Green" required />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold">UKURAN (PISAH KOMA)</label>
                      <input name="ukuran" className="form-control form-control-sm shadow-none" value={product.ukuran} onChange={handleInputChange} placeholder="S, M, L, XL, All Size" required />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold">GAYA</label>
                      <select name="gaya" className="form-select form-select-sm shadow-none" value={product.gaya} onChange={handleInputChange} required>
                        <option value="">Pilih Gaya...</option>
                        <option value="Syar'i">Syar'i</option>
                        <option value="Casual">Casual</option>
                        <option value="Minimalis">Minimalis</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold">MOTIF</label>
                      <select name="motif" className="form-select form-select-sm shadow-none" value={product.motif} onChange={handleInputChange} required>
                        <option value="">Pilih Motif...</option>
                        <option value="Polos">Polos</option>
                        <option value="Pattern">Pattern (Bermotif)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
                    <div className="col-12">
                        <label className="form-label fw-bold small">LINK GAMBAR</label>
                        <input name="img" className="form-control shadow-none" value={product.img} onChange={handleInputChange} placeholder="https://i.ibb.co.com/..." required />
                    </div>
                    <div className="col-12 mt-4 text-end">
                        <button type="button" className="btn btn-light px-4 me-2" onClick={() => setActiveTab('overview')}>Batal</button>
                        <button type="submit" className="btn btn-dark px-5 fw-bold shadow">PUBLIKASIKAN PRODUK</button>
                    </div>
                </div>
            </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;