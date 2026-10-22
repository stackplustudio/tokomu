/**
 * Store Config — Tokomu (ui.md §5.2)
 * Semua konten khusus toko berada di sini.
 * Komponen UI hanya membaca konfigurasi ini — tidak ada teks/data toko di dalam komponen.
 * Ganti jenis toko cukup dengan mengubah file ini dan data produk.
 */

export type StoreCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string; // nama ikon Lucide
};

export type StoreConfig = {
  name: string;
  type: 'shoes' | 'fashion' | 'books' | 'batik';
  tagline: string;
  description: string;
  currency: 'IDR';
  locale: 'id-ID';
  categories: StoreCategory[];
  hero: {
    eyebrow: string;
    title: string;
    highlight: string; // kata penekanan berwarna biru (ui.md §4)
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
  };
  contact: {
    email?: string;
    phone?: string;
    address?: string;
  };
  assets: {
    /** Logo untuk latar terang (navbar putih, halaman login) */
    logoBlue: string;
    /** Logo untuk latar gelap/biru (CTA block, band charcoal) */
    logoWhite: string;
    /** Gambar placeholder bila produk tidak punya foto */
    productPlaceholder: string;
  };
  footer: {
    about: string;
    quickLinks: { label: string; href: string }[];
    socialLinks: { label: string; href: string; icon: string }[];
    copyright: string;
  };
  /** Konten hero homepage — bagian "Mengapa Tokomu" (bento sederhana) */
  whyUs: {
    eyebrow: string;
    title: string;
    highlight: string;
    items: { icon: string; title: string; description: string }[];
  };
};

/** Konfigurasi toko aktif — Toko Sepatu Tokomu */
export const storeConfig: StoreConfig = {
  name: 'Tokomu',
  type: 'shoes',
  tagline: 'Temukan Sepatu Sempurna untuk Setiap Langkah',
  description:
    'Tokomu menghadirkan koleksi sepatu pilihan — sneakers stylish, sepatu kasual nyaman, alas kaki lari berperforma tinggi, hingga sepatu formal elegan.',
  currency: 'IDR',
  locale: 'id-ID',

  categories: [
    {
      id: 'cat-sneakers',
      name: 'Sneakers',
      slug: 'sneakers',
      description: 'Sneakers modern untuk gaya sehari-hari',
      icon: 'Footprints',
    },
    {
      id: 'cat-casual',
      name: 'Casual Shoes',
      slug: 'casual-shoes',
      description: 'Nyaman dipakai seharian, cocok untuk semua aktivitas',
      icon: 'Shirt',
    },
    {
      id: 'cat-running',
      name: 'Running Shoes',
      slug: 'running-shoes',
      description: 'Performa terbaik untuk setiap lari',
      icon: 'Timer',
    },
    {
      id: 'cat-formal',
      name: 'Formal Shoes',
      slug: 'formal-shoes',
      description: 'Tampil profesional dan elegan',
      icon: 'Briefcase',
    },
  ],

  hero: {
    eyebrow: '› KOLEKSI TERBARU ‹',
    title: 'Temukan Sepatu',
    highlight: 'Sempurna Untukmu',
    subtitle:
      'Koleksi sepatu pilihan — dari sneakers kasual hingga formal elegan. Kualitas terbaik, harga terjangkau, langsung ke tanganmu.',
    ctaLabel: 'Lihat Semua Produk',
    ctaHref: '/products',
  },

  contact: {
    email: 'hello@tokomu.stackplustudio.com',
    phone: '+62 812-3456-7890',
    address: 'Jakarta, Indonesia',
  },

  assets: {
    logoBlue: '/stackplusbiru.png',
    logoWhite: '/stackplusputih.png',
    productPlaceholder: '/placeholder-shoe.svg',
  },

  footer: {
    about:
      'Tokomu — blueprint toko online single-vendor by Stack Plus Studio. Pilihan sepatu terbaik untuk setiap momen.',
    quickLinks: [
      { label: 'Beranda', href: '/' },
      { label: 'Katalog', href: '/products' },
      { label: 'Sneakers', href: '/products?category=sneakers' },
      { label: 'Running', href: '/products?category=running-shoes' },
    ],
    socialLinks: [
      { label: 'Instagram', href: '#', icon: 'Instagram' },
      { label: 'Twitter / X', href: '#', icon: 'Twitter' },
    ],
    copyright: `© ${new Date().getFullYear()} Tokomu — by Stack Plus Studio. All rights reserved.`,
  },

  whyUs: {
    eyebrow: '› MENGAPA TOKOMU ‹',
    title: 'Belanja Lebih Mudah,',
    highlight: 'Lebih Menyenangkan',
    items: [
      {
        icon: 'ShieldCheck',
        title: 'Produk Original',
        description: 'Semua produk terjamin keasliannya, langsung dari brand resmi.',
      },
      {
        icon: 'Truck',
        title: 'Pengiriman Cepat',
        description: 'Proses cepat, dikemas rapi, sampai ke tanganmu dengan aman.',
      },
      {
        icon: 'RefreshCw',
        title: 'Mudah Dikembalikan',
        description: 'Tidak cocok? Return mudah dalam 7 hari tanpa pertanyaan berlebihan.',
      },
      {
        icon: 'HeadphonesIcon',
        title: 'Dukungan 24/7',
        description: 'Tim kami siap membantu kapan pun kamu butuh bantuan.',
      },
    ],
  },
};

export default storeConfig;

