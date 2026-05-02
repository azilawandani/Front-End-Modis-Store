/**
 * Logika Content-Based Filtering untuk Modis Store
 * Menghitung kemiripan antara Profil User dengan Deskripsi Produk
 */

// 1. Fungsi untuk membersihkan teks dan mengubah jadi array kata (Tokenizing)
const tokenize = (text) => {
    return text.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").split(/\s+/);
};

// 2. Fungsi menghitung Term Frequency (TF)
const getTF = (tokens) => {
    const tf = {};
    tokens.forEach(word => {
        tf[word] = (tf[word] || 0) + 1;
    });
    return tf;
};

// 3. Fungsi menghitung Cosine Similarity antara dua vektor
const calculateCosineSimilarity = (vecA, vecB) => {
    const intersection = Object.keys(vecA).filter(word => vecB[word]);
    
    let dotProduct = 0;
    intersection.forEach(word => {
        dotProduct += vecA[word] * vecB[word];
    });

    const magA = Math.sqrt(Object.values(vecA).reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(Object.values(vecB).reduce((sum, val) => sum + val * val, 0));

    if (!magA || !magB) return 0;
    return dotProduct / (magA * magB);
};

// 4. Fungsi Utama Rekomendasi
export const getRecommendations = (userProfile, allProducts) => {
    if (!userProfile) return [];

    // Gabungkan preferensi user menjadi satu string "dokumen user"
    const userString = `${userProfile.warnaFavorit} ${userProfile.gayaPakaian} ${userProfile.motifDisukai}`;
    const userTokens = tokenize(userString);
    const userTF = getTF(userTokens);

    const scoredProducts = allProducts.map(product => {
        const productTokens = tokenize(product.description);
        const productTF = getTF(productTokens);
        
        // Hitung skor kemiripan
        const score = calculateCosineSimilarity(userTF, productTF);
        
        return { ...product, similarityScore: score };
    });

    // Urutkan berdasarkan skor tertinggi (Ranking)
    return scoredProducts
        .filter(p => p.similarityScore > 0) // Hanya tampilkan yang ada kemiripan
        .sort((a, b) => b.similarityScore - a.similarityScore);
};