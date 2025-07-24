// 🧪 VPS Email Test Script
// Run this script to test email functionality directly on VPS
// Usage: node test-email.js

require('dotenv').config();
const { sendOtpMail } = require('./utils/sendMail');

console.log('🧪 StarTraders Email Test Script');
console.log('================================');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Timestamp:', new Date().toISOString());
console.log('');

// Test email configuration
console.log('📧 Email Configuration:');
console.log('EMAIL_USER:', process.env.EMAIL_USER || '❌ Not set');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set (length: ' + process.env.EMAIL_PASS.length + ')' : '❌ Not set');
console.log('');

async function testEmail() {
  try {
    // Change this to your test email
    const testEmail = 'your-test-email@gmail.com';
    console.log('🔄 Testing email send to:', testEmail);
    console.log('⚠️  Make sure to change testEmail variable to your actual email!');
    console.log('');

    if (testEmail === 'your-test-email@gmail.com') {
      console.log('❌ Please update the testEmail variable in this script with your actual email address');
      process.exit(1);
    }

    const testOtp = '123456';
    
    console.log('📤 Attempting to send test OTP...');
    const result = await sendOtpMail(testEmail, testOtp);
    
    console.log('✅ Email sent successfully!');
    console.log('Result:', result);
    console.log('');
    console.log('🎉 Email system is working correctly on VPS!');
    
  } catch (error) {
    console.log('❌ Email test failed!');
    console.log('Error details:', error);
    console.log('');
    console.log('🔍 Check the detailed error logs above for troubleshooting');
    console.log('📋 Run the diagnostics script: ./vps-email-diagnostics.sh');
  }
}

// Run the test
testEmail().then(() => {
  console.log('');
  console.log('📋 Test completed. Check logs above for results.');
  process.exit(0);
}).catch(err => {
  console.error('Test script error:', err);
  process.exit(1);
});
