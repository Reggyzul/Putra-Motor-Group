import { Branch, SalesPost } from '../types';

export const BRANCH_MAPS_URLS: Record<string, string> = {
  kisaran: 'https://maps.app.goo.gl/JWgjwnCJrjnXKyot6',
  perdagangan: 'https://maps.app.goo.gl/mC3Sp6pWzSwYnMrP7?g_st=aw',
  cikampak: 'https://maps.app.goo.gl/nzHjDtWnQitAaAKf6?g_st=aw',
  dumai: 'https://maps.app.goo.gl/G16opnzCUJ98irnq9?g_st=aw',
};

export const DEFAULT_SALES_POSTS: Record<string, SalesPost[]> = {
  kisaran: [
    {
      name: 'PANDU MOTOR AEK KANOPAN',
      phone: '0812-7503-8495',
      whatsapp: '0812-7503-8495',
      googleMapsUrl: 'https://share.google/laoCr3R2LxY7fmP4u',
    },
    {
      name: 'PANDU MOTOR PETATAL',
      phone: '0853-7367-7299',
      whatsapp: '0853-7367-7299',
      googleMapsUrl: 'https://maps.app.goo.gl/CENKjrJEKA6i7BYk6?g_st=aw',
    },
    {
      name: 'PANDU MOTOR AIR BATU',
      phone: '0852-7664-7895',
      whatsapp: '0852-7664-7895',
      googleMapsUrl: 'https://maps.app.goo.gl/AUDQsX2qBwoCb5F1A?g_st=aw',
    },
  ],
  perdagangan: [
    {
      name: 'PANDU MOTOR SERBELAWAN',
      phone: '0822-7255-6655',
      whatsapp: '0822-7255-6655',
      googleMapsUrl: 'https://maps.google.com/maps/search/Pandu%20Motor%20Serbelawan/@3.12002918,99.14407334,17z?hl=id',
    },
    {
      name: 'PANDU MOTOR SIMPANG KOPI',
      phone: '0822-7447-4269',
      whatsapp: '0822-7447-4269',
      googleMapsUrl: 'https://maps.google.com/maps?q=3.3019129%2C99.3344276&z=17&hl=id',
    },
    {
      name: 'PANDU MOTOR MANDOGE',
      phone: '0852-7445-2439',
      whatsapp: '0852-7445-2439',
      googleMapsUrl: 'https://maps.google.com/maps?q=2.7708505%2C99.3400837&z=17&hl=id',
    },
    {
      name: 'PANDU MOTOR TANAH JAWA',
      phone: '0813-9641-7369',
      whatsapp: '0813-9641-7369',
      googleMapsUrl: 'https://maps.google.com/maps?q=2.8862593%2C99.1639182&z=17&hl=id',
    },
  ],
  cikampak: [
    {
      name: 'IKABINA MOTOR MAHATO',
      phone: '0812-6665-5050',
      whatsapp: '0812-6665-5050',
      googleMapsUrl: 'https://share.google/R9tWjMH5Yk10mREwW',
    },
    {
      name: 'IKABINA MOTOR AEK NABARA',
      phone: '0812-7084-8668',
      whatsapp: '0812-7084-8668',
      googleMapsUrl: 'https://maps.app.goo.gl/XbCn9TnQ8ZrbVWJg9',
    },
    {
      name: 'IKABINA MOTOR TELUK PANJI',
      phone: '0812-6511-6556',
      whatsapp: '0812-6511-6556',
      googleMapsUrl: 'https://share.google/uQRqT9QlI0NCFhYkJ',
    },
  ],
  dumai: [
    {
      name: 'SUKMA LUBUK GAUNG',
      phone: '0823-7441-4522',
      whatsapp: '0823-7441-4522',
      googleMapsUrl: 'https://maps.google.com/maps?q=1.7478348%2C101.3649219&z=17&hl=id',
    },
  ],
};

export interface BranchSocialItem {
  name: string;
  handle: string;
  url: string;
}

export const BRANCH_SOCIAL_LINKS: Record<string, {
  facebook?: BranchSocialItem;
  instagram?: BranchSocialItem;
  tiktok?: BranchSocialItem;
}> = {
  kisaran: {
    facebook: {
      name: 'Facebook',
      handle: 'pandu motor kisaran',
      url: 'https://www.facebook.com/search/top?q=pandu%20motor%20kisaran',
    },
    instagram: {
      name: 'Instagram',
      handle: '@pandumotorkisaran',
      url: 'https://www.instagram.com/pandumotorkisaran',
    },
    tiktok: {
      name: 'TikTok',
      handle: '@pandumotorkisaran',
      url: 'https://www.tiktok.com/@pandumotorkisaran',
    },
  },
  perdagangan: {
    facebook: {
      name: 'Facebook',
      handle: 'pandu motor perdagangan',
      url: 'https://www.facebook.com/search/top?q=pandu%20motor%20perdagangan',
    },
    instagram: {
      name: 'Instagram',
      handle: '@pandu_perdagangan',
      url: 'https://www.instagram.com/pandu_perdagangan',
    },
    tiktok: {
      name: 'TikTok',
      handle: '@Pandumotorperdagangan',
      url: 'https://www.tiktok.com/@Pandumotorperdagangan',
    },
  },
  cikampak: {
    facebook: {
      name: 'Facebook',
      handle: 'ikabina motor',
      url: 'https://www.facebook.com/search/top?q=ikabina%20motor',
    },
  },
  dumai: {
    facebook: {
      name: 'Facebook',
      handle: 'Motorian Daya',
      url: 'https://www.facebook.com/search/top?q=Motorian%20Daya',
    },
    instagram: {
      name: 'Instagram',
      handle: '@motoriandaya',
      url: 'https://www.instagram.com/motoriandaya',
    },
    tiktok: {
      name: 'TikTok',
      handle: '@MotorianDayaDumai',
      url: 'https://www.tiktok.com/@MotorianDayaDumai',
    },
  },
};

export const BRANCHES_DATA: Branch[] = [
  {
    id: 'kisaran',
    name: 'Pandu Motor Kisaran',
    companyName: 'CV. Pandu Motor',
    code: 'PM-KSR',
    city: 'Kisaran Barat, Asahan',
    province: 'Sumatera Utara',
    address: 'Jl. Kartini No. 204 A-B, Kisaran Barat, Asahan, Sumatera Utara',
    phone: '0822-7647-7628',
    whatsapp: '6282276477628',
    email: 'pandumotor20@gmail.com',
    googleMapsUrl: 'https://maps.app.goo.gl/JWgjwnCJrjnXKyot6',
    socialMedia: {
      facebook: 'pandu motor kisaran',
      instagram: '@pandumotorkisaran',
      tiktok: '@pandumotorkisaran',
    },
    operationalHours: 'Setiap Hari: 08.00 - 17.00 WIB (Kecuali Hari Libur Besar)',
    image: '/images/pandu motor kisaran.avif',
    logo: '/images/logo_pandumotor.avif',
    salesPosts: DEFAULT_SALES_POSTS.kisaran,
  },
  {
    id: 'perdagangan',
    name: 'Pandu Motor Perdagangan',
    companyName: 'CV. Pandu Motor',
    code: 'PM-PDG',
    city: 'Perdagangan, Simalungun',
    province: 'Sumatera Utara',
    address: 'Jl. Rajamin Purba No. 02, Perdagangan, Kab. Simalungun, Sumatera Utara',
    phone: '0822-7783-9628',
    whatsapp: '6282277839628',
    email: 'pandumotorperdagangan@gmail.com',
    googleMapsUrl: 'https://maps.app.goo.gl/mC3Sp6pWzSwYnMrP7?g_st=aw',
    socialMedia: {
      facebook: 'pandu motor perdagangan',
      instagram: '@pandu_perdagangan',
      tiktok: '@Pandumotorperdagangan',
    },
    operationalHours: 'Setiap Hari: 08.00 - 17.00 WIB (Kecuali Hari Libur Besar)',
    image: '/images/pandu motor 2.avif',
    logo: '/images/logo_pandumotor.avif',
    salesPosts: DEFAULT_SALES_POSTS.perdagangan,
  },
  {
    id: 'cikampak',
    name: 'Ikabina Motor Cikampak',
    companyName: 'CV. Ikabina Motor',
    code: 'IM-CKP',
    city: 'Torgamba, Labuhanbatu Selatan',
    province: 'Sumatera Utara',
    address: 'Jl. Lintas Sumatera Riau, Desa Aek Batu, Torgamba, Labuhan Batu Selatan, Sumatera Utara',
    phone: '0812-6060-525',
    whatsapp: '628126060525',
    email: 'ikabinacikampak@yahoo.com',
    googleMapsUrl: 'https://maps.app.goo.gl/nzHjDtWnQitAaAKf6?g_st=aw',
    socialMedia: {
      facebook: 'ikabina motor',
    },
    operationalHours: 'Setiap Hari: 08.00 - 17.00 WIB (Kecuali Hari Libur Besar)',
    image: '/images/ikabina.avif',
    logo: '/images/logo_ikabina.avif',
    salesPosts: DEFAULT_SALES_POSTS.cikampak,
  },
  {
    id: 'dumai',
    name: 'Motorian Daya Bukit Kapur',
    companyName: 'CV. Motorian Daya',
    code: 'MD-DMI',
    city: 'Bukit Kapur, Dumai',
    province: 'Riau',
    address: 'Jl. Soekarno Hatta Pasar Sukaramai, Bukit Kayu Kapur, Bukit Kapur, Dumai - Riau',
    phone: '0812-7567-7474',
    whatsapp: '6281275677474',
    email: 'motoriandaya@gmail.com',
    googleMapsUrl: 'https://maps.app.goo.gl/G16opnzCUJ98irnq9?g_st=aw',
    socialMedia: {
      facebook: 'Motorian Daya',
      instagram: '@motoriandaya',
      tiktok: '@MotorianDayaDumai',
    },
    operationalHours: 'Setiap Hari: 08.00 - 17.00 WIB (Kecuali Hari Libur Besar)',
    image: '/images/motoran daya bukit.avif',
    logo: '/images/logo_motoriandaya.avif',
    salesPosts: DEFAULT_SALES_POSTS.dumai,
  },
];

export const COMPANY_INFO = {
  groupName: 'Pandu Motor Group',
  tagline: 'Melayani Sepenuh Hati',
  slogan: 'Solusi Terbaik Jual Beli Motor Berkualitas & Dana Tunai Cepat Terpercaya',
  companies: [
    'CV. Pandu Motor',
    'CV. Ikabina Motor',
    'CV. Motorian Daya',
  ],
  services: [
    'Jual Beli Sepeda Motor Baru & Bekas',
    'Tukar Tambah Motor Semua Merk & Kondisi',
    'Pembelian Cash & Kredit Cicilan Ringan',
    'Layanan Dana Tunai Jaminan BPKB Motor & Mobil',
  ],
  advantages: [
    {
      title: 'Terpercaya & Resmi Sejak 2005',
      desc: 'Lebih dari 19 tahun melayani ribuan pelanggan setia di wilayah Sumatera Utara dan Riau dengan integritas tinggi.',
    },
    {
      title: 'Garansi Dokumen & Mesin Terjamin',
      desc: 'Seluruh unit terjamin keaslian surat-suratnya (BPKB, STNK & Faktur) dan garansi mesin dealer terpercaya.',
    },
    {
      title: 'Proses Cepat & Syarat Mudah',
      desc: 'Pengajuan kredit dan dana tunai didukung leasing resmi terkemuka dengan persetujuan kilat dan DP fleksibel.',
    },
    {
      title: 'Layanan 4 Showroom Strategis',
      desc: 'Showroom fisik tersebar di Kisaran, Perdagangan, Cikampak, dan Dumai siap melayani Anda sepenuh hati.',
    },
  ],
};
