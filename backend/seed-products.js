const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const sampleProducts = [
  {
    name: 'Classic Black Oversized Tee',
    slug: 'classic-black-oversized-tee',
    description: 'Premium 100% cotton oversized t-shirt in classic black. Perfect for streetwear enthusiasts who value comfort and style.',
    price: 1299,
    comparePrice: 1999,
    category: 'oversized',
    gender: 'unisex',
    fit: 'oversized',
    material: '100% Premium Cotton',
    occasion: ['casual', 'streetwear'],
    sizes: [
      { size: 'S', stock: 10 },
      { size: 'M', stock: 15 },
      { size: 'L', stock: 20 },
      { size: 'XL', stock: 15 },
      { size: 'XXL', stock: 10 }
    ],
    tags: ['oversized', 'black', 'minimal', 'cotton'],
    featured: true,
    seo: {
      metaTitle: 'Classic Black Oversized Tee - ABSENCE',
      metaDescription: 'Premium oversized black t-shirt made from 100% cotton. Perfect fit for streetwear lovers.',
      metaKeywords: ['oversized tee', 'black t-shirt', 'streetwear', 'cotton']
    },
    shippingInfo: {
      weight: 250,
      dimensions: '30x25x5',
      freeShipping: true
    }
  },
  {
    name: 'White Minimal Graphic Tee',
    slug: 'white-minimal-graphic-tee',
    description: 'Clean white tee with subtle ABSENCE branding. Minimalist design for maximum impact.',
    price: 1199,
    comparePrice: 1799,
    category: 'printed',
    gender: 'unisex',
    fit: 'regular',
    material: '100% Cotton',
    occasion: ['casual', 'daily'],
    sizes: [
      { size: 'S', stock: 8 },
      { size: 'M', stock: 12 },
      { size: 'L', stock: 15 },
      { size: 'XL', stock: 10 }
    ],
    tags: ['minimal', 'white', 'graphic', 'cotton'],
    featured: true,
    seo: {
      metaTitle: 'White Minimal Graphic Tee - ABSENCE',
      metaDescription: 'Minimalist white t-shirt with subtle branding. Premium quality cotton.',
      metaKeywords: ['graphic tee', 'white t-shirt', 'minimal', 'cotton']
    }
  },
  {
    name: 'Grey Oversized Hoodie Style Tee',
    slug: 'grey-oversized-hoodie-tee',
    description: 'Oversized grey tee with dropped shoulders. Ultimate comfort meets street style.',
    price: 1499,
    comparePrice: 2299,
    category: 'oversized',
    gender: 'unisex',
    fit: 'oversized',
    material: 'Premium Cotton Blend',
    occasion: ['casual', 'streetwear', 'gym'],
    sizes: [
      { size: 'M', stock: 10 },
      { size: 'L', stock: 15 },
      { size: 'XL', stock: 12 },
      { size: 'XXL', stock: 8 }
    ],
    tags: ['oversized', 'grey', 'comfort', 'streetwear'],
    featured: true,
    discount: {
      percentage: 20,
      validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    }
  },
  {
    name: 'Black Printed Statement Tee',
    slug: 'black-printed-statement-tee',
    description: 'Bold graphic print on premium black cotton. Make a statement without saying a word.',
    price: 1399,
    comparePrice: 1999,
    category: 'printed',
    gender: 'unisex',
    fit: 'regular',
    material: '100% Cotton',
    occasion: ['casual', 'party', 'streetwear'],
    sizes: [
      { size: 'S', stock: 5 },
      { size: 'M', stock: 10 },
      { size: 'L', stock: 12 },
      { size: 'XL', stock: 8 }
    ],
    tags: ['printed', 'black', 'graphic', 'statement'],
    featured: false
  },
  {
    name: 'Navy Blue Minimal Tee',
    slug: 'navy-blue-minimal-tee',
    description: 'Deep navy blue with minimal branding. Versatile and timeless.',
    price: 999,
    comparePrice: 1499,
    category: 'plain',
    gender: 'men',
    fit: 'regular',
    material: '100% Cotton',
    occasion: ['casual', 'daily', 'office'],
    sizes: [
      { size: 'S', stock: 15 },
      { size: 'M', stock: 20 },
      { size: 'L', stock: 18 },
      { size: 'XL', stock: 12 }
    ],
    tags: ['plain', 'navy', 'minimal', 'basic'],
    featured: false
  },
  {
    name: 'Beige Oversized Relaxed Fit',
    slug: 'beige-oversized-relaxed-fit',
    description: 'Soft beige oversized tee. Perfect for laid-back vibes.',
    price: 1299,
    category: 'oversized',
    gender: 'unisex',
    fit: 'oversized',
    material: 'Premium Cotton',
    occasion: ['casual', 'streetwear'],
    sizes: [
      { size: 'M', stock: 8 },
      { size: 'L', stock: 12 },
      { size: 'XL', stock: 10 }
    ],
    tags: ['oversized', 'beige', 'relaxed', 'comfort'],
    featured: true
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Clear existing products (optional)
    // await Product.deleteMany({});
    // console.log('Cleared existing products');

    // Check and insert products
    for (const productData of sampleProducts) {
      const exists = await Product.findOne({ slug: productData.slug });
      if (!exists) {
        await Product.create(productData);
        console.log(`✅ Created: ${productData.name}`);
      } else {
        console.log(`⏭️  Skipped (exists): ${productData.name}`);
      }
    }

    console.log('\n🎉 Product seed completed!');
    console.log(`Total products in database: ${await Product.countDocuments()}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
