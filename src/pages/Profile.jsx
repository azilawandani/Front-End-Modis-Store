import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { Search, Navigation, MapPin } from 'lucide-react';

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

const Profile = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // --- STATE UNTUK API WILAYAH ---
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "/assets/profile-user.jpg",
    banner: "/assets/banner-profile.jpg",
    address: "", 
    province: "",
    city: "",
    district: "", 
    postalCode: "", 
    location: { lat: 0.5071, lng: 101.4478 },
    tinggiBadan: "",
    beratBadan: "",
    rekomendasiUkuran: "", 
    warnaFavorit: "",
    favBahan: "",
    gayaPakaian: "",
    motifDisukai: ""
  });

  const hitungRekomendasiUkuran = (tb, bb) => {
    const berat = parseInt(bb);
    if (!berat) return "";
    if (berat < 45) return "S";
    if (berat >= 45 && berat < 55) return "M";
    if (berat >= 55 && berat < 65) return "L";
    if (berat >= 65) return "XL";
    return "All Size";
  };

  useEffect(() => {
    // Load Data Provinsi dari API
    axios.get('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
      .then(res => setProvinces(res.data))
      .catch(err => console.error("Gagal memuat provinsi", err));

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const p = parsedUser.profiling || {}; 
      
      setUserData(prev => ({
        ...prev,
        ...parsedUser,
        name: parsedUser.nama || parsedUser.name || "",
        tinggiBadan: p.tinggiBadan || "",
        beratBadan: p.beratBadan || "",
        warnaFavorit: p.warnaFavorit || "",
        favBahan: p.favBahan || "",
        gayaPakaian: p.gayaPakaian || "",
        motifDisukai: p.motifDisukai || "",
        rekomendasiUkuran: p.rekomendasiUkuran || ""
      }));
    }
  }, []);

  // --- HANDLER API WILAYAH ---
  const handleProvinceChange = async (e) => {
    const id = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    
    setUserData(prev => ({ ...prev, province: name, city: "", district: "" }));
    setRegencies([]);
    setDistricts([]);

    if (id) {
      const res = await axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${id}.json`);
      setRegencies(res.data);
    }
  };

  const handleCityChange = async (e) => {
    const id = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    
    setUserData(prev => ({ ...prev, city: name, district: "" }));
    setDistricts([]);

    if (id) {
      const res = await axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${id}.json`);
      setDistricts(res.data);
    }
  };

  const handleDistrictChange = (e) => {
    const name = e.target.options[e.target.selectedIndex].text;
    setUserData(prev => ({ ...prev, district: name }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === "tinggiBadan" || name === "beratBadan") {
        newData.rekomendasiUkuran = hitungRekomendasiUkuran(newData.tinggiBadan, newData.beratBadan);
      }
      return newData;
    });
  };

  const handleSearchLocation = async () => {
    if (!searchQuery) return;
    try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`);
      if (res.data.length > 0) {
        const { lat, lon } = res.data[0];
        setUserData(prev => ({ ...prev, location: { lat: parseFloat(lat), lng: parseFloat(lon) } }));
      }
    } catch (err) {
      console.error("Gagal mencari lokasi");
    }
  };

  const handleSave = async () => {
    try {
      const rawData = localStorage.getItem('user');
      if (!rawData) return alert("Sesi habis, silakan login ulang");
      
      const storedUser = JSON.parse(rawData);
      const userId = storedUser.id || storedUser._id; 
      const token = localStorage.getItem('token');

      const response = await axios.put(`http://localhost:5000/api/auth/update/${userId}`, {
          ...userData,
          nama: userData.name,
          profiling: {
            tinggiBadan: userData.tinggiBadan,
            beratBadan: userData.beratBadan,
            rekomendasiUkuran: userData.rekomendasiUkuran,
            warnaFavorit: userData.warnaFavorit,
            favBahan: userData.favBahan,
            gayaPakaian: userData.gayaPakaian,
            motifDisukai: userData.motifDisukai
          }
      }, {
          headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        alert("Profil & Alamat Berhasil Disimpan!");
        const updatedLocalStorageUser = { ...storedUser, ...response.data.user };
        localStorage.setItem('user', JSON.stringify(updatedLocalStorageUser));
        setIsEditing(false);
      }
    } catch (error) {
      alert("Gagal menyimpan.");
    }
  };

  const ChangeMapView = ({ center }) => {
    const map = useMap();
    useEffect(() => { map.setView(center, 15); }, [center, map]);
    return null;
  };

  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        if (isEditing) setUserData(prev => ({ ...prev, location: e.latlng }));
      },
    });
    return <Marker position={userData.location} />;
  };

  const handleLogout = () => {
    if (window.confirm("Keluar dari aplikasi?")) {
      localStorage.clear();
      setIsLoggedIn(false);
      navigate('/login');
    }
  };

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return (
    <div className="bg-light min-vh-100 pb-5" style={{ paddingTop: '80px' }}>
      <div className="container py-5 text-dark">
        <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: '20px' }}>
          <div className="position-relative" style={{ height: '180px', backgroundColor: '#4A4A2A' }}>
            <img src={userData.banner} alt="Banner" className="w-100 h-100 object-fit-cover" />
            <button onClick={handleLogout} className="btn btn-danger position-absolute m-3 fw-bold shadow-sm" style={{ top: 0, right: 0, zIndex: '20' }}>Logout</button>
          </div>

          <div className="card-body p-4 p-md-5 pt-0">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-end mb-4 text-start">
              <div className="d-flex align-items-end gap-3" style={{ marginTop: '-50px', zIndex: '10' }}>
                <div className="rounded-circle border border-4 border-white shadow d-flex align-items-center justify-content-center text-white fw-bold h1" 
                     style={{ width: '120px', height: '120px', backgroundColor: '#E19E44' }}>
                  {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="mb-2">
                  <h4 className="fw-bold mb-0">{userData.name}</h4>
                  <p className="text-muted small mb-0">{userData.email}</p>
                </div>
              </div>
              <button onClick={() => setIsEditing(!isEditing)} className="btn px-4 py-2 mt-3 fw-bold shadow-sm" style={{ backgroundColor: isEditing ? '#6c757d' : '#4A4A2B', color: 'white' }}>
                {isEditing ? "Batal" : "Edit Profil"}
              </button>
            </div>

            <hr className="mb-5" />

            <div className="row g-4 text-start">
              {/* BAGIAN ALAMAT (DENGAN API WILAYAH) */}
              <div className="col-lg-6">
                <h6 className="fw-bold mb-3 text-uppercase text-primary d-flex align-items-center gap-2">
                  <MapPin size={18} /> Detail Alamat Pengiriman
                </h6>
                
                <div className="mb-3">
                  <label className="small fw-bold text-secondary">Nama Lengkap Penerima</label>
                  <input name="name" disabled={!isEditing} className="form-control bg-light border-0" value={userData.name} onChange={handleInputChange} />
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-md-6">
                    <label className="small fw-bold text-secondary">Provinsi</label>
                    <select disabled={!isEditing} className="form-select bg-light border-0" onChange={handleProvinceChange}>
                      <option value="">{userData.province || "Pilih Provinsi"}</option>
                      {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="small fw-bold text-secondary">Kota/Kabupaten</label>
                    <select disabled={!isEditing || regencies.length === 0} className="form-select bg-light border-0" onChange={handleCityChange}>
                      <option value="">{userData.city || "Pilih Kota"}</option>
                      {regencies.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-md-6">
                    <label className="small fw-bold text-secondary">Kecamatan</label>
                    <select disabled={!isEditing || districts.length === 0} className="form-select bg-light border-0" onChange={handleDistrictChange}>
                      <option value="">{userData.district || "Pilih Kecamatan"}</option>
                      {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="small fw-bold text-secondary">Kode Pos</label>
                    <input name="postalCode" type="number" disabled={!isEditing} className="form-control bg-light border-0" placeholder="Kode Pos" value={userData.postalCode} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="small fw-bold text-secondary">Nama Jalan / No. Rumah</label>
                  <textarea name="address" disabled={!isEditing} className="form-control bg-light border-0" rows="3" placeholder="Contoh: Jl. Sudirman No. 123, Blok A" value={userData.address} onChange={handleInputChange}></textarea>
                </div>
              </div>

              {/* BAGIAN PETA */}
              <div className="col-lg-6">
                <h6 className="fw-bold mb-3 text-uppercase text-primary d-flex align-items-center gap-2">
                  <Navigation size={18} /> Titik Koordinat GPS
                </h6>
                
                {isEditing && (
                  <div className="input-group mb-2 shadow-sm">
                    <input type="text" className="form-control border-0" placeholder="Cari alamat di peta..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    <button className="btn btn-primary" onClick={handleSearchLocation}><Search size={18}/></button>
                  </div>
                )}

                <div style={{ height: '300px', borderRadius: '15px' }} className="border shadow-sm overflow-hidden mb-2">
                  <MapContainer center={userData.location} zoom={15} style={{ height: '100%', width: '100%' }}>
                    <ChangeMapView center={userData.location} />
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationPicker />
                  </MapContainer>
                </div>
                <small className="text-muted">*Klik peta untuk menentukan titik kurir yang akurat.</small>
              </div>

              {/* USER PROFILING (TETAP SAMA) */}
              <div className="col-12">
                <div className="p-4 rounded-4 bg-light border border-2">
                  <h6 className="fw-bold mb-4 text-uppercase text-center text-primary">Data Profiling Rekomendasi</h6>
                  <div className="row g-3">
                    <div className="col-md-3">
                      <label className="small fw-bold">Tinggi Badan (cm)</label>
                      <input name="tinggiBadan" type="number" disabled={!isEditing} className="form-control" value={userData.tinggiBadan} onChange={handleInputChange} placeholder="165" />
                    </div>
                    <div className="col-md-3">
                      <label className="small fw-bold">Berat Badan (kg)</label>
                      <input name="beratBadan" type="number" disabled={!isEditing} className="form-control" value={userData.beratBadan} onChange={handleInputChange} placeholder="55" />
                    </div>
                    <div className="col-md-6 text-center">
                      <div className="p-2 rounded-3 bg-white border border-primary-subtle shadow-sm">
                        <p className="small mb-1 text-muted fw-bold">REKOMENDASI UKURAN KAMU:</p>
                        <h2 className="fw-bold text-primary mb-0">{userData.rekomendasiUkuran || "-"}</h2>
                      </div>
                    </div>
                    
                    <div className="col-md-3">
                      <label className="small fw-bold">Warna Favorit</label>
                      <select name="warnaFavorit" disabled={!isEditing} className="form-select" value={userData.warnaFavorit} onChange={handleInputChange}>
                        <option value="">Pilih Warna</option>
                        <option value="Black">Black</option>
                        <option value="White">White</option>
                        <option value="Choco">Choco</option>
                        <option value="Green">Green</option>
                        <option value="Red">Red</option>
                        <option value="Blue">Blue</option>
                        <option value="Cream">Cream</option>
                        <option value="Grey">Grey</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="small fw-bold">Bahan Favorit</label>
                      <select name="favBahan" disabled={!isEditing} className="form-select" value={userData.favBahan} onChange={handleInputChange}>
                        <option value="">Pilih Bahan</option>
                        <option value="Ceruty">Ceruty</option>
                        <option value="Silk">Silk</option>
                        <option value="Katun">Katun</option>
                        <option value="Jersey">Jersey</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="small fw-bold">Gaya Pakaian</label>
                      <select name="gayaPakaian" disabled={!isEditing} className="form-select" value={userData.gayaPakaian} onChange={handleInputChange}>
                        <option value="">Pilih Gaya</option>
                        <option value="Syar'i">Syar'i</option>
                        <option value="Casual">Casual</option>
                        <option value="Minimalis">Minimalis</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="small fw-bold">Motif Disukai</label>
                      <select name="motifDisukai" disabled={!isEditing} className="form-select" value={userData.motifDisukai} onChange={handleInputChange}>
                        <option value="">Pilih Motif</option>
                        <option value="Polos">Polos</option>
                        <option value="Pattern">Pattern</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-center mt-5 pt-3 border-top">
                {isEditing && (
                  <button onClick={handleSave} className="btn btn-warning text-white px-5 py-3 fw-bold shadow-lg rounded-pill">
                    Simpan Perubahan & Profiling
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