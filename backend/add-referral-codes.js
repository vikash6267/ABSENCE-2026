require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

async function addReferralCodes() {
  try {
    // Find all users without referral code
    const usersWithoutCode = await User.find({ 
      $or: [
        { referralCode: { $exists: false } },
        { referralCode: null },
        { referralCode: '' }
      ]
    });

    console.log(`\n📋 Found ${usersWithoutCode.length} users without referral code\n`);

    if (usersWithoutCode.length === 0) {
      console.log('✅ All users already have referral codes!');
      process.exit(0);
    }

    let updated = 0;
    for (const user of usersWithoutCode) {
      // Generate referral code
      const name = user.name.replace(/\s+/g, '').toUpperCase().substring(0, 4);
      const random = Math.random().toString(36).substring(2, 6).toUpperCase();
      const referralCode = `${name}${random}`;
      
      // Check if code already exists
      const existingCode = await User.findOne({ referralCode });
      if (existingCode) {
        // Generate new random part if duplicate
        const newRandom = Math.random().toString(36).substring(2, 6).toUpperCase();
        user.referralCode = `${name}${newRandom}`;
      } else {
        user.referralCode = referralCode;
      }
      
      // Update directly without validation
      await User.updateOne(
        { _id: user._id },
        { $set: { referralCode: user.referralCode } }
      );
      updated++;
      
      console.log(`✅ ${updated}. ${user.name} (${user.email}) → ${user.referralCode}`);
    }

    console.log(`\n🎉 Successfully added referral codes to ${updated} users!`);
    
    // Show all users with their codes
    console.log('\n📊 All Users with Referral Codes:\n');
    const allUsers = await User.find({}).select('name email referralCode role');
    allUsers.forEach((user, idx) => {
      console.log(`${idx + 1}. ${user.name} (${user.email})`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Referral Code: ${user.referralCode}`);
      console.log(`   Referral Link: ${process.env.FRONTEND_URL}/product/[slug]?ref=${user._id}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addReferralCodes();
