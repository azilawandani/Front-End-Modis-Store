import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const Recommendation = () => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const profileData = JSON.parse(localStorage.getItem('userProfileData'));
        
        if (storedUser && (storedUser.profiling || profileData)) {
          const activeProfile = profileData || storedUser;
          const userP = activeProfile.profiling || activeProfile;
          setUserProfile(activeProfile);

          // 1. LOGIKA REKOMENDASI UKURAN OTOMATIS (Berdasarkan TB/BB)
          const hitungUkuranIdeal = (tinggi, berat) => {
            const tb = parseInt(tinggi);
            const bb = parseInt(berat);
            if (!tb || !bb) return null;

          if (berat < 45) return "S";
    if (berat >= 45 && berat < 55) return "M";
    if (berat >= 55 && berat < 65) return "L";
    if (berat >= 65) return "XL";
    return "All Size";
  };

          const ukuranIdealUser = hitungUkuranIdeal(userP.tinggiBadan, userP.beratBadan);

          const res = await axios.get('http://localhost:5000/api/products');
          const allProducts = res.data;

          // 2. LOGIKA ALGORITMA CBF YANG DIPERBARUI
          const scoredProducts = allProducts.map(product => {
            let score = 0;
            
            // A. Cocokkan Bahan (Bobot: 0.30)
            if (product.features[0]?.toLowerCase() === userP.favBahan?.toLowerCase()) {
              score += 0.30;
            }
            
            // B. Cocokkan Gaya (Bobot: 0.25)
            if (product.features[1]?.toLowerCase() === userP.gayaPakaian?.toLowerCase()) {
              score += 0.25;
            }
            
            // C. Cocokkan Motif (Bobot: 0.15)
            if (product.features[2]?.toLowerCase() === userP.motifDisukai?.toLowerCase()) {
              score += 0.15;
            }

            // D. Cocokkan Warna Favorit (Bobot: 0.20) - AKURASI TINGGI
            const isColorMatch = product.colors?.some(c => 
              c.name?.toLowerCase() === userP.warnaFavorit?.toLowerCase()
            );
            if (isColorMatch) {
              score += 0.20;
            }

            // E. Validasi Ukuran (Bobot: 0.10)
            const isSizeAvailable = product.sizes?.some(s => 
              s.toUpperCase() === ukuranIdealUser || s.toLowerCase() === "all size"
            );
            
            if (isSizeAvailable) {
              score += 0.10;
            } else if (ukuranIdealUser) {
              // Penalty logic jika ukuran tidak tersedia
              score -= 0.15; 
            }

            return { 
              ...product, 
              similarityScore: Math.max(0, score),
              userSizeMatch: isSizeAvailable,
              suggestedSize: ukuranIdealUser // Menyimpan saran ukuran untuk dikirim ke detail
            };
          });

          // Urutkan & ambil 4 teratas
          const results = scoredProducts
            .filter(p => p.similarityScore > 0)
            .sort((a, b) => b.similarityScore - a.similarityScore);
            
          setRecommendedProducts(results.slice(0, 4));
        }
      } catch (err) {
        console.error("Gagal memproses rekomendasi:", err);
      }
    };

    fetchData();
  }, []);

  if (!userProfile || recommendedProducts.length === 0) return null;

  return (
    <section className="py-5" style={{ backgroundColor: '#fdfbf7' }}>
      <div className="container text-start">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <Sparkles size={20} style={{ color: '#E19E44' }} />
              <span className="text-uppercase fw-bold small" style={{ color: '#E19E44', letterSpacing: '1px' }}>
                AI Personalized Selection
              </span>
            </div>
            <h2 className="fw-bold font-serif text-dark">Rekomendasi Spesial Untukmu</h2>
            <p className="text-muted">
              Berdasarkan bahan <b>{userProfile.favBahan || userProfile.profiling?.favBahan}</b> dan warna <b>{userProfile.warnaFavorit || userProfile.profiling?.warnaFavorit}</b> favoritmu.
            </p>
          </div>
        </div>

        <div className="row g-4">
          {recommendedProducts.map((product) => (
            <div className="col-6 col-md-3" key={product._id}>
              <div className="card border-0 shadow-sm h-100 position-relative overflow-hidden">
                {/* Match Score Badge */}
                <div className="position-absolute top-0 end-0 m-2 z-3">
                  <span className="badge bg-dark text-white shadow-sm" style={{ fontSize: '10px' }}>
                    {(product.similarityScore * 100).toFixed(0)}% Match
                  </span>
                </div>
                
                {/* Link Gambar dengan State Ukuran */}
                <Link to={`/produk/${product.slug}`} state={{ recommendedSize: product.suggestedSize }}>
                  <div className="overflow-hidden" style={{ height: '280px' }}>
                    <img 
                      src={product.img} 
                      alt={product.name} 
                      className="w-100 h-100 object-fit-cover transition-transform scale-hover" 
                    />
                  </div>
                </Link>

                <div className="card-body p-3">
                  <h6 className="fw-bold mb-1 text-truncate">{product.name}</h6>
                  <p className="text-muted small mb-2">{product.category}</p>
                  
                  {/* Info Ukuran Pas */}
                  {product.userSizeMatch && (
                    <div className="mb-2">
                      <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill" style={{fontSize: '10px'}}>
                        Tersedia dalam ukuranmu ({product.suggestedSize})
                      </span>
                    </div>
                  )}

                  <p className="fw-bold text-dark mb-3">Rp {product.price.toLocaleString('id-ID')}</p>
                  
                  {/* Tombol Lihat Koleksi dengan State Ukuran agar Halaman Detail bisa Auto-Select */}
                  <Link 
                    to={`/produk/${product.slug}`} 
                    state={{ recommendedSize: product.suggestedSize }}
                    className="btn btn-sm w-100 text-white" 
                    style={{ backgroundColor: '#4A4A2A' }}
                  >
                    Lihat Koleksi
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Recommendation;