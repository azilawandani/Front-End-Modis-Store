import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Trash2, Edit, Search, X } from 'lucide-react';

const StokProduk = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State untuk Edit Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error("Gagal mengambil data stok");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Hapus produk ini dari stok?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        fetchProducts(); 
      } catch (err) {
        alert("Gagal menghapus produk");
      }
    }
  };

  // Fungsi saat tombol Edit diklik
  const handleEditClick = (product) => {
    setSelectedProduct({ ...product });
    setShowEditModal(true);
  };

  // Fungsi menyimpan perubahan
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/products/update/${selectedProduct._id}`, selectedProduct);
      alert("✅ Produk berhasil diperbarui!");
      setShowEditModal(false);
      fetchProducts();
    } catch (err) {
      alert("Gagal memperbarui produk");
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 text-start">
        <div>
          <h2 className="fw-bold">Stok Produk</h2>
          <p className="text-muted">Total: {products.length} Item Tersedia</p>
        </div>
        <div className="d-flex gap-2">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><Search size={18}/></span>
            <input 
              type="text" 
              className="form-control border-start-0 shadow-none" 
              placeholder="Cari nama produk..." 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 text-start">
            <thead className="bg-light">
              <tr>
                <th className="ps-4">Produk</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Detail Atribut</th>
                <th className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((item) => (
                <tr key={item._id}>
                  <td className="ps-4">
                    <div className="d-flex align-items-center gap-3">
                      <img src={item.img} className="rounded" width="50" height="50" style={{objectFit: 'cover'}} alt="img" />
                      <span className="fw-bold text-dark">{item.name}</span>
                    </div>
                  </td>
                  <td><span className="badge bg-light text-dark border">{item.category}</span></td>
                  <td className="fw-semibold">Rp {item.price?.toLocaleString()}</td>
                  <td>
                    <small className="text-muted d-block">Gaya: {item.features?.[0]}</small>
                    <small className="text-muted d-block">Warna: {item.colors?.[0]?.name}</small>
                  </td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <button onClick={() => handleEditClick(item)} className="btn btn-sm btn-outline-primary border-0"><Edit size={18}/></button>
                      <button onClick={() => handleDelete(item._id)} className="btn btn-sm btn-outline-danger border-0"><Trash2 size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && <p className="text-center py-5 text-muted">Data produk tidak ditemukan.</p>}
        </div>
      </div>

      {/* MODAL EDIT PRODUK */}
      {showEditModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="fw-bold">Edit Katalog Produk</h5>
                <button type="button" className="btn-close shadow-none" onClick={() => setShowEditModal(false)}></button>
              </div>
              <form onSubmit={handleUpdate}>
                <div className="modal-body text-start">
                  <div className="mb-3">
                    <label className="small fw-bold">Nama Produk</label>
                    <input type="text" className="form-control" value={selectedProduct.name} onChange={(e) => setSelectedProduct({...selectedProduct, name: e.target.value})} />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="small fw-bold">Kategori</label>
                      <input type="text" className="form-control" value={selectedProduct.category} onChange={(e) => setSelectedProduct({...selectedProduct, category: e.target.value})} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="small fw-bold">Harga (Rp)</label>
                      <input type="number" className="form-control" value={selectedProduct.price} onChange={(e) => setSelectedProduct({...selectedProduct, price: Number(e.target.value)})} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="small fw-bold">Link Gambar</label>
                    <input type="text" className="form-control" value={selectedProduct.img} onChange={(e) => setSelectedProduct({...selectedProduct, img: e.target.value})} />
                  </div>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button type="button" className="btn btn-light px-4 fw-bold" onClick={() => setShowEditModal(false)}>Batal</button>
                  <button type="submit" className="btn btn-primary px-4 fw-bold">Simpan Perubahan</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StokProduk;