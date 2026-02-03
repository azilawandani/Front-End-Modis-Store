import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ChevronLeft, Minus, Plus } from 'lucide-react';
import axios from 'axios'; // Pastikan axios di-import

const CheckoutPage = () => {
  const { 
    cartItems, 
    buyNowItem, 
    addToCart, 
    decreaseQty, 
    clearCart, 
    setLastOrder,
    addOrder 
  } = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  const mode = new URLSearchParams(location.search).get('mode');
  const isSpecialMode = mode === 'direct' || mode === 'selected';
  
  const itemsToDisplay = isSpecialMode 
    ? (Array.isArray(buyNowItem) ? buyNowItem : (buyNowItem ? [buyNowItem] : []))
    : cartItems;

  const [userAddress, setUserAddress] = useState("Belum ada alamat di profil");

  useEffect(() => {
    // Mengambil profil dari localStorage untuk ditampilkan di halaman
    const savedProfile = JSON.parse(localStorage.getItem('userProfileData'));
    if (savedProfile && savedProfile.address) {
      setUserAddress(savedProfile.address);
    }
    window.scrollTo(0, 0);
  }, []);

  const subtotal = itemsToDisplay.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const ongkir = 20000;
  const totalAkhir = subtotal + ongkir;

  const handleOrder = async () => {
    try {
      // 1. Ambil data user dari localStorage untuk mendapatkan ID
      const storedUser = JSON.parse(localStorage.getItem('user'));
      
      if (!storedUser || !storedUser.id) {
        alert("Silakan login terlebih dahulu untuk melakukan pemesanan.");
        navigate('/login');
        return;
      }

      // 2. Siapkan data untuk riwayat lokal (Context)
      const newOrderData = {
        id: "MODIS-" + Math.floor(Math.random() * 1000000),
        items: itemsToDisplay,
        total: totalAkhir,
        tanggal: new Date().toLocaleString('id-ID'),
        status: 'Pending'
      };

      // 3. Siapkan data untuk dikirim ke MongoDB
      const orderData = {
        userId: storedUser.id,
        items: itemsToDisplay.map(item => ({
          productId: item.id,
          nama: item.name,
          harga: item.price,
          jumlah: item.qty
        })),
        totalHarga: totalAkhir,
        alamatPengiriman: {
          alamatLengkap: userAddress
        }
      };

      // 4. Kirim ke Backend menggunakan Axios
      const response = await axios.post('http://localhost:5000/api/orders/checkout', orderData);

      if (response.status === 201) {
        // Simpan ke riwayat lokal aplikasi
        addOrder(newOrderData); 
        setLastOrder(newOrderData); 

        alert("Pesanan COD Berhasil Disimpan ke Database!");
        
        if (!isSpecialMode) {
          clearCart(); 
        }
        
        // Diarahkan ke halaman konfirmasi/resi
        navigate('/pesanan');
      }
    } catch (error) {
      console.error("Error Checkout:", error);
      alert("Gagal memproses pesanan ke server. Pastikan backend menyala.");
    }
  };

  return (
    <div className="bg-white min-vh-100 py-5 mt-5 text-start">
      <div className="container">
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-link text-decoration-none text-dark d-flex align-items-center gap-2 mb-4 p-0"
        >
          <ChevronLeft size={18} /> Kembali
        </button>

        <div className="row g-4">
          <div className="col-lg-7">
            <h5 className="fw-bold mb-4">
              {mode === 'direct' ? "Produk Beli Sekarang" : 
               mode === 'selected' ? "Produk Pilihan Anda" : "Semua Produk Dipesan"}
            </h5>
            
            {itemsToDisplay.length > 0 ? (
              itemsToDisplay.map((item) => (
                <div key={item.id} className="card border-0 shadow-sm rounded-4 p-3 mb-3">
                  <div className="d-flex align-items-center">
                    <img 
                      src={item.img || item.image} 
                      alt={item.name} 
                      className="rounded-3 object-fit-cover" 
                      style={{ width: '100px', height: '100px' }} 
                    />
                    <div className="ms-4 flex-grow-1">
                      <h5 className="fw-bold mb-1">{item.name}</h5>
                      <h6 className="fw-bold text-warning mb-2">
                        Rp.{item.price.toLocaleString('id-ID')}
                      </h6>
                      <p className="text-muted small mb-2">
                        {item.color} / {item.size}
                      </p>
                      
                      {!isSpecialMode ? (
                        <div className="d-flex align-items-center border rounded-2 bg-light" style={{ width: 'fit-content' }}>
                          <button className="btn btn-sm px-2 border-0" onClick={() => decreaseQty(item.id)}><Minus size={14}/></button>
                          <span className="px-3 small fw-bold">{item.qty}</span>
                          <button className="btn btn-sm px-2 border-0" onClick={() => addToCart(item)}><Plus size={14}/></button>
                        </div>
                      ) : (
                        <span className="badge bg-secondary p-2">Qty: {item.qty}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-5 text-muted">Keranjang Anda masih kosong.</p>
            )}
          </div>

          <div className="col-lg-5">
            <div className="rounded-top-4 p-3 text-white d-flex align-items-center gap-2" style={{ backgroundColor: '#4A4631' }}>
              <span className="small fw-bold">🏠 Alamat Saya</span>
            </div>
            <div className="p-3 bg-light border-start border-end border-bottom mb-4 small text-muted shadow-sm">
              {userAddress}
            </div>

            <div className="card border-0 shadow-sm rounded-4 p-4">
              {/* Ringkasan Biaya */}
              <div className="d-flex justify-content-between mb-3 text-muted">
                <span>Subtotal</span>
                <span>Rp.{subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="d-flex justify-content-between mb-4 text-muted">
                <span>Ongkir (JNE)</span>
                <span>Rp.{ongkir.toLocaleString('id-ID')}</span>
              </div>
              <hr className="my-3 opacity-10" />
              <div className="d-flex justify-content-between align-items-center mb-5">
                <h5 className="fw-bold mb-0">Total Tagihan</h5>
                <h5 className="fw-bold mb-0 text-warning">Rp.{totalAkhir.toLocaleString('id-ID')}</h5>
              </div>

              <div className="p-3 rounded-3 border d-flex align-items-center gap-3 mb-4 bg-light bg-opacity-50 border-primary shadow-sm">
                <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center" style={{ width: '18px', height: '18px' }}>
                   <div className="rounded-circle bg-white" style={{ width: '6px', height: '6px' }}></div>
                </div>
                <span className="fw-bold small text-primary text-uppercase">COD ( Cash On Delivery )</span>
              </div>

              <button 
                onClick={handleOrder}
                disabled={itemsToDisplay.length === 0}
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