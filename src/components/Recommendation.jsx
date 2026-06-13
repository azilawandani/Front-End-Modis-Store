import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Sparkles, Ruler, AlertCircle } from 'lucide-react';

const Recommendation = () => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const profileData = JSON.parse(localStorage.getItem('userProfileData'));
        
        if (storedUser && (storedUser.profiling || profileData)) {
          const activeProfile = profileData || storedUser;
          const userP = activeProfile.profiling || activeProfile;
          setUserProfile(activeProfile);

          const res = await axios.get('https://back-end-modis-store.vercel.app/api/products');
          const allProducts = res.data;

          const userFavCategory = userP.kategoriFavorit?.trim().toLowerCase();
          const userLD = Number(userP.estimasiLD) || 0;

          // 1. PROSES FILTER & SKORING
          const scoredProducts = allProducts
            .filter(product => {
              // Pastikan stok tersedia (menggunakan field 'stock' sesuai data MongoDB kamu)
              const hasStock = Number(product.stock) > 0;
              if (!hasStock) return false;

              // Filter kategori sebagai filter utama
              if (userFavCategory && userFavCategory !== "" && userFavCategory !== "semua") {
                return product.category?.trim().toLowerCase() === userFavCategory;
              }
              return true;
            })
            .map(product => {
              let score = 0;
              const prodFeatures = product.features || [];
              const productSizes = product.sizes || [];
              
              // A. LOGIKA CONTENT-BASED FILTERING (0.70)
              // Cek Bahan
              if (prodFeatures.some(f => f?.toLowerCase().includes(userP.favBahan?.toLowerCase()))) score += 0.30;
              // Cek Gaya
              if (prodFeatures.some(f => f?.toLowerCase().includes(userP.gayaPakaian?.toLowerCase()))) score += 0.25;
              // Cek Motif
              if (prodFeatures.some(f => f?.toLowerCase().includes(userP.motifDisukai?.toLowerCase()))) score += 0.20;
              // Cek Warna
              const isColorMatch = product.colors?.some(c => 
                c.name?.trim().toLowerCase() === userP.warnaFavorit?.trim().toLowerCase()
              );
              if (isColorMatch) score += 0.15;

              // B. LOGIKA UKURAN CERDAS (0.30)
              let suggestedSize = "All Size";
              let sizeDetail = null;
              let isFit = true;
              
              if (productSizes.length > 0) {
                const fitSizes = productSizes.filter(s => Number(s.ld) >= userLD);
                if (fitSizes.length > 0) {
                  const matchingSize = fitSizes.sort((a, b) => Number(a.ld) - Number(b.ld))[0];
                  suggestedSize = matchingSize.label;
                  sizeDetail = matchingSize;
                  score += 0.30;
                } else {
                  isFit = false;
                  suggestedSize = productSizes[productSizes.length - 1].label;
                  score -= 0.50;
                }
              }

              return { 
                ...product, 
                similarityScore: Math.max(0, score),
                suggestedSize: suggestedSize,
                sizeChart: sizeDetail,
                isFit: isFit
              };
            });

          // 2. FILTER HASIL BERDASARKAN SKOR MINIMAL
          let results = scoredProducts
            .filter(p => p.similarityScore >= 0.1) // Minimal kecocokan 10%
            .sort((a, b) => b.similarityScore - a.similarityScore);
            
          // 3. MEKANISME FALLBACK JIKA REKOMENDASI KOSONG
          if (results.length === 0) {
            setIsFallback(true);
            // Ambil 4 produk terbaru yang stoknya masih ada
            results = allProducts
              .filter(p => Number(p.stock) > 0)
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map(p => ({
                ...p,
                similarityScore: 0,
                isFit: true,
                suggestedSize: "Lihat Detail"
              }));
          } else {
            setIsFallback(false);
          }

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
              <Sparkles size={20} style={{ color: isFallback ? '#6c757d' : '#E19E44' }} />
              <span className="text-uppercase fw-bold small" style={{ color: isFallback ? '#6c757d' : '#E19E44', letterSpacing: '1px' }}>
                {isFallback ? 'Koleksi Terbaru Modis Store' : 'AI Smart Recommendation'}
              </span>
            </div>
            <h2 className="fw-bold font-serif text-dark">
              {isFallback ? 'Mungkin Kamu Suka' : 'Hasil Personalisasi Untukmu'}
            </h2>
            <p className="text-muted small">
              {isFallback 
                ? "Belum ada yang pas dengan profilmu? Cek koleksi terbaru kami berikut ini."
                : `Sistem mencocokkan profil fisik (LD ${userProfile.profiling?.estimasiLD}cm) dengan katalog produk.`
              }
            </p>
          </div>
        </div>

        <div className="row g-4">
          {recommendedProducts.map((product) => (
            <div className="col-6 col-md-3" key={product._id}>
              <div className="card border-0 shadow-sm h-100 position-relative overflow-hidden" style={{ borderRadius: '12px' }}>
                
                {/* Badge Match Score - Hanya muncul jika bukan fallback */}
                {!isFallback && (
                  <div className="position-absolute top-0 end-0 m-2 z-3">
                    <span className="badge bg-dark text-white shadow-sm" style={{ fontSize: '10px', borderRadius: '50px' }}>
                      {(product.similarityScore * 100).toFixed(0)}% Match
                    </span>
                  </div>
                )}
                
                <Link to={`/produk/${product.slug}`} state={{ recommendedSize: product.suggestedSize }}>
                  <div className="overflow-hidden" style={{ height: '280px' }}>
                    <img 
                      src={product.img} 
                      alt={product.name} 
                      className="w-100 h-100 object-fit-cover transition-transform scale-hover" 
                    />
                  </div>
                </Link>

                <div className="card-body p-3 text-start d-flex flex-column">
                  <h6 className="fw-bold mb-1 text-truncate" style={{ fontSize: '14px' }}>{product.name}</h6>
                  <p className="text-muted extra-small mb-2">{product.category}</p>
                  
                  {/* DETAIL UKURAN - Sembunyikan detail presisi jika mode fallback */}
                  {!isFallback && (
                    <div className={`p-2 mb-3 rounded border ${product.isFit ? 'bg-light border-primary-subtle' : 'bg-danger-subtle border-danger'}`}>
                        <div className={`d-flex align-items-center gap-1 mb-1 ${product.isFit ? 'text-primary' : 'text-danger'}`}>
                          {product.isFit ? <Ruler size={12} /> : <AlertCircle size={12} />}
                          <span className="fw-bold" style={{fontSize: '10px'}}>
                            {product.isFit ? `Rekomendasi Size: ${product.suggestedSize}` : 'Ukuran Mungkin Kecil'}
                          </span>
                        </div>
                        {product.sizeChart && (
                          <p className="text-muted mb-0" style={{fontSize: '9px'}}>
                            Spesifikasi: LD {product.sizeChart.ld}cm | PP {product.sizeChart.pp}cm
                          </p>
                        )}
                    </div>
                  )}

                  <p className="fw-bold text-dark mt-auto mb-3">Rp {product.price?.toLocaleString('id-ID')}</p>
                  
                  <Link 
                    to={`/produk/${product.slug}`} 
                    className="btn btn-sm w-100 text-white fw-bold rounded-pill" 
                    style={{ backgroundColor: '#4A4A2A', fontSize: '11px', padding: '8px' }}
                  >
                    Lihat Detail
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