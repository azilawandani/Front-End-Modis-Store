import React, { useState, useEffect } from 'react'; // Tambahkan useEffect
import { useNavigate, Navigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Ikon Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const wilayahSumatera = {
  "Aceh": ["Banda Aceh", "Lhokseumawe", "Langsa", "Meulaboh", "Sabang"],
  "Sumatera Utara": ["Medan", "Binjai", "Pematangsiantar", "Tanjungbalai", "Sibolga"],
  "Sumatera Barat": ["Padang", "Bukittinggi", "Payakumbuh", "Pariaman", "Solok"],
  "Riau": ["Pekanbaru", "Dumai", "Duri", "Tembilahan"],
  "Kepulauan Riau": ["Tanjungpinang", "Batam", "Bintan"],
  "Jambi": ["Jambi", "Sungai Penuh", "Muara Bungo"],
  "Bengkulu": ["Bengkulu", "Curup", "Manna"],
  "Sumatera Selatan": ["Palembang", "Prabumulih", "Lubuklinggau", "Pagar Alam"],
  "Kepulauan Bangka Belitung": ["Pangkal Pinang", "Tanjung Pandan", "Sungailiat"],
  "Lampung": ["Bandar Lampung", "Metro", "Bandar Jaya"]
};

const Profile = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  // --- LOGIKA MENGAMBIL DATA DARI DATABASE (LOCALSTORAGE) ---
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "/assets/profile-user.jpg",
    banner: "/assets/banner-profile.jpg",
    address: "",
    province: "",
    city: "",
    location: { lat: 0.5071, lng: 101.4478 }
  });

  useEffect(() => {
    // Ambil data user yang disimpan saat Login di folder modis-backend
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData(prev => ({
        ...prev,
        name: parsedUser.nama, // 'nama' sesuai field di MongoDB
        email: parsedUser.email,
      }));
    }
    
    // Ambil data alamat tambahan jika ada di local storage
    const savedProfile = localStorage.getItem('userProfileData');
    if (savedProfile) {
      setUserData(JSON.parse(savedProfile));
    }
  }, []);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    const confirmLogout = window.confirm("Apakah Anda yakin ingin keluar?");
    if (confirmLogout) {
      // Bersihkan semua data login
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      navigate('/login');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "province") {
      setUserData({ ...userData, province: value, city: "" });
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        if (isEditing) setUserData({ ...userData, location: e.latlng });
      },
    });
    return <Marker position={userData.location} />;
  };

const handleSave = async () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    
    // PASTIKAN BARIS INI TULISANNYA PERSIS SEPERTI INI:
    const response = await axios.put(`http://localhost:5000/api/auth/update/${storedUser.id}`, {
      nama: userData.name,
      phone: userData.phone,
      province: userData.province,
      city: userData.city,
      address: userData.address,
      location: userData.location
    });

    if (response.status === 200) {
      alert("Profil dan Titik Lokasi Berhasil Disimpan!");
      setIsEditing(false);
      
      // Update local storage agar sinkron
      const updatedLocal = { ...storedUser, nama: userData.name };
      localStorage.setItem('user', JSON.stringify(updatedLocal));
    }
  } catch (error) {
    console.error("Detail Error:", error.response);
    alert("Gagal menyimpan ke server. Pastikan backend menyala di port 5000.");
  }
};

  return (
    <div className="bg-light min-vh-100 pb-5" style={{ paddingTop: '80px' }}>
      <div className="container py-5">
        <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: '20px' }}>
          
          {/* BANNER */}
          <div className="position-relative" style={{ height: '180px', backgroundColor: '#4A4A2A' }}>
            <img 
              src={userData.banner} 
              alt="Banner" 
              className="w-100 h-100 object-fit-cover" 
              onError={(e) => { e.target.style.display='none'; }} 
            />
            <button 
              onClick={handleLogout}
              className="btn btn-danger position-absolute m-3 fw-bold shadow-sm"
              style={{ top: 0, right: 0, borderRadius: '8px', zIndex: '20' }}
            >
              Logout
            </button>
          </div>

          <div className="card-body p-4 p-md-5 pt-0">
            {/* AVATAR & HEADER */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-end mb-4">
              <div className="d-flex align-items-end gap-3" style={{ marginTop: '-50px', zIndex: '10' }}>
                <div className="rounded-circle border border-4 border-white shadow bg-warning d-flex align-items-center justify-content-center text-white fw-bold h1" 
                     style={{ width: '120px', height: '120px', backgroundColor: '#E19E44' }}>
                  {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="mb-2">
                  <h4 className="fw-bold mb-0">{userData.name}</h4>
                  <p className="text-muted small mb-0">{userData.email}</p>
                </div>
              </div>
              
              <button 
                onClick={() => setIsEditing(!isEditing)} 
                className="btn px-4 py-2 mt-3 fw-bold shadow-sm" 
                style={{ backgroundColor: isEditing ? '#6c757d' : '#4A4A2B', color: 'white', borderRadius: '8px', border: 'none' }}
              >
                {isEditing ? "Batal" : "Edit Profil"}
              </button>
            </div>

            <hr className="mb-5" />

            {/* FORM INPUT TETAP SAMA SEPERTI SEBELUMNYA */}
            <div className="row g-4">
              <div className="col-lg-5">
                <h6 className="fw-bold mb-3 text-uppercase" style={{ color: '#4A4A2B' }}>Informasi Pribadi</h6>
                <div className="mb-3">
                  <label className="small fw-bold text-secondary">Nama Lengkap</label>
                  <input name="name" type="text" disabled={!isEditing} className="form-control bg-light border-0 py-2" value={userData.name} onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                  <label className="small fw-bold text-secondary">Alamat Email</label>
                  <input name="email" type="email" disabled={true} className="form-control bg-light border-0 py-2" value={userData.email} />
                </div>
                <div className="mb-3">
                  <label className="small fw-bold text-secondary">Nomor Telepon</label>
                  <input name="phone" type="text" disabled={!isEditing} className="form-control bg-light border-0 py-2" value={userData.phone} onChange={handleInputChange} />
                </div>

                <h6 className="fw-bold mb-3 mt-5 text-uppercase" style={{ color: '#4A4A2B' }}>Alamat Pengiriman</h6>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="small fw-bold text-secondary">Provinsi</label>
                    <select name="province" disabled={!isEditing} className="form-select bg-light border-0 py-2" value={userData.province} onChange={handleInputChange}>
                      <option value="">Pilih Provinsi</option>
                      {Object.keys(wilayahSumatera).map((prov) => (
                        <option key={prov} value={prov}>{prov}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="small fw-bold text-secondary">Kota</label>
                    <select name="city" disabled={!isEditing || !userData.province} className="form-select bg-light border-0 py-2" value={userData.city} onChange={handleInputChange}>
                      <option value="">Pilih Kota</option>
                      {userData.province && wilayahSumatera[userData.province].map((kota) => (
                        <option key={kota} value={kota}>{kota}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="small fw-bold text-secondary">Alamat Lengkap</label>
                  <textarea name="address" disabled={!isEditing} className="form-control bg-light border-0" rows="3" value={userData.address} onChange={handleInputChange}></textarea>
                </div>
              </div>

              <div className="col-lg-7">
                <h6 className="fw-bold mb-3 text-uppercase" style={{ color: '#4A4A2B' }}>Titik Lokasi (Pinpoint)</h6>
                <div style={{ height: '380px', borderRadius: '15px', overflow: 'hidden' }} className="border shadow-sm">
                  <MapContainer center={userData.location} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationPicker />
                  </MapContainer>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end mt-5 pt-3 border-top">
                {isEditing && (
                  <button onClick={handleSave} className="btn btn-warning text-white px-5 py-2 fw-bold shadow" style={{ borderRadius: '10px' }}>
                    Simpan Perubahan
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;