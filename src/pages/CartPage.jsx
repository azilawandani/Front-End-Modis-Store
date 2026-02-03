import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, ChevronLeft } from 'lucide-react';

const CartPage = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, addToCart, decreaseQty, setDirectOrder } = useCart();

  // STATE: Menyimpan ID barang yang dipilih (ceklis)
  const [selectedIds, setSelectedIds] = useState([]);

  // Fungsi untuk menambah/menghapus ID dari daftar pilihan
  const handleCheckItem = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Fungsi Pilih Semua (Select All)
  const handleSelectAll = () => {
    if (selectedIds.length === cartItems.length) {
      setSelectedIds([]); // Jika sudah semua, maka kosongkan
    } else {
      setSelectedIds(cartItems.map(item => item.id)); // Pilih semua ID
    }
  };

  // Hitung Total Harga hanya untuk barang yang diceklis
  const totalHargaSelected = cartItems
    .filter((item) => selectedIds.includes(item.id))
    .reduce((acc, item) => acc + item.price * item.qty, 0);

  const handlePesanSekarang = () => {
    if (selectedIds.length === 0) {
      alert("Silahkan pilih minimal satu barang untuk dipesan.");
      return;
    }

    // Ambil data lengkap barang yang diceklis
    const itemsToOrder = cartItems.filter((item) => selectedIds.includes(item.id));
    
    // Simpan ke state khusus order dan arahkan ke checkout
    setDirectOrder(itemsToOrder); 
    navigate('/checkout?mode=selected');
  };

  if (!isLoggedIn || cartItems.length === 0) {
    return (
      <div className="min-vh-100 bg-light d-flex flex-column align-items-center justify-content-center py-5">
        <h2 className="fw-bold mb-4">Keranjang Saya</h2>
        <div className="bg-white p-5 rounded-3 shadow-sm text-center" style={{ maxWidth: '600px', width: '90%' }}>
          <img src="/assets/empty-cart.png" alt="Kosong" className="img-fluid mb-4" style={{ maxHeight: '200px' }} />
          <h3 className="fw-bold">Keranjang Kosong</h3>
          <p className="text-muted mb-4">{!isLoggedIn ? "Silahkan login untuk melihat keranjang" : "Tambah produk untuk melanjutkan belanja"}</p>
          <div className="d-flex gap-3 justify-content-center">
            <Link to="/produk" className="btn btn-warning text-white px-4 py-2 fw-bold" style={{ backgroundColor: '#E19E44', border: 'none' }}>Lanjut Belanja</Link>
            {!isLoggedIn && <Link to="/login" className="btn btn-dark px-4 py-2 fw-bold" style={{ backgroundColor: '#4A4631' }}>Login</Link>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-white py-5 mt-5">
      <div className="container">
        <h2 className="text-center fw-bold mb-5">Keranjang Saya</h2>
        
        {/* Tombol Pilih Semua */}
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
          <div className="form-check d-flex align-items-center gap-2">
            <input 
              className="form-check-input" 
              type="checkbox" 
              checked={selectedIds.length === cartItems.length && cartItems.length > 0}
              onChange={handleSelectAll}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <label className="fw-bold small cursor-pointer" onClick={handleSelectAll}>Pilih Semua ({cartItems.length})</label>
          </div>
          {selectedIds.length > 0 && (
            <span className="text-muted small">{selectedIds.length} Barang terpilih</span>
          )}
        </div>

        <div className="row g-4">
          {cartItems.map((item) => (
            <div key={item.id} className="col-md-6">
              <div className={`d-flex align-items-center p-3 border rounded-4 position-relative transition-all ${selectedIds.includes(item.id) ? 'border-warning shadow-sm' : 'border-light'}`}>
                {/* CHECKBOX */}
                <div className="form-check me-3">
                  <input 
                    className="form-check-input rounded-circle shadow-none" 
                    type="checkbox" 
                    checked={selectedIds.includes(item.id)}
                    onChange={() => handleCheckItem(item.id)}
                    style={{ width: '22px', height: '22px', cursor: 'pointer' }}
                  />
                </div>
                
                <img src={item.img || item.image} alt={item.name} className="rounded-3" style={{ width: '90px', height: '100px', objectFit: 'cover' }} />
                
                <div className="ms-3 flex-grow-1">
                  <h6 className="fw-bold mb-1">{item.name}</h6>
                  <p className="text-warning fw-bold mb-1 small">Rp {item.price.toLocaleString('id-ID')}</p>
                  <p className="text-muted mb-2" style={{ fontSize: '12px' }}>{item.color} / {item.size}</p>
                  
                  <div className="d-flex align-items-center border rounded-2 bg-light" style={{ width: 'fit-content' }}>
                    <button className="btn btn-sm px-2 border-0" onClick={() => decreaseQty(item.id)}>-</button>
                    <span className="px-2 small fw-bold">{item.qty}</span>
                    <button className="btn btn-sm px-2 border-0" onClick={() => addToCart(item)}>+</button>
                  </div>
                </div>

                <button onClick={() => removeFromCart(item.id)} className="btn btn-link text-danger p-1 position-absolute top-0 end-0 mt-2 me-2">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Bottom Summary */}
        <div className="text-center mt-5 pt-4 border-top">
          <p className="text-muted mb-1">Total Pembayaran ({selectedIds.length} barang):</p>
          <h3 className="fw-bold mb-4" style={{ color: '#E19E44' }}>Rp {totalHargaSelected.toLocaleString('id-ID')}</h3>
          <button 
            onClick={handlePesanSekarang}
            className="btn btn-dark px-5 py-3 fw-bold rounded-3 shadow"
            style={{ backgroundColor: '#4A4631', border: 'none', minWidth: '300px' }}
          >
            Pesan Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;