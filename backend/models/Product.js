const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Basic Info
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  shortDescription: String,
  brand: { type: String, default: 'ABSENCE' },
  
  // Pricing
  price: { type: Number, required: true },
  comparePrice: Number, // MRP
  costPrice: Number, // For profit calculation
  discount: {
    type: { type: String, enum: ['percentage', 'fixed'] },
    value: Number,
    validTill: Date
  },
  
  // Category & Classification
  category: [{ 
    type: String, 
    enum: ['t-shirt', 'oversized', 'printed', 'plain', 'graphic', 'minimal']
  }],
  gender: { 
    type: String, 
    enum: ['men', 'women', 'unisex'],
    default: 'unisex'
  },
  ageGroup: { 
    type: String, 
    enum: ['kids', 'teen', 'adult'],
    default: 'adult'
  },
  
  // Product Attributes (For Filters)
  attributes: {
    material: String, // 100% Cotton, Cotton Blend, etc
    fit: { 
      type: String, 
      enum: ['oversized', 'regular', 'slim', 'relaxed'],
      default: 'regular'
    },
    neckType: {
      type: String,
      enum: ['round', 'v-neck', 'collar', 'henley'],
      default: 'round'
    },
    sleeveType: {
      type: String,
      enum: ['half', 'full', 'sleeveless'],
      default: 'half'
    },
    pattern: {
      type: String,
      enum: ['printed', 'plain', 'graphic', 'striped', 'checked'],
      default: 'plain'
    },
    gsm: Number, // Fabric weight (180, 200, 220 GSM)
    fabricType: String // Single Jersey, Pique, etc
  },
  
  // Variants (Color-based with sizes)
  variants: [{
    color: { type: String, required: true },
    colorCode: String, // Hex code for display
    images: [{
      url: String,
      publicId: String,
      alt: String
    }],
    sizes: [{
      size: { 
        type: String, 
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
        required: true
      },
      stock: { type: Number, default: 0 },
      sku: String // Stock Keeping Unit
    }]
  }],

  // Legacy/simple size list (used by storefront and quick stock updates)
  sizes: [{
    size: {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
    },
    stock: { type: Number, default: 0 },
    sku: String
  }],
  
  // Size Chart
  sizeChart: {
    url: String,
    publicId: String,
    measurements: [{
      size: String,
      chest: String,
      length: String,
      shoulder: String
    }]
  },
  
  // Media
  images: [{ // Fallback if no variants
    url: String,
    publicId: String,
    alt: String
  }],
  video: {
    url: String,
    thumbnail: String
  },
  
  // Shipping Info
  shipping: {
    weight: Number, // in grams
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    freeShipping: { type: Boolean, default: false },
    deliveryTime: { type: String, default: '3-5 days' }
  },
  
  // Tags & Keywords
  tags: [String], // streetwear, trending, summer, etc
  searchKeywords: [String], // Additional search keywords for SEO
  
  // FAQ Section
  faq: [{
    question: String,
    answer: String
  }],
  
  // SEO
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    ogImage: String,
    canonicalUrl: String
  },
  
  // Status & Flags
  featured: { type: Boolean, default: false },
  newArrival: { type: Boolean, default: false },
  bestseller: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  
  // Stats
  totalSold: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
  
  // Reviews
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    images: [String],
    videos: [String],
    verified: { type: Boolean, default: false },
    helpful: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Indexes for better search & filter performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, gender: 1, price: 1 });
productSchema.index({ 'attributes.fit': 1, 'attributes.pattern': 1 });
productSchema.index({ slug: 1 });
productSchema.index({ featured: 1, newArrival: 1, bestseller: 1 });

// Validate at least one category
productSchema.pre('validate', function(next) {
  if (!this.category || this.category.length === 0) {
    this.invalidate('category', 'At least one category is required');
  }
  next();
});

// Auto-generate slug from name
productSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Calculate average rating
productSchema.methods.calculateRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.reviewCount = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating = (sum / this.reviews.length).toFixed(1);
    this.reviewCount = this.reviews.length;
  }
};

module.exports = mongoose.model('Product', productSchema);
