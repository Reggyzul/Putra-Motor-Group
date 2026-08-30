export interface Testimonial {
  id: string;
  name: string;
  location: string;
  serviceType: 'Beli Motor Baru' | 'Beli Motor Bekas' | 'Tukar Tambah' | 'Dana Tunai BPKB';
  vehicleOrCollateral: string;
  rating: number;
  comment: string;
  branch: string;
  avatar: string;
}

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: '1',
    name: 'Haji Suryanto',
    location: 'Kisaran Barat, Asahan',
    serviceType: 'Beli Motor Bekas',
    vehicleOrCollateral: 'Yamaha NMAX 155 ABS',
    rating: 5,
    comment: 'Beli motor bekas di CV. Pandu Motor Kisaran beneran puas. Mesin halus seperti baru, surat-surat BPKB dan STNK langsung dicek di depan saya, pajaknya pun hidup panjang. Sales melayani ramah dan jujur.',
    branch: 'CV. Pandu Motor Kisaran',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: '2',
    name: 'Rian Pratama',
    location: 'Perdagangan, Simalungun',
    serviceType: 'Dana Tunai BPKB',
    vehicleOrCollateral: 'BPKB Honda Beat 2022',
    rating: 5,
    comment: 'Butuh modal tambahan untuk usaha sembako, coba gadai BPKB di Pandu Motor Perdagangan. Prosesnya cepat gak sampai 2 jam langsung cair! Bunga ringan dan motor tetap bisa dipakai jualan harian.',
    branch: 'CV. Pandu Motor Perdagangan',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: '3',
    name: 'Nur Aisyah Siregar',
    location: 'Cikampak, Torgamba',
    serviceType: 'Beli Motor Baru',
    vehicleOrCollateral: 'Honda Scoopy Prestige',
    rating: 5,
    comment: 'Pelayanan CV. Ikabina Motor Cikampak sangat mantap! Pengajuan kredit dibantu sampai ACC dengan DP terjangkau. Unit diantar langsung ke depan rumah dengan plat dan surat komplit.',
    branch: 'CV. Ikabina Motor Cikampak',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: '4',
    name: 'Dedi Saputra',
    location: 'Bukit Kapur, Dumai Riau',
    serviceType: 'Tukar Tambah',
    vehicleOrCollateral: 'Tukar Beat 2018 ke CRF 150L',
    rating: 5,
    comment: 'Tukar tambah motor di Motorian Daya Bukit Kapur harganya dihargai tinggi dan transparan. Nambahnya gak berat, prosesnya simpel tanpa ribet. Slogan Melayani Sepenuh Hati benar-benar terasa.',
    branch: 'CV. Motorian Daya Dumai',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80',
  },
];

export const FAQ_DATA = [
  {
    q: 'Apakah semua unit motor bekas di Pandu Motor Group memiliki surat lengkap?',
    a: 'Ya, 100% unit motor bekas di seluruh cabang CV. Pandu Motor, CV. Ikabina Motor, dan CV. Motorian Daya dijamin memiliki dokumen resmi lengkap (STNK, BPKB, dan Faktur). Kami menjamin keabsahan hukum legalitas setiap kendaraan.',
  },
  {
    q: 'Apa saja syarat pengajuan kredit motor baru atau bekas?',
    a: 'Syarat sangat mudah dan praktis: KTP Suami & Istri (atau KTP Pemohon & Penjamin jika belum menikah), Kartu Keluarga (KK), serta bukti penghasilan/rekening listrik. Tim kami siap membantu proses survei cepat hingga disetujui.',
  },
  {
    q: 'Bagaimana cara dan syarat mengajukan pinjaman Dana Tunai (Gadai BPKB)?',
    a: 'Cukup bawa KTP, KK, STNK asli, dan BPKB asli (Motor atau Mobil). Kendaraan fisik dibawa untuk cek fisik nomor rangka dan nomor mesin. Setelah taksiran disepakati, dana langsung cair ke rekening Anda dalam hitungan jam. BPKB aman tersimpan di brankas resmi dan kendaraan fisik tetap Anda gunakan.',
  },
  {
    q: 'Apakah bisa melakukan tukar tambah (Trade-In) motor lama dengan motor baru/bekas?',
    a: 'Bisa sekali! Kami menerima tukar tambah segala merk dan tahun. Motor lama Anda akan kami taksir dengan harga pasar terbaik dan dapat dijadikan sebagai Uang Muka (DP) atau pengurang harga pembelian cash.',
  },
  {
    q: 'Di mana saja lokasi showroom Pandu Motor Group?',
    a: 'Kami memiliki 4 showroom resmi di Sumatera Utara & Riau: (1) CV. Pandu Motor Kisaran Asahan, (2) CV. Pandu Motor Perdagangan Simalungun, (3) CV. Ikabina Motor Cikampak Labuhanbatu Selatan, dan (4) CV. Motorian Daya Bukit Kapur Dumai Riau.',
  },
  {
    q: 'Kapan jam operasional showroom buka?',
    a: 'Seluruh cabang kami buka setiap hari mulai pukul 08.00 WIB hingga 17.00 WIB (kecuali pada hari libur nasional/hari besar keagamaan). Layanan konsultasi WhatsApp aktif 24 jam.',
  },
];
