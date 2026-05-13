const nodemailer = require('nodemailer');
require('dotenv').config();

const testEmailConfiguration = async () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 Testing Email Configuration');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Check environment variables
  console.log('🔍 Checking environment variables...');
  console.log(`   EMAIL_HOST: ${process.env.EMAIL_HOST || '❌ NOT SET'}`);
  console.log(`   EMAIL_PORT: ${process.env.EMAIL_PORT || '❌ NOT SET'}`);
  console.log(`   EMAIL_USER: ${process.env.EMAIL_USER || '❌ NOT SET'}`);
  console.log(`   EMAIL_PASS: ${process.env.EMAIL_PASS ? '✅ SET (hidden)' : '❌ NOT SET'}\n`);

  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Email configuration incomplete!');
    console.log('\n📝 Please update backend/.env with:');
    console.log('   EMAIL_HOST=smtp.gmail.com');
    console.log('   EMAIL_PORT=587');
    console.log('   EMAIL_USER=absence.clothiers@gmail.com');
    console.log('   EMAIL_PASS=your_gmail_app_password\n');
    console.log('📚 See CONTACT_INFO.md for Gmail App Password setup\n');
    process.exit(1);
  }

  // Create transporter
  console.log('🔧 Creating email transporter...');
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
    // Verify connection
    console.log('🔌 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');

    // Send test email
    console.log('📤 Sending test email...');
    const testEmail = {
      from: `ABSENCE <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to self for testing
      subject: '✅ ABSENCE Email Configuration Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #000000 0%, #434343 100%); padding: 30px; text-align: center;">
            <h1 style="color: #D4AF37; margin: 0; font-size: 32px;">ABSENCE</h1>
            <p style="color: white; margin: 10px 0 0 0;">Premium Streetwear</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">✅ Email Configuration Successful!</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Your email configuration is working correctly. The system is ready to send:
            </p>
            
            <ul style="color: #666; line-height: 1.8;">
              <li>Order confirmation emails</li>
              <li>Order status updates</li>
              <li>Delivery notifications</li>
              <li>Referral commission alerts</li>
              <li>Password reset emails</li>
              <li>Welcome emails</li>
            </ul>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Configuration Details:</h3>
              <p style="color: #666; margin: 5px 0;"><strong>Host:</strong> ${process.env.EMAIL_HOST}</p>
              <p style="color: #666; margin: 5px 0;"><strong>Port:</strong> ${process.env.EMAIL_PORT}</p>
              <p style="color: #666; margin: 5px 0;"><strong>From:</strong> ${process.env.EMAIL_USER}</p>
              <p style="color: #666; margin: 5px 0;"><strong>Status:</strong> <span style="color: #22c55e;">✅ Active</span></p>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              <strong>Note:</strong> If you received this email, your email system is configured correctly and ready for production!
            </p>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              ABSENCE Streetwear Pvt. Ltd.<br>
              absence.clothiers@gmail.com<br>
              © 2024 All rights reserved
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log(`   Message ID: ${info.messageId}\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Email Configuration Test Complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ Email system is ready for production!');
    console.log(`📧 Check inbox: ${process.env.EMAIL_USER}`);
    console.log('📝 Check spam folder if not in inbox\n');

  } catch (error) {
    console.error('❌ Email test failed!');
    console.error(`   Error: ${error.message}\n`);
    
    if (error.code === 'EAUTH') {
      console.log('🔐 Authentication failed. Common issues:');
      console.log('   1. Incorrect email or password');
      console.log('   2. Need to use Gmail App Password (not regular password)');
      console.log('   3. 2-Step Verification not enabled\n');
      console.log('📚 See CONTACT_INFO.md for Gmail App Password setup\n');
    } else if (error.code === 'ECONNECTION') {
      console.log('🌐 Connection failed. Check:');
      console.log('   1. Internet connection');
      console.log('   2. SMTP host and port');
      console.log('   3. Firewall settings\n');
    }
    
    process.exit(1);
  }
};

testEmailConfiguration();
