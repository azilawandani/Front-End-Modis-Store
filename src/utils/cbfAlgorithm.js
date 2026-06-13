// 1. Fungsi Tokenizing, Cleaning, & Sanitasi String Kata
const tokenize = (text) => {
    if (!text) return [];
    // Menghapus karakter khusus, mengubah ke huruf kecil, dan memisahkan kata
    return String(text)
        .toLowerCase()
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .split(/\s+/)
        .filter(t => t !== "");
};

// 2. Fungsi Menghitung Vektor Preferensi User Terbobot
const getWeightedVector = (userProfile) => {
    const vector = {};
    
    // Sinkronisasi penuh dengan field database MongoDB & input form Profile.jsx
    const preferences = [
        { value: userProfile.favBahan, weight: 3.0 },      // Bobot tertinggi untuk Bahan
        { value: userProfile.gayaPakaian, weight: 2.5 },    // Bobot untuk Gaya/Style
        { value: userProfile.motifDisukai, weight: 2.0 },   // Bobot untuk Motif
        { value: userProfile.warnaFavorit, weight: 1.5 }    // Bobot untuk Warna
    ];

    preferences.forEach(pref => {
        if (pref.value) {
            const tokens = tokenize(pref.value);
            tokens.forEach(token => {
                // Akumulasikan bobot kata kunci preferensi
                vector[token] = (vector[token] || 0) + pref.weight;
            });
        }
    });
    return vector;
};

/**
 * FUNGSI UTAMA: CONTENT-BASED FILTERING (COSINE SIMILARITY SINKRON)
 * Digunakan untuk menyusun rekomendasi produk butik Modis Store pada halaman utama
 */
export const getRecommendations = (userProfile, allProducts) => {
    if (!userProfile || !allProducts || allProducts.length === 0) return [];

    // Buat Vektor Preferensi Terbobot milik User
    const userVector = getWeightedVector(userProfile);
    const userWords = Object.keys(userVector);

    // Jika user belum mengisi kuesioner preferensi sama sekali, kembalikan produk default
    if (userWords.length === 0) return allProducts;

    const scoredProducts = allProducts.map(product => {
        // PERBAIKAN: Pemanggilan field disesuaikan dengan skema tabel data katalog butik asli
        const kategori = product.Kategori || product.kategori || "";
        const bahan = product.Bahan || product.bahan || "";
        const gaya = product["Gaya/Style"] || product.gaya || "";
        const motif = product.Motif || product.motif || "";
        const warna1 = product["Warna 1"] || "";
        const warna2 = product["Warna 2"] || "";
        const namaProduk = product["Nama Produk"] || product.nama || "";

        // Gabungkan seluruh string karakteristik pakaian menjadi "Dokumen Teks Produk"
        const productString = `${namaProduk} ${kategori} ${bahan} ${gaya} ${motif} ${warna1} ${warna2}`;
        const productTokens = tokenize(productString);
        
        // Hitung Term Frequency (TF) internal produk
        const productTF = {};
        productTokens.forEach(word => {
            productTF[word] = (productTF[word] || 0) + 1;
        });

        // Hitung perkalian titik vektor (Dot Product)
        let dotProduct = 0;
        userWords.forEach(word => {
            if (productTF[word]) {
                // Formula: Bobot Vektor User dikalikan frekuensi kata pada produk
                dotProduct += userVector[word] * productTF[word];
            }
        });

        // Perhitungan Magnitude Vektor untuk Normalisasi Rumus Cosine Similarity murni
        const magUser = Math.sqrt(Object.values(userVector).reduce((sum, val) => sum + val * val, 0));
        const magProd = Math.sqrt(Object.values(productTF).reduce((sum, val) => sum + val * val, 0));

        let cosineScore = 0;
        if (magUser && magProd) {
            // Rumus Matematika Cosine Similarity: Dot Product / (Magnitude User * Magnitude Produk)
            cosineScore = dotProduct / (magUser * magProd);
        }

        // PERBAIKAN LOGIKA BATAS: Batasi skor maksimal mutlak berada di angka 1.0000 (100%)
        if (cosineScore > 1) cosineScore = 1.0;
        if (cosineScore < 0) cosineScore = 0.0;

        return { 
            ...product, 
            similarityScore: parseFloat(cosineScore.toFixed(4)) // Ambil 4 angka di belakang desimal
        };
    });

    // Melakukan perangkingan produk dari skor tertinggi ke terendah
    return scoredProducts
        .filter(p => p.similarityScore > 0) 
        .sort((a, b) => b.similarityScore - a.similarityScore);
};