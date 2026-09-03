export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
}

export const SEO_PAGE_CONFIGS: Record<string, SeoConfig> = {
  home: {
    title: 'Pandu Motor Group - Jual Beli Motor, Dana Tunai BPKB & Tukar Tambah Motor Sumut',
    description: 'Showroom resmi terpercaya jual beli motor baru & motor bekas berkualitas di Sumatera Utara & Riau. Layanan dana tunai BPKB cepat cair, tukar tambah motor harga terbaik, dan kredit DP murah di Kisaran, Perdagangan, Cikampak, Dumai.',
    keywords: 'jual beli motor, jual beli motor bekas, dana tunai, dana tunai bpkb motor, gadai bpkb motor cepat cair, tukar tambah motor, trade in motor bekas sumut, motor bekas kisaran asahan, motor bekas perdagangan simalungun, motor bekas cikampak, motor bekas dumai, showroom motor sumut, pandu motor group',
    canonical: 'https://pandumotorgroup.com/'
  },
  'dana-tunai': {
    title: 'Pinjaman Dana Tunai BPKB Motor Cepat Cair Sumut | Pandu Motor Group',
    description: 'Pinjaman dana tunai jaminan BPKB sepeda motor & mobil proses 1 hari cair, bunga ringan, dan motor tetap dapat Anda pakai sehari-hari. Tersedia di showroom Pandu Motor Kisaran, Perdagangan, Cikampak, dan Dumai.',
    keywords: 'dana tunai bpkb motor, gadai bpkb motor sumut, pinjaman dana tunai kisaran, pinjaman jaminan bpkb motor perdagangan, pinjaman bpkb cikampak, pinjaman bpkb dumai, dana tunai resmi bunga ringan',
    canonical: 'https://pandumotorgroup.com/#dana-tunai'
  },
  'tukar-tambah': {
    title: 'Tukar Tambah Motor Bekas & Baru DP Murah Sumut | Pandu Motor Group',
    description: 'Program tukar tambah (Trade-In) sepeda motor segala merek (Honda, Yamaha, Suzuki, Kawasaki) dengan taksiran harga tertinggi. Nilai motor lama langsung memotong DP atau harga motor impian Anda.',
    keywords: 'tukar tambah motor, tukar tambah motor bekas, trade in motor sumut, tukar motor lama dengan baru, tukar tambah motor kisaran asahan, tukar tambah motor perdagangan simalungun',
    canonical: 'https://pandumotorgroup.com/#tukar-tambah'
  },
  'jual-motor': {
    title: 'Jual Motor Bekas Anda Harga Terbaik & Cepat Laku | Pandu Motor Group',
    description: 'Ingin menjual sepeda motor Anda? Pandu Motor Group memberikan penawaran harga tertinggi yang transparan, proses inspeksi cepat, dan pembayaran tunai langsung di 4 showroom cabang kami.',
    keywords: 'jual motor bekas, jual motor bekas harga tinggi, tempat jual motor cepat laku sumut, jual motor kisaran, jual motor perdagangan, jual motor cikampak, jual motor dumai',
    canonical: 'https://pandumotorgroup.com/#jual-motor'
  },
  katalog: {
    title: 'Katalog Jual Beli Motor Baru & Motor Bekas Berkualitas | Pandu Motor Group',
    description: 'Jelajahi ratusan pilihan sepeda motor baru dan motor bekas bergaransi mesin resmi dari Honda, Yamaha, Kawasaki, Suzuki, dan Vespa di seluruh jaringan showroom Pandu Motor Group.',
    keywords: 'katalog motor bekas, harga motor bekas sumut, jual beli motor matic, motor bekas honda yamaha, kredit motor bekas dp murah kisaran perdagangan cikampak dumai',
    canonical: 'https://pandumotorgroup.com/#katalog'
  },
  cabang: {
    title: '4 Showroom Cabang Resmi & 11 Pos Penjualan Sumut - Riau | Pandu Motor Group',
    description: 'Temukan alamat lengkap, petunjuk Google Maps, dan kontak WhatsApp 4 Showroom Resmi Pandu Motor (Kisaran, Perdagangan, Cikampak, Dumai) serta 11 Pos Penjualan di Sumatera Utara & Riau.',
    keywords: 'showroom motor kisaran asahan, showroom motor perdagangan simalungun, ikabina motor cikampak, motorian daya dumai, pos penjualan pandu motor',
    canonical: 'https://pandumotorgroup.com/#cabang'
  },
  admin: {
    title: 'Panel Kelola Admin | Pandu Motor Group',
    description: 'Sistem manajemen data kendaraan, cabang showroom resmi, banner, dan pengaturan Pandu Motor Group.',
    canonical: 'https://pandumotorgroup.com/#admin'
  }
};

export const updatePageSeo = (page: string, customConfig?: Partial<SeoConfig>) => {
  const config = {
    ...(SEO_PAGE_CONFIGS[page] || SEO_PAGE_CONFIGS.home),
    ...customConfig,
  };

  // Update document.title
  if (config.title) {
    document.title = config.title;
  }

  // Update meta description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', config.description);

  // Update meta keywords
  if (config.keywords) {
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', config.keywords);
  }

  // Update OpenGraph Title & Description
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute('content', config.title);
  }
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) {
    ogDesc.setAttribute('content', config.description);
  }

  // Update Twitter Title & Description
  const twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle) {
    twTitle.setAttribute('content', config.title);
  }
  const twDesc = document.querySelector('meta[name="twitter:description"]');
  if (twDesc) {
    twDesc.setAttribute('content', config.description);
  }

  // Update Canonical
  if (config.canonical) {
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (linkCanonical) {
      linkCanonical.setAttribute('href', config.canonical);
    }
  }
};
