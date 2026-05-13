const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const readline = require('readline');
const Order = require('./models/Order');
const Counter = require('./models/Counter');
const Referral = require('./models/Referral');
const Wallet = require('./models/Wallet');
const PaymentIntent = require('./models/PaymentIntent');
const PaymentLedger = require('./models/PaymentLedger');
require('dotenv').config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const checkEmailConfiguration = async () => {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 Step 1: Email Configuration Check');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('🔍 Checking environment variables...');
  console.log(`   EMAIL_HOST: ${process.env.EMAIL_HOST || '❌ NOT SET'}`);
  console.log(`   EMAIL_PORT: ${process.env.EMAIL_PORT || '❌ NOT SET'}`);
  console.log(`   EMAIL_USER: ${process.env.EMAIL_USER || '❌ NOT SET'}`);
  
  const passConfigured = process.env.EMAIL_PASS && 
                        process.env.EMAIL_PASS !== 'your_gmail_app_password_here' &&
                        process.env.EMAIL_PASS.length > 10;
  
  console.log(`   EMAIL_PASS: ${passConfigured ? '✅ CONFIGURED' : '❌ NOT CONFIGURED'}\n`);

  if (!passConfigured) {
    console.log('❌ Email password not configured!\n');
    console.log('📝 To configure email:');
    console.log('   1. Open: https://myaccount.google.com/security');
    console.log('   2. Enable 2-Step Verification');
    console.log('   3. Generate App Password for "Mail"');
    console.log('   4. Update backend/.env with the 16-character password\n');
    console.log('📚 See EMAIL_SETUP_GUIDE.md for detailed instructions\n');
    
    const answer = await question('Do you want to continue without email? (yes/no): ');
    if (answer.toLowerCase() !== 'yes') {
      console.log('\n⏸️  Setup paused. Configure email and run again.\n');
      return false;
    }
    console.log('\n⚠️  Continuing without email configuration...\n');
    return true;
  }

  // Test email connection
  console.log('🔌 Testing SMTP connection...');
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.verify();
    console.log('✅ Email configuration is working!\n');
    return true;
  } catch (error) {
    console.log(`❌ Email test failed: ${error.message}\n`);
    console.log('📚 See EMAIL_SETUP_GUIDE.md for troubleshooting\n');
    
    const answer = await question('Do you want to continue anyway? (yes/no): ');
    if (answer.toLowerCase() !== 'yes') {
      console.log('\n⏸️  Setup paused. Fix email and run again.\n');
      return false;
    }
    console.log('\n⚠️  Continuing with email issues...\n');
    return true;
  }
};

const resetDatabase = async () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🗑️  Step 2: Database Reset');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('⚠️  WARNING: This will delete:');
  console.log('   • All orders');
  console.log('   • All referrals');
  console.log('   • All wallet transactions');
  console.log('   • All payment records\n');
  
  console.log('✅ This will keep:');
  console.log('   • Users (admin & customers)');
  console.log('   • Products');
  console.log('   • Coupons\n');

  const answer = await question('Are you sure you want to reset? (yes/no): ');
  if (answer.toLowerCase() !== 'yes') {
    console.log('\n⏸️  Database reset cancelled.\n');
    return false;
  }

  console.log('\n🔄 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ MongoDB Connected\n');

  // Delete all orders
  console.log('🗑️  Deleting all orders...');
  const ordersDeleted = await Order.deleteMany({});
  console.log(`✅ Deleted ${ordersDeleted.deletedCount} orders\n`);

  // Reset order counter
  console.log('🔄 Resetting order counter...');
  await Counter.findOneAndUpdate(
    { key: 'order_number' },
    { seq: 0 },
    { upsert: true }
  );
  console.log('✅ Order counter reset to 0 (next order: MTC-00001)\n');

  // Delete all referrals
  console.log('🗑️  Deleting all referrals...');
  const referralsDeleted = await Referral.deleteMany({});
  console.log(`✅ Deleted ${referralsDeleted.deletedCount} referrals\n`);

  // Reset all wallets
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

  // Delete all payment intents
  console.log('🗑️  Deleting all payment intents...');
  const paymentIntentsDeleted = await PaymentIntent.deleteMany({});
  console.log(`✅ Deleted ${paymentIntentsDeleted.deletedCount} payment intents\n`);

  // Delete all payment ledgers
  console.log('🗑️  Deleting all payment ledgers...');
  const paymentLedgersDeleted = await PaymentLedger.deleteMany({});
  console.log(`✅ Deleted ${paymentLedgersDeleted.deletedCount} payment ledgers\n`);

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 Database Reset Complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  return true;
};

const showNextSteps = () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚀 Next Steps');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('1️⃣  Start Backend Server:');
  console.log('   cd backend');
  console.log('   npm start\n');

  console.log('2️⃣  Start Frontend Server:');
  console.log('   cd frontend');
  console.log('   npm run dev\n');

  console.log('3️⃣  Test Order Flow:');
  console.log('   • Login: http://localhost:3000/login');
  console.log('   • Email: mahi@user.com');
  console.log('   • Password: Mahi@2026');
  console.log('   • Place a test order');
  console.log('   • Verify order number is MTC-00001');
  console.log('   • Check email for confirmation\n');

  console.log('4️⃣  Deploy to Production:');
  console.log('   • See DEPLOYMENT_GUIDE.md');
  console.log('   • Update production environment variables');
  console.log('   • Deploy backend and frontend');
  console.log('   • Test live payment\n');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Production Launch Ready!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
};

const main = async () => {
  console.log('\n');
  console.log('╔═══════════════════════════════════════╗');
  console.log('║   🚀 ABSENCE Production Launch Tool   ║');
  console.log('╔═══════════════════════════════════════╗');
  console.log('\n');

  try {
    // Step 1: Check email
    const emailOk = await checkEmailConfiguration();
    if (!emailOk) {
      rl.close();
      process.exit(0);
    }

    // Step 2: Reset database
    const resetOk = await resetDatabase();
    if (!resetOk) {
      rl.close();
      process.exit(0);
    }

    // Step 3: Show next steps
    showNextSteps();

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\n📚 Check documentation files for help\n');
    rl.close();
    process.exit(1);
  }
};

main();
