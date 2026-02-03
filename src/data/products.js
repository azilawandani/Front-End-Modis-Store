export const products = [
  { 
    id: 1, slug: 'abaya-turki', name: 'Abaya Turki', price: 195000, img: '/assets/abaya-turki.jpg', category: 'Gamis',
    description: 'Abaya Turki eksklusif dengan bahan jetblack premium dan aksen bordir mewah.',
    colors: [{ name: 'Black', code: '#000000' }], sizes: ['S', 'M', 'L', 'XL'], features: ['Bahan Jetblack', 'Busui Friendly']
  },
  { 
    id: 2, slug: 'kemeja', name: 'Kemeja', price: 80000, img: '/assets/kemeja.jpg', category: 'Baju',
    description: 'Kemeja basic potongan oversize yang trendy menggunakan bahan katun linen.',
    colors: [{ name: 'White', code: '#FFFFFF' }], sizes: ['M', 'L', 'XL'], features: ['Katun Linen', 'Oversize Fit']
  },
  { id: 3, slug: 'tunik', name: 'Tunik', price:'Rp.100.000', img: '/assets/tunik.jpg', category: 'Baju', description: 'Tunik simpel nyaman.', colors: [{name:'Grey', code:'#808080'}], sizes: ['All Size'], features: ['Bahan Rayon'] },
  { id: 4, slug: 'blouse-barkat', name: 'Blouse Barkat', price: 'Rp.120.000', img: '/assets/blouse-barkat.jpg', category: 'Baju', description: 'Detail brukat premium.', colors: [{name:'Pink', code:'#DCAE96'}], sizes: ['M', 'L'], features: ['Brukat Cord'] },
  { id: 5, slug: 'blouse-balon', name: 'Blouse Balon', price: 'Rp.130.000', img: '/assets/blouse-balon.jpg', category: 'Baju', description: 'Lengan model balon.', colors: [{name:'Lilac', code:'#C8A2C8'}], sizes: ['S', 'M'], features: ['Bahan Crinkle'] },
  { id: 6, slug: 'baju-casual', name: 'Baju', price: 'Rp.200.000', img: '/assets/Baju.jpg', category: 'Baju', description: 'Baju katun premium.', colors: [{name:'Mint', code:'#98FF98'}], sizes: ['L'], features: ['Bahan Katun'] },
  { id: 7, slug: 'mukena-premium', name: 'Mukena', price: 'Rp.160.000', img: '/assets/Mukena.jpg', category: 'Mukena', description: 'Bahan silk lembut.', colors: [{name:'White', code:'#F5F5F5'}], sizes: ['Jumbo'], features: ['Bahan Silk'] },
  { id: 8, slug: 'viscose-set', name: 'Viscose', price: 'Rp.140.000', img: '/assets/Viscose.jpg', category: 'Hijab', description: 'Hijab viscose praktis.', colors: [{name:'Rose', code:'#FF007F'}], sizes: ['All Size'], features: ['Tanpa Jarum'] },
  { id: 9, slug: 'pashmina-silk', name: 'Pashmina Silk', price: 'Rp.45.000', img: '/assets/v1.jpg', category: 'Hijab', description: 'Cradenza silk shiny.', colors: [{name:'Gold', code:'#F7E7CE'}], sizes: ['180x75'], features: ['Tepi Jahit'] },
  { id: 10, slug: 'gamis-aisyah', name: 'Gamis Aisyah', price: 'Rp.210.000', img: '/assets/g1.jpg', category: 'Gamis', description: 'Gamis syari ceruty.', colors: [{name:'Milo', code:'#AB917C'}], sizes: ['L', 'XL'], features: ['Full Furing'] },
  { id: 11, slug: 'blouse-rumple', name: 'Blouse Rumple', price: 'Rp.145.000', img: '/assets/baju1.jpg', category: 'Baju', description: 'Detail ruffle manis.', colors: [{name:'Soft Pink', code:'#FFB6C1'}], sizes: ['M'], features: ['Bahan Chiffon'] },
  { id: 12, slug: 'blouse-kanaya', name: 'Blouse Kanaya', price: 'Rp.80.000', img: '/assets/baju2.jpg', category: 'Baju', description: 'Potongan nyaman.', colors: [{name:'Soft Pink', code:'#FFB6C1'}], sizes: ['L'], features: ['Full Kancing'] },
  { id: 13, slug: 'tunik-elis', name: 'Tunik Elis', price: 'Rp.100.000', img: '/assets/tu1.jpg', category: 'Baju', description: 'Tunik stylish.', colors: [{name:'Army', code:'#4B5320'}], sizes: ['Std'], features: ['Bahan Katun'] },
  { id: 14, slug: 'tunik-maya', name: 'Tunik Maya', price: 'Rp120.000', img: '/assets/tu2.jpg', category: 'Baju', description: 'Modern earth tone.', colors: [{name:'Denim', code:'#1560BD'}], sizes: ['Std'], features: ['Katun Lembut'] },
  { id: 15, slug: 'mukena-miskah', name: 'Mukena Miskah', price: 'Rp.130.000', img: '/assets/m1.jpg', category: 'Mukena', description: 'Mukena travel ringkas.', colors: [{name:'Army', code:'#4B5320'}], sizes: ['Std'], features: ['Parasut Premium'] },
  { id: 16, slug: 'mukena-aisyah', name: 'Mukena Aisyah', price: 'Rp.200.000', img: '/assets/m2.jpg', category: 'Mukena', description: 'Katun silk bordir.', colors: [{name:'White', code:'#F5F5F5'}], sizes: ['All Size'], features: ['Tas Cantik'] },
  { id: 17, slug: 'mukena-manis', name: 'Mukena Manis', price: 'Rp.160.000', img: '/assets/m3.jpg', category: 'Mukena', description: 'Motif floral manis.', colors: [{name:'Mint', code:'#98FF98'}], sizes: ['All Size'], features: ['Rayon Premium'] },
  { id: 18, slug: 'gamis-airya', name: 'Gamis Airya', price: 'Rp.140.000', img: '/assets/g8.jpg', category: 'Gamis', description: 'Potongan A-line.', colors: [{name:'Navy', code:'#000080'}], sizes: ['M', 'L'], features: ['Bahan Ceruty'] },
  { id: 19, slug: 'hijab-motif', name: 'Hijab Motif', price: 'Rp.45.000', img: '/assets/v9.jpg', category: 'Hijab', description: 'Motif eksklusif.', colors: [{name:'Multi', code:'#E6E6FA'}], sizes: ['115x115'], features: ['Laser Cut'] },
  { id: 20, slug: 'gamis-aminah', name: 'Gamis Aminah', price: 'Rp.210.000', img: '/assets/g10.jpg', category: 'Gamis', description: 'Brokat elegan.', colors: [{name:'Gold', code:'#FFD700'}], sizes: ['L', 'XL'], features: ['Furing Full'] },
  { id: 21, slug: 'mukena-marisca', name: 'Mukena Marisca', price: 'Rp.200.000', img: '/assets/m5.jpg', category: 'Mukena', description: 'Velvet glowing.', colors: [{name:'Emerald', code:'#50C878'}], sizes: ['Jumbo'], features: ['Renda Giper'] },
  { id: 22, slug: 'mukena-arab', name: 'Mukena Arab', price: 'Rp.160.000', img: '/assets/m6.jpg', category: 'Mukena', description: 'Renda Timur Tengah.', colors: [{name:'Black', code:'#000000'}], sizes: ['All Size'], features: ['Bahan Adem'] },
  { id: 23, slug: 'mukena-anisa', name: 'Mukena Anisa', price: 'Rp.140.000', img: '/assets/m7.jpg', category: 'Mukena', description: 'Warna pastel lembut.', colors: [{name:'Peach', code:'#FFDAB9'}], sizes: ['All Size'], features: ['Katun Mikro'] },
  { id: 24, slug: 'mukena-rumple', name: 'Mukena Rumple', price: 'Rp.45.000', img: '/assets/m8.jpg', category: 'Mukena', description: 'Mukena anak ceria.', colors: [{name:'Yellow', code:'#FFFF00'}], sizes: ['S', 'M'], features: ['Aksen Rumple'] },
  { id: 25, slug: 'gamis-raya', name: 'Gamis Raya', price: 'Rp.195.000', img: '/assets/g3.jpg', category: 'Gamis', description: 'Bahan sateen premium.', colors: [{name:'Sage', code:'#9DC183'}], sizes: ['L'], features: ['Spesial Lebaran'] },
  { id: 26, slug: 'gamis-manisa', name: 'Gamis Manisa', price: 'Rp.195.000', img: '/assets/g4.jpg', category: 'Gamis', description: 'Motif polkadot.', colors: [{name:'Black', code:'#333333'}], sizes: ['M'], features: ['Kerah Rebah'] },
  { id: 27, slug: 'gamis-bangkok', name: 'Gamis Bangkok', price: 'Rp195.000', img: '/assets/g5.jpg', category: 'Gamis', description: 'Impor premium.', colors: [{name:'Terracotta', code:'#E2725B'}], sizes: ['L'], features: ['Full Furing'] },
  { id: 28, slug: 'gamis-viral', name: 'Gamis Viral', price: 'Rp.195.000', img: '/assets/g7.jpg', category: 'Gamis', description: 'Model susun hits.', colors: [{name:'Lilac', code:'#C8A2C8'}], sizes: ['All Size'], features: ['Crinkle Airflow'] }
];