const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect, authorize } = require('../middleware/auth');
const { upload, uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      gender, 
      fit, 
      size, 
      minPrice, 
      maxPrice, 
      search,
      featured,
      sort = '-createdAt',
      page = 1,
      limit = 12
    } = req.query;
    
    const filter = { isActive: true };
    
    // Filters
    if (category) {
      // Support both single category and array
      if (Array.isArray(category)) {
        filter.category = { $in: category };
      } else {
        filter.category = category;
      }
    }
    if (gender) filter.gender = gender;
    if (fit) filter['attributes.fit'] = fit;
    if (featured) filter.featured = true;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    // Size filter (check in variants or legacy sizes)
    if (size) {
      filter.$or = [
        { 'variants.sizes.size': size },
        { 'sizes.size': size }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Product.countDocuments(filter);
    
    res.json({
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Products API Error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate('reviews.user', 'name email');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/reviews', protect, upload.array('media', 6), async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const numericRating = Number(rating);

    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const alreadyReviewed = product.reviews.some(
      (review) => review.user && review.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const hasPurchased = await Order.exists({
      user: req.user._id,
      orderStatus: { $ne: 'cancelled' },
      items: { $elemMatch: { product: product._id } }
    });

    if (!hasPurchased) {
      return res.status(403).json({ message: 'Only customers who purchased can review this product' });
    }

    const files = req.files || [];
    const imageUrls = [];
    const videoUrls = [];

    if (files.length > 0) {
      const uploads = await Promise.all(
        files.map((file) => uploadToCloudinary(file.buffer, 'absence/reviews'))
      );

      uploads.forEach((uploaded, idx) => {
        const mimetype = files[idx]?.mimetype || '';
        if (mimetype.startsWith('video/')) {
          videoUrls.push(uploaded.secure_url);
        } else {
          imageUrls.push(uploaded.secure_url);
        }
      });
    }

    product.reviews.push({
      user: req.user._id,
      rating: numericRating,
      comment: comment || '',
      images: imageUrls,
      videos: videoUrls,
      verified: true
    });

    product.calculateRating();
    await product.save();
    await product.populate('reviews.user', 'name email');

    res.status(201).json({
      message: 'Review added successfully',
      rating: product.rating,
      reviewCount: product.reviewCount,
      reviews: product.reviews
    });
  } catch (error) {
    console.error('Review create error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('admin', 'superadmin'), upload.array('images', 10), async (req, res) => {
  try {
    const productData = JSON.parse(req.body.data);
    
    // Upload main images to Cloudinary
    if (req.files && req.files.length > 0) {
      const imageUploads = await Promise.all(
        req.files.map(file => uploadToCloudinary(file.buffer, 'absence/products'))
      );
      productData.images = imageUploads.map(img => ({
        url: img.secure_url,
        publicId: img.public_id
      }));
    }
    
    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, authorize('admin', 'superadmin'), upload.array('images', 10), async (req, res) => {
  try {
    let productData;
    
    // Check if data is sent as FormData or JSON
    if (req.body.data) {
      productData = JSON.parse(req.body.data);
      
      // Upload new images to Cloudinary if provided
      if (req.files && req.files.length > 0) {
        const imageUploads = await Promise.all(
          req.files.map(file => uploadToCloudinary(file.buffer, 'absence/products'))
        );
        const newImages = imageUploads.map(img => ({
          url: img.secure_url,
          publicId: img.public_id
        }));
        
        // Add new images to existing images
        productData.images = [...(productData.images || []), ...newImages];
      }
    } else {
      productData = req.body;
    }
    
    const product = await Product.findByIdAndUpdate(req.params.id, productData, { new: true });
    res.json(product);
  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/size-chart', protect, authorize('admin', 'superadmin'), upload.single('sizeChart'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (product.sizeChart?.publicId) {
      await deleteFromCloudinary(product.sizeChart.publicId);
    }
    
    const result = await uploadToCloudinary(req.file.buffer, 'absence/size-charts');
    product.sizeChart = {
      url: result.secure_url,
      publicId: result.public_id
    };
    
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bulk import products
router.post('/bulk-import', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const { products, deleteExisting } = req.body;
    
    if (deleteExisting) {
      await Product.deleteMany({});
    }
    
    const imported = await Product.insertMany(products);
    res.json({ 
      message: `Successfully imported ${imported.length} products`,
      count: imported.length 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete all products
router.delete('/bulk/delete-all', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const result = await Product.deleteMany({});
    res.json({ 
      message: `Deleted ${result.deletedCount} products`,
      count: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
