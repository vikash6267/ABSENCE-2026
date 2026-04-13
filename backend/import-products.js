require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const fs = require('fs');
const path = require('path');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

async function importProducts() {
  try {
    // Read product.json from root directory
    const productsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', 'product.json'), 'utf-8')
    );

    // Delete all existing products
    const deleteResult = await Product.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing products`);

    // Import new products
    const imported = await Product.insertMany(productsData);
    console.log(`✅ Successfully imported ${imported.length} products:`);
    
    imported.forEach((product, idx) => {
      console.log(`   ${idx + 1}. ${product.name} - ₹${product.price}`);
    });

    console.log('\n🎉 Import completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

importProducts();
