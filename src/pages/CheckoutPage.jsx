import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; 
import { ChevronLeft, MapPin } from 'lucide-react';
import axios from 'axios';

const CheckoutPage = () => {
  const { cartItems, buyNowItem, clearCart } = useCart();
  const { user } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();

  const mode = new URLSearchParams(location.search).get('mode');
  const isSpecialMode = mode === 'direct' || mode === 'selected';
  
  const itemsToDisplay = isSpecialMode 
    ? (Array.isArray(buyNowItem) ? buyNowItem : (buyNowItem ? [buyNowItem] : []))
    : cartItems;

  const [userAddress, setUserAddress] = useState("");
  const [ongkir, setOngkir] = useState(0);

  useEffect(() => {
    const activeUser = JSON.parse(localStorage.getItem('user'));
    const address = activeUser?.address || "Alamat belum diatur di profil";
    const province = activeUser?.province || "";
    setUserAddress(address);

    const subtotal = itemsToDisplay.reduce((acc, item) => acc + (item.price * item.qty), 0);
    
    // --- LOGIKA ONGKIR NASIONAL (SKRIPSI) ---
    const addrLower = address.toLowerCase();
    const provLower = province.toLowerCase();

    if (subtotal > 1000000) {
      setOngkir(0);
    } 
    else if (addrLower.includes("pekanbaru")) {
      setOngkir(0);
    } else if (provLower.includes("riau")) {
      setOngkir(15000);
    }
    else if (provLower.includes("jakarta") || provLower.includes("jawa") || provLower.includes("sumatera") || provLower.includes("banten") || provLower.includes("diy")) {
      setOngkir(25000);
    }
    else if (provLower.includes("kalimantan") || provLower.includes("sulawesi") || provLower.includes("bali") || provLower.includes("nusa tenggara")) {
      setOngkir(45000);
    }
    else if (provLower.includes("maluku") || provLower.includes("papua")) {
      setOngkir(65000);
    }
    else {
      setOngkir(30000);
    }

    window.scrollTo(0, 0);
  }, [itemsToDisplay]);

  const subtotal = itemsToDisplay.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const totalAkhir = subtotal + ongkir;

  const handleOrder = async () => {
    try {
      const activeUser = JSON.parse(localStorage.getItem('user'));
      if (!activeUser) return navigate('/login');

      if (userAddress.includes("belum diatur")) {
        alert("Harap isi alamat lengkap di profil terlebih dahulu!");
        return navigate('/profile');
      }

      const generatedResi = `MODIS-NAT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // --- KONSTRUKSI DATA UNTUK BACKEND & SESSION ---
      const orderData = {
        userId: activeUser.id || activeUser._id,
        namaPelanggan: activeUser.nama || activeUser.name || "Pelanggan Modis", 
        items: itemsToDisplay.map(item => ({
          productId: item.id || item._id,
          nama: item.name,   // Konsisten menggunakan 'nama'
          harga: item.price, // Konsisten menggunakan 'harga'
          jumlah: item.qty,  // Konsisten menggunakan 'jumlah'
          varian: `${item.color || 'Default'} / ${item.size || 'All Size'}`,
          image: item.img || item.image
        })),
        totalHarga: totalAkhir,
        ongkir: ongkir,
        noResi: generatedResi,
        status: "Pending",
        alamatPengiriman: {
          alamatLengkap: userAddress
        }
      };

      const response = await axios.post('http://localhost:5000/api/orders/checkout', orderData);

      if (response.status === 201) {
        // --- SIMPAN KE SESSION STORAGE UNTUK STRUK (OrderStatus) ---
        sessionStorage.setItem('lastOrder', JSON.stringify({
          ...orderData,
          _id: response.data.order?._id || "NEW_ORDER"
        }));

        alert("✅ Pesanan Berhasil!");
        
        if (!isSpecialMode) clearCart(); 
        
        // --- NAVIGASI KE HALAMAN STRUK SUKSES ---
        navigate('/status-pesanan'); 
      }
    } catch (error) {
      console.error("Error Checkout:", error);
      alert("Gagal memproses pesanan. Periksa koneksi server Anda.");
    }
  };

  return (
    <div className="bg-white min-vh-100 py-5 mt-5 text-start">
      <div className="container">
        <button onClick={() => navigate(-1)} className="btn btn-link text-decoration-none text-dark d-flex align-items-center gap-2 mb-4 p-0">
          <ChevronLeft size={18} /> Kembali
        </button>

        <div className="row g-4 text-dark">
          <div className="col-lg-7">
            <h5 className="fw-bold mb-4">Ringkasan Produk</h5>
            {itemsToDisplay.map((item) => (
              <div key={item.id || item._id} className="card border-0 shadow-sm rounded-4 p-3 mb-3">
                <div className="d-flex align-items-center text-dark">
                  <img src={item.img || item.image} alt={item.name} className="rounded-3 object-fit-cover" style={{ width: '80px', height: '80px' }} />
                  <div className="ms-3 flex-grow-1">
                    <h6 className="fw-bold mb-1">{item.name}</h6>
                    <p className="text-muted small mb-0">{item.color} | {item.size} | {item.qty}x</p>
                    <span className="fw-bold text-warning small">Rp.{item.price.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark">
                <MapPin size={18} className="text-primary" /> Alamat Pengiriman (Nasional)
              </h6>
              <div className={`p-3 rounded-3 mb-4 small ${userAddress.includes("belum") ? 'bg-danger bg-opacity-10 text-danger' : 'bg-light text-muted fw-bold'}`}>
                {userAddress}
              </div>

              <div className="d-flex justify-content-between mb-2 small text-muted">
                <span>Subtotal</span>
                <span>Rp.{subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 small text-muted">
                <span>Ongkir Nasional {ongkir === 0 && <span className="badge bg-success ms-1">Gratis</span>}</span>
                <span>Rp.{ongkir.toLocaleString('id-ID')}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="fw-bold text-dark">Total Pembayaran</span>
                <h5 className="fw-bold mb-0 text-warning">Rp.{totalAkhir.toLocaleString('id-ID')}</h5>
              </div>

              <div className="p-3 rounded-3 border d-flex align-items-center gap-3 mb-4 bg-light border-primary shadow-sm">
                <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center" style={{ width: '12px', height: '12px' }}>
                    <div className="rounded-circle bg-white" style={{ width: '4px', height: '4px' }}></div>
                </div>
                <span className="fw-bold small text-primary">COD (BAYAR DI TEMPAT)</span>
              </div>

              <button 
                onClick={handleOrder} 
                disabled={itemsToDisplay.length === 0 || userAddress.includes("belum")} 
                className="btn text-white w-100 py-3 fw-bold rounded-pill shadow-sm" 
                style={{ backgroundColor: '#E19E44', border: 'none' }}
              >
                Konfirmasi Pesanan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;