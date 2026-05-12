import React, { useEffect, useState, useMemo } from 'react';
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
  
  const [userAddress, setUserAddress] = useState("");
  const [ongkir, setOngkir] = useState(0);

  // --- PERBAIKAN AGRESIF: Pastikan produk muncul meskipun refresh ---
  const itemsToDisplay = useMemo(() => {
    if (isSpecialMode) {
      // 1. Cek Context
      if (buyNowItem) return Array.isArray(buyNowItem) ? buyNowItem : [buyNowItem];
      
      // 2. Cek Local Storage (Data cadangan yang disimpan handleBuyNow tadi)
      const saved = JSON.parse(localStorage.getItem('temp_buy_now'));
      if (saved) return Array.isArray(saved) ? saved : [saved];
      
      return [];
    }
    return cartItems || [];
  }, [cartItems, buyNowItem, isSpecialMode]);

  const subtotal = useMemo(() => {
    return itemsToDisplay.reduce((acc, item) => {
      const harga = Number(item.price || 0);
      const jumlah = Number(item.qty || item.quantity || 1);
      return acc + (harga * jumlah);
    }, 0);
  }, [itemsToDisplay]);

  useEffect(() => {
    const activeUser = JSON.parse(localStorage.getItem('user'));
    const address = activeUser?.address || "Alamat belum diatur";
    const province = (activeUser?.province || "").toLowerCase();
    setUserAddress(address);

    if (subtotal === 0) return;

    if (subtotal > 1000000 || address.toLowerCase().includes("pekanbaru")) {
      setOngkir(0);
    } else if (province.includes("riau")) {
      setOngkir(15000);
    } else if (province.includes("jakarta") || province.includes("jawa") || province.includes("sumatera")) {
      setOngkir(25000);
    } else {
      setOngkir(35000);
    }
    window.scrollTo(0, 0);
  }, [subtotal]);

  const totalAkhir = subtotal + ongkir;

  const handleOrder = async () => {
    try {
      const activeUser = JSON.parse(localStorage.getItem('user'));
      if (!activeUser) return navigate('/login');
      if (userAddress.includes("belum diatur")) return alert("Isi alamat lengkap di profil!");
      if (itemsToDisplay.length === 0) return alert("Produk tidak ditemukan.");

      const generatedResi = `MODIS-NAT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const orderData = {
        userId: activeUser.id || activeUser._id,
        namaPelanggan: activeUser.nama || activeUser.name, 
        items: itemsToDisplay.map(item => ({
          productId: item.id || item._id, 
          nama: item.name,
          harga: Number(item.price),
          quantity: Number(item.qty || 1),
          varian: `${item.color || 'Default'} / ${item.size || 'All Size'}`,
          image: item.img || item.image
        })),
        totalHarga: totalAkhir,
        ongkir: ongkir,
        noResi: generatedResi,
        status: "Pending",
        alamatPengiriman: { alamatLengkap: userAddress }
      };

      const response = await axios.post('http://localhost:5000/api/orders/checkout', orderData);

      if (response.status === 201) {
        sessionStorage.setItem('lastOrder', JSON.stringify({ ...orderData, _id: response.data.order?._id }));
        alert("✅ Pesanan Berhasil!");
        if (!isSpecialMode) clearCart(); 
        localStorage.removeItem('temp_buy_now'); // Bersihkan cadangan setelah beli
        navigate('/status-pesanan'); 
      }
    } catch (error) {
      alert("Gagal memproses pesanan.");
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
            <h5 className="fw-bold mb-4">Ringkasan Produk ({itemsToDisplay.length})</h5>
            {itemsToDisplay.length === 0 ? (
              <div className="p-5 bg-light rounded-4 text-center"><p className="text-muted">Produk belum dipilih.</p></div>
            ) : (
              itemsToDisplay.map((item, idx) => (
                <div key={idx} className="card border-0 shadow-sm rounded-4 p-3 mb-3">
                  <div className="d-flex align-items-center">
                    <img src={item.img || item.image} alt={item.name} className="rounded-3 object-fit-cover" style={{ width: '80px', height: '80px' }} />
                    <div className="ms-3 flex-grow-1">
                      <h6 className="fw-bold mb-1">{item.name}</h6>
                      <p className="text-muted small mb-0">{item.color} | {item.size} | {item.qty || 1}x</p>
                      <span className="fw-bold text-warning small">Rp.{Number(item.price || 0).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><MapPin size={18} className="text-primary" /> Alamat Pengiriman</h6>
              <div className="p-3 rounded-3 mb-4 small bg-light text-muted fw-bold">{userAddress}</div>
              <div className="d-flex justify-content-between mb-2 small text-muted"><span>Subtotal</span><span>Rp.{subtotal.toLocaleString('id-ID')}</span></div>
              <div className="d-flex justify-content-between mb-2 small text-muted"><span>Ongkir</span><span>Rp.{ongkir.toLocaleString('id-ID')}</span></div>
              <hr />
              <div className="d-flex justify-content-between align-items-center mb-4"><span className="fw-bold">Total Pembayaran</span><h5 className="fw-bold mb-0 text-warning">Rp.{totalAkhir.toLocaleString('id-ID')}</h5></div>
              <button onClick={handleOrder} disabled={itemsToDisplay.length === 0} className="btn text-white w-100 py-3 fw-bold rounded-pill shadow-sm" style={{ backgroundColor: '#E19E44', border: 'none' }}>Konfirmasi Pesanan</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;