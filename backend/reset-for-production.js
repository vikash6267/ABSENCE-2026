const mongoose = require('mongoose');
const Order = require('./models/Order');
const Counter = require('./models/Counter');
const Referral = require('./models/Referral');
const Wallet = require('./models/Wallet');
const PaymentIntent = require('./models/PaymentIntent');
const PaymentLedger = require('./models/PaymentLedger');
require('dotenv').config();

const resetForProduction = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected\n');

    // 1. Delete all orders
    console.log('🗑️  Deleting all orders...');
    const ordersDeleted = await Order.deleteMany({});
    console.log(`✅ Deleted ${ordersDeleted.deletedCount} orders\n`);

    // 2. Reset order counter to 0 (next order will be MTC-00001)
    console.log('🔄 Resetting order counter...');
    await Counter.findOneAndUpdate(
      { key: 'order_number' },
      { seq: 0 },
      { upsert: true }
    );
    console.log('✅ Order counter reset to 0 (next order: MTC-00001)\n');

    // 3. Delete all referrals
    console.log('🗑️  Deleting all referrals...');
    const referralsDeleted = await Referral.deleteMany({});
    console.log(`✅ Deleted ${referralsDeleted.deletedCount} referrals\n`);

    // 4. Reset all wallets
    console.log('🔄 Resetting all wallets...');
    const walletsReset = await Wallet.updateMany(
      {},
      {
        $set: {
          balance: 0,
          totalEarned: 0,
          totalSpent: 0,
          transactions: []
        }
      }
    );
    console.log(`✅ Reset ${walletsReset.modifiedCount} wallets\n`);

    // 5. Delete all payment intents
    console.log('🗑️  Deleting all payment intents...');
    const paymentIntentsDeleted = await PaymentIntent.deleteMany({});
    console.log(`✅ Deleted ${paymentIntentsDeleted.deletedCount} payment intents\n`);

    // 6. Delete all payment ledgers
    console.log('🗑️  Deleting all payment ledgers...');
    const paymentLedgersDeleted = await PaymentLedger.deleteMany({});
    console.log(`✅ Deleted ${paymentLedgersDeleted.deletedCount} payment ledgers\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Database Reset Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✅ Summary:');
    console.log(`   • Orders deleted: ${ordersDeleted.deletedCount}`);
    console.log(`   • Order counter reset: 0 → MTC-00001`);
    console.log(`   • Referrals deleted: ${referralsDeleted.deletedCount}`);
    console.log(`   • Wallets reset: ${walletsReset.modifiedCount}`);
    console.log(`   • Payment intents deleted: ${paymentIntentsDeleted.deletedCount}`);
    console.log(`   • Payment ledgers deleted: ${paymentLedgersDeleted.deletedCount}`);
    console.log('\n🚀 Ready for production launch!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  }
};

resetForProduction();
