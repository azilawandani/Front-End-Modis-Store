/**
 * Logika Content-Based Filtering Pro (Optimized for Skripsi)
 * Menggunakan Weighted Vector Matching untuk akurasi tinggi
 */

// 1. Fungsi Tokenizing & Cleaning
const tokenize = (text) => {
    if (!text) return [];
    // Menghapus karakter khusus dan memisahkan kata
    return text.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").split(/\s+/).filter(t => t !== "");
};

// 2. Fungsi Menghitung Vektor Frekuensi Terbobot
// Kita memberikan bobot berbeda untuk setiap field agar hasil lebih akurat
const getWeightedVector = (userProfile) => {
    const vector = {};
    
    // Memberikan bobot kepentingan (Weighting)
    const preferences = [
        { value: userProfile.favBahan, weight: 3 },      
        { value: userProfile.gayaPakaian, weight: 2.5 }, 
        { value: userProfile.motifDisukai, weight: 2 },
        { value: userProfile.warnaFavorit, weight: 1.5 }
    ];

    preferences.forEach(pref => {
        if (pref.value) {
            const tokens = tokenize(pref.value);
            tokens.forEach(token => {
                vector[token] = (vector[token] || 0) + pref.weight;
            });
        }
    });
    return vector;
};

// 3. Fungsi Utama Rekomendasi
export const getRecommendations = (userProfile, allProducts) => {
    if (!userProfile || !allProducts) return [];

    // Buat Vektor Preferensi User (Weighted)
    const userVector = getWeightedVector(userProfile);
    const userWords = Object.keys(userVector);

    const scoredProducts = allProducts.map(product => {
        // Gabungkan fitur produk (Bahan, Gaya, Motif) + Warna + Deskripsi untuk perbandingan
        const prodFeatures = product.features || [];
        const prodColors = product.colors?.map(c => c.name).join(" ") || "";
        
        // Membentuk "Dokumen Produk" yang terstruktur
        const productString = `${prodFeatures.join(" ")} ${prodColors} ${product.description || ""}`;
        const productTokens = tokenize(productString);
        
        // Hitung skor berdasarkan irisan kata (Intersection Score)
        let dotProduct = 0;
        const productTF = {};
        
        productTokens.forEach(word => {
            productTF[word] = (productTF[word] || 0) + 1;
        });

        userWords.forEach(word => {
            if (productTF[word]) {
                // Skor = Bobot User * Kemunculan di Produk
                dotProduct += userVector[word] * productTF[word];
            }
        });

        // Hitung Magnitude untuk Normalisasi (Cosine-like)
        const magUser = Math.sqrt(Object.values(userVector).reduce((sum, val) => sum + val * val, 0));
        const magProd = Math.sqrt(Object.values(productTF).reduce((sum, val) => sum + val * val, 0));

        let finalScore = 0;
        if (magUser && magProd) {
            finalScore = dotProduct / (magUser * magProd);
        }

        return { 
            ...product, 
            similarityScore: parseFloat(finalScore.toFixed(4)) 
        };
    });

    // Ranking & Filtering
    return scoredProducts
        .filter(p => p.similarityScore > 0) 
        .sort((a, b) => b.similarityScore - a.similarityScore);
};