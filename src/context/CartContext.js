import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. STATE KERANJANG UMUM (Local Storage)
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('modis_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 2. STATE RIWAYAT PESANAN (Banyak Pesanan - Local Storage)
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('modis_orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  // 3. STATE PEMBELIAN INSTAN (Beli Sekarang / Barang Pilihan)
  const [buyNowItem, setBuyNowItem] = useState(null);

  // 4. STATE PESANAN TERAKHIR (Untuk Resi Instan)
  const [lastOrder, setLastOrder] = useState(null);

  // Efek untuk Sinkronisasi Local Storage Keranjang
  useEffect(() => {
    localStorage.setItem('modis_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Efek untuk Sinkronisasi Local Storage Riwayat Pesanan
  useEffect(() => {
    localStorage.setItem('modis_orders', JSON.stringify(orders));
  }, [orders]);

  // FUNGSI: Menambah ke Keranjang
  const addToCart = (product) => {
    setCartItems((prev) => {
      const isExist = prev.find((item) => item.id === product.id);
      if (isExist) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  // FUNGSI: Kurangi Jumlah di Keranjang
  const decreaseQty = (id) => {
    setCartItems((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          return { ...item, qty: item.qty > 1 ? item.qty - 1 : 1 };
        }
        return item;
      });
    });
  };

  // FUNGSI: Hapus satu item dari keranjang
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // FUNGSI: Bersihkan Keranjang
  const clearCart = () => setCartItems([]);

  // FUNGSI: Set barang untuk Beli Sekarang/Checkout Pilihan
  const setDirectOrder = (product) => {
    setBuyNowItem(product);
  };

  // FUNGSI: Hapus data Beli Sekarang
  const clearBuyNow = () => setBuyNowItem(null);

  // FUNGSI: Menambah Pesanan Baru ke Riwayat (Shopee Style)
  const addOrder = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        orders,          // Daftar semua pesanan
        buyNowItem,      // Barang beli sekarang
        lastOrder,       // Data pesanan yang baru saja sukses
        addToCart, 
        addOrder,        // Fungsi tambah riwayat pesanan
        setDirectOrder, 
        setLastOrder,    // Fungsi set resi sukses
        decreaseQty, 
        removeFromCart, 
        clearCart,
        clearBuyNow 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);