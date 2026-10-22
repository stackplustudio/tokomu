import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Seed Super Admin & Demo Customer
  const hashedPassword = await bcrypt.hash('password123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@stackplus.studio' },
    update: {
      password: hashedPassword,
    },
    create: {
      email: 'admin@stackplus.studio',
      name: 'Budi Cahyono',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin seeded:', admin.email);

  const customer = await prisma.user.upsert({
    where: { email: 'customer@stackplus.studio' },
    update: {
      password: hashedPassword,
    },
    create: {
      email: 'customer@stackplus.studio',
      name: 'Rian Pratama',
      password: hashedPassword,
      role: 'USER',
    },
  });
  console.log('✅ Demo Customer seeded:', customer.email);

  // 2. Seed Categories (FR-20)
  const categoriesData = [
    {
      name: 'Sneakers',
      slug: 'sneakers',
      description: 'Sneakers modern untuk gaya sehari-hari',
    },
    {
      name: 'Casual Shoes',
      slug: 'casual-shoes',
      description: 'Nyaman dipakai seharian, cocok untuk semua aktivitas',
    },
    {
      name: 'Running Shoes',
      slug: 'running-shoes',
      description: 'Performa terbaik untuk setiap lari',
    },
    {
      name: 'Formal Shoes',
      slug: 'formal-shoes',
      description: 'Tampil profesional dan elegan',
    },
  ];

  const categoryMap = new Map<string, string>();

  for (const cat of categoriesData) {
    const saved = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: cat,
    });
    categoryMap.set(saved.slug, saved.id);
  }
  console.log(`✅ ${categoriesData.length} categories seeded`);

  // 3. Seed Products (FR-20)
  const productsData = [
    {
      slug: 'airmax-pro-2024',
      name: 'AirMax Pro 2024',
      description: 'Sneakers ikonik dengan teknologi bantalan udara terbaru. Ringan, responsif, dan stylish untuk aktivitas harian.',
      priceIdr: 1_299_000,
      stock: 15,
      sku: 'SNK-AMP-2024',
      imageUrls: [],
      badge: 'New',
      isFeatured: true,
      isActive: true,
      attributes: { brand: 'AirMax', material: 'Mesh', colors: ['Putih', 'Hitam', 'Biru'] },
      categorySlug: 'sneakers',
    },
    {
      slug: 'urban-runner-x',
      name: 'Urban Runner X',
      description: 'Perpaduan sempurna antara gaya dan fungsi. Sole grip tinggi cocok untuk medan kota maupun trail ringan.',
      priceIdr: 899_000,
      stock: 30,
      sku: 'SNK-URX-001',
      imageUrls: [],
      badge: 'Featured',
      isFeatured: true,
      isActive: true,
      attributes: { brand: 'UrbanRun', material: 'Knit', colors: ['Abu-abu', 'Hitam'] },
      categorySlug: 'sneakers',
    },
    {
      slug: 'classic-canvas-low',
      name: 'Classic Canvas Low',
      description: 'Sepatu kanvas klasik yang tidak pernah ketinggalan zaman. Ringan dan cocok untuk tampilan kasual sehari-hari.',
      priceIdr: 449_000,
      stock: 50,
      sku: 'CAS-CCL-001',
      imageUrls: [],
      isFeatured: false,
      isActive: true,
      attributes: { brand: 'ClassicWear', material: 'Canvas', colors: ['Putih', 'Navy', 'Merah'] },
      categorySlug: 'casual-shoes',
    },
    {
      slug: 'loafer-premium-suede',
      name: 'Loafer Premium Suede',
      description: 'Loafer berbahan suede premium dengan insole empuk. Nyaman dipakai seharian, cocok ke kantor maupun jalan-jalan.',
      priceIdr: 675_000,
      stock: 20,
      sku: 'CAS-LPS-001',
      imageUrls: [],
      badge: 'Featured',
      isFeatured: true,
      isActive: true,
      attributes: { brand: 'SuedeCo', material: 'Suede', colors: ['Cokelat', 'Hitam'] },
      categorySlug: 'casual-shoes',
    },
    {
      slug: 'speedboost-elite',
      name: 'SpeedBoost Elite',
      description: 'Sepatu lari kompetisi dengan teknologi carbon plate. Bobot super ringan dan propulsi maksimal untuk PB baru.',
      priceIdr: 2_150_000,
      stock: 8,
      sku: 'RUN-SBE-001',
      imageUrls: [],
      badge: 'New',
      isFeatured: true,
      isActive: true,
      attributes: { brand: 'SpeedPro', material: 'Carbon Mesh', dropMm: 4, weight: '195g' },
      categorySlug: 'running-shoes',
    },
    {
      slug: 'trailblazer-400',
      name: 'TrailBlazer 400',
      description: 'Dirancang untuk medan berat. Outsole multi-directional grip dengan upper tahan air untuk trail running yang serius.',
      priceIdr: 1_450_000,
      stock: 12,
      sku: 'RUN-TB4-001',
      imageUrls: [],
      isFeatured: false,
      isActive: true,
      attributes: { brand: 'TrailPro', material: 'Gore-Tex', waterproof: true },
      categorySlug: 'running-shoes',
    },
    {
      slug: 'oxford-classic-leather',
      name: 'Oxford Classic Leather',
      description: 'Sepatu formal Oxford berbahan kulit sapi asli. Jahitan tangan, sol karet berkualitas tinggi, tahan bertahun-tahun.',
      priceIdr: 1_850_000,
      stock: 10,
      sku: 'FRM-OCL-001',
      imageUrls: [],
      badge: 'Featured',
      isFeatured: true,
      isActive: true,
      attributes: { brand: 'LeatherCraft', material: 'Full-Grain Leather', sole: 'Rubber' },
      categorySlug: 'formal-shoes',
    },
    {
      slug: 'derby-slim-fit',
      name: 'Derby Slim Fit',
      description: 'Derby modern dengan siluet ramping. Cocok untuk meeting, presentasi, maupun acara formal semi-kasual.',
      priceIdr: 1_250_000,
      stock: 18,
      sku: 'FRM-DSF-001',
      imageUrls: [],
      isFeatured: false,
      isActive: true,
      attributes: { brand: 'SlimLine', material: 'Split Leather', sole: 'TPR' },
      categorySlug: 'formal-shoes',
    },
    {
      slug: 'retro-jogger-90s',
      name: 'Retro Jogger 90s',
      description: 'Terinspirasi dari era keemasan 90-an. Chunky sole dan colorblock bold yang instagrammable.',
      priceIdr: 785_000,
      stock: 25,
      sku: 'SNK-RJ9-001',
      imageUrls: [],
      isFeatured: false,
      isActive: true,
      attributes: { brand: 'RetroKick', material: 'PU Leather + Mesh' },
      categorySlug: 'sneakers',
    },
    {
      slug: 'everyday-slip-on',
      name: 'Everyday Slip-On',
      description: 'Slip-on tanpa tali yang praktis. Busa memory foam di insole memastikan kenyamanan sepanjang hari.',
      priceIdr: 385_000,
      stock: 40,
      sku: 'CAS-ESO-001',
      imageUrls: [],
      isFeatured: false,
      isActive: true,
      attributes: { brand: 'EasyStep', material: 'Canvas + Memory Foam' },
      categorySlug: 'casual-shoes',
    },
    {
      slug: 'cushion-run-daily',
      name: 'Cushion Run Daily',
      description: 'Sepatu lari harian dengan bantalan lembut. Ideal untuk pemula yang baru memulai kebiasaan berlari.',
      priceIdr: 699_000,
      stock: 35,
      sku: 'RUN-CRD-001',
      imageUrls: [],
      badge: 'New',
      isFeatured: false,
      isActive: true,
      attributes: { brand: 'RunEasy', material: 'Engineered Mesh', dropMm: 10 },
      categorySlug: 'running-shoes',
    },
    {
      slug: 'monk-strap-brogue',
      name: 'Monk Strap Brogue',
      description: 'Perpaduan elegan antara monk strap dan detail brogue. Statement piece untuk tampilan formal yang berkarakter.',
      priceIdr: 1_650_000,
      stock: 0,
      sku: 'FRM-MSB-001',
      imageUrls: [],
      isFeatured: false,
      isActive: true,
      attributes: { brand: 'BrogueHouse', material: 'Pebble Grain Leather' },
      categorySlug: 'formal-shoes',
    },
  ];

  for (const prod of productsData) {
    const categoryId = categoryMap.get(prod.categorySlug);
    if (!categoryId) continue;

    const { categorySlug, ...rest } = prod;

    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        ...rest,
        categoryId,
      },
      create: {
        ...rest,
        categoryId,
      },
    });
  }

  console.log(`✅ ${productsData.length} products seeded`);
  console.log('🎉 Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
