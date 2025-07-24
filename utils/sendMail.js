const nodemailer = require('nodemailer');

// 🔧 Enhanced Email Configuration with Debugging
const createEmailTransporter = () => {
  console.log('🚀 Creating Email Transporter:', {
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 587,
    emailUser: process.env.EMAIL_USER,
    hasEmailPass: !!process.env.EMAIL_PASS,
    timestamp: new Date().toISOString()
  });

  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    // Enable debugging for VPS troubleshooting
    debug: true,
    logger: true,
    // Connection timeouts
    connectionTimeout: 60000, // 60 seconds
    greetingTimeout: 30000,   // 30 seconds
    socketTimeout: 60000,     // 60 seconds
    // TLS options for VPS compatibility
    tls: {
      rejectUnauthorized: false,
      ciphers: 'SSLv3'
    },
    // Additional options for VPS
    pool: true,
    maxConnections: 5,
    maxMessages: 100
  });

  // Test connection on startup
  transporter.verify((error, success) => {
    if (error) {
      console.error('❌ Email Transporter Verification Failed:', {
        error: error.message,
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        troubleshooting: {
          possibleCauses: [
            'Invalid email credentials',
            'VPS firewall blocking SMTP ports',
            'Gmail app password not configured',
            'Network connectivity issues'
          ]
        }
      });
    } else {
      console.log('✅ Email Transporter Ready:', {
        success: true,
        service: 'Gmail SMTP',
        host: 'smtp.gmail.com',
        port: 587,
        user: process.env.EMAIL_USER,
        timestamp: new Date().toISOString()
      });
    }
  });

  return transporter;
};

// 📧 Enhanced OTP Send Function with Complete Error Handling
async function sendOtpMail(email, otp) {
  console.log('🔄 Starting OTP Email Send Process:', {
    email: email,
    otpLength: otp ? otp.length : 'undefined',
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      emailUser: process.env.EMAIL_USER,
      hasEmailPass: !!process.env.EMAIL_PASS
    }
  });

  try {
    // Validate environment variables
    if (!process.env.EMAIL_USER) {
      throw new Error('EMAIL_USER environment variable is not set');
    }
    if (!process.env.EMAIL_PASS) {
      throw new Error('EMAIL_PASS environment variable is not set');
    }
    if (!email) {
      throw new Error('Recipient email is required');
    }
    if (!otp) {
      throw new Error('OTP is required');
    }

    console.log('✅ Environment variables validated successfully');

    // Create transporter
    const transporter = createEmailTransporter();

    // Enhanced mail options
    const mailOptions = {
      from: {
        name: 'Star Traders',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Your OTP - Star Traders',
      text: `Your OTP is: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Star Traders - OTP Verification</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <div style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; color: #333; border-radius: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #666;">This OTP will expire in 10 minutes.</p>
          <p style="color: #666; font-size: 12px;">If you didn't request this OTP, please ignore this email.</p>
        </div>
      `,
      // Additional headers for better delivery
      headers: {
        'X-Mailer': 'StarTraders-VPS',
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    };

    console.log('📧 Mail Options Prepared:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      hasHTML: !!mailOptions.html,
      hasText: !!mailOptions.text,
      timestamp: new Date().toISOString()
    });

    // Send email with detailed timing
    console.log('📤 Attempting to send email via SMTP...');
    const startTime = Date.now();
    
    const info = await transporter.sendMail(mailOptions);
    
    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log('✅ Email sent successfully:', {
      messageId: info.messageId,
      response: info.response,
      envelope: info.envelope,
      accepted: info.accepted,
      rejected: info.rejected,
      pending: info.pending,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      emailProvider: 'Gmail SMTP'
    });

    return {
      success: true,
      messageId: info.messageId,
      response: info.response,
      duration,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    // 🔍 Comprehensive Error Analysis & Logging
    const errorDetails = {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        emailUser: process.env.EMAIL_USER,
        hasEmailPass: !!process.env.EMAIL_PASS,
        recipientEmail: email,
        otpProvided: !!otp
      }
    };

    console.error('❌ Email Send Failed - Comprehensive Error Analysis:', errorDetails);

    // 🌐 Network & Connectivity Issues
    if (error.code === 'ECONNREFUSED') {
      console.error('🌐 Connection Refused Error:', {
        issue: 'Cannot connect to SMTP server',
        possibleCauses: [
          'VPS firewall blocking SMTP port 587',
          'ISP blocking outgoing SMTP traffic',
          'Gmail SMTP server temporarily unavailable',
          'Network connectivity issues on VPS'
        ],
        diagnosticCommands: [
          'telnet smtp.gmail.com 587',
          'nslookup smtp.gmail.com',
          'iptables -L | grep 587',
          'ufw status',
          'netstat -tlnp | grep :587'
        ],
        vpsSpecificSolutions: [
          'Configure VPS firewall to allow port 587',
          'Contact VPS provider about SMTP restrictions',
          'Try alternative SMTP ports (465, 25)',
          'Check VPS network configuration'
        ]
      });
    }

    // ⏱️ Timeout Issues
    if (error.code === 'ETIMEDOUT') {
      console.error('⏱️ Connection Timeout Error:', {
        issue: 'SMTP connection timed out',
        possibleCauses: [
          'Slow network connection on VPS',
          'SMTP server overloaded',
          'Firewall dropping packets',
          'DNS resolution issues'
        ],
        diagnosticCommands: [
          'ping smtp.gmail.com',
          'traceroute smtp.gmail.com',
          'dig smtp.gmail.com',
          'nslookup smtp.gmail.com'
        ],
        vpsSpecificSolutions: [
          'Check VPS network speed',
          'Increase connection timeout values',
          'Try different DNS servers',
          'Contact VPS provider about network issues'
        ]
      });
    }

    // 🔐 Authentication Issues
    if (error.code === 'EAUTH' || error.responseCode === 535) {
      console.error('🔐 Authentication Error:', {
        issue: 'SMTP authentication failed',
        possibleCauses: [
          'Incorrect email credentials in .env file',
          'Gmail App Password not generated',
          '2-Factor Authentication not enabled',
          'Less secure app access disabled'
        ],
        envCheck: {
          emailUser: process.env.EMAIL_USER,
          emailPassLength: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0,
          emailPassFormat: process.env.EMAIL_PASS ? 'Present' : 'Missing'
        },
        requiredSteps: [
          '1. Enable 2FA on Gmail account',
          '2. Generate App Password in Google Account Security',
          '3. Use App Password (not regular password) in .env',
          '4. Verify EMAIL_USER and EMAIL_PASS in .env file'
        ]
      });
    }

    // 🔍 DNS Resolution Issues
    if (error.code === 'ENOTFOUND') {
      console.error('🔍 DNS Resolution Error:', {
        issue: 'Cannot resolve SMTP server hostname',
        possibleCauses: [
          'DNS configuration issues on VPS',
          'Internet connectivity problems',
          'Firewall blocking DNS queries'
        ],
        diagnosticCommands: [
          'nslookup smtp.gmail.com',
          'dig smtp.gmail.com',
          'cat /etc/resolv.conf',
          'systemctl status systemd-resolved'
        ],
        vpsSpecificSolutions: [
          'Configure proper DNS servers',
          'Check VPS network configuration',
          'Restart DNS service on VPS'
        ]
      });
    }

    // 📨 Rate Limiting Issues
    if (error.responseCode === 421 || error.response?.includes('rate limit')) {
      console.error('📨 Rate Limiting Error:', {
        issue: 'Gmail SMTP rate limit exceeded',
        possibleCauses: [
          'Too many emails sent in short time',
          'Gmail daily sending limit reached',
          'Suspicious activity detected'
        ],
        solutions: [
          'Wait before sending next email',
          'Implement email queue system',
          'Use multiple email accounts for load distribution',
          'Contact Gmail support for limit increase'
        ]
      });
    }

    // 🛠️ General Troubleshooting Information
    console.error('🛠️ VPS Email Troubleshooting Guide:', {
      environmentChecklist: [
        '✓ EMAIL_USER set correctly in .env',
        '✓ EMAIL_PASS is Gmail App Password (not regular password)',
        '✓ Gmail 2FA enabled',
        '✓ App Password generated from Google Account'
      ],
      vpsNetworkChecklist: [
        '✓ Port 587 not blocked by firewall',
        '✓ DNS resolution working',
        '✓ Internet connectivity available',
        '✓ No ISP SMTP restrictions'
      ],
      debuggingCommands: [
        'pm2 logs server --lines 100',
        'curl -v smtp.gmail.com:587',
        'telnet smtp.gmail.com 587',
        'systemctl status nginx',
        'ufw status verbose'
      ]
    });

    // Return structured error for API response
    const apiError = {
      success: false,
      error: {
        type: error.code || 'UNKNOWN_ERROR',
        message: error.message,
        details: errorDetails,
        userMessage: 'Failed to send OTP email. Please try again or contact support.',
        timestamp: new Date().toISOString()
      }
    };

    // Throw error with structured information
    throw apiError;
  }
}

module.exports = { sendOtpMail };equire('nodemailer');

async function sendOtpMail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `Star Traders <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP - Star Traders',
    text: `Your OTP is: ${otp}`
  });
}

module.exports = { sendOtpMail };
