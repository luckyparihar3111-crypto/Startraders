#!/bin/bash

echo "🔍 StarTraders VPS Email Diagnostics"
echo "====================================="
echo "Timestamp: $(date)"
echo "Host: $(hostname)"
echo ""

echo "1. 🌐 Network Connectivity Tests:"
echo "--------------------------------"

# Test SMTP ports
echo "Testing Gmail SMTP port 587..."
timeout 10 bash -c "</dev/tcp/smtp.gmail.com/587" && echo "✅ Port 587 accessible" || echo "❌ Port 587 blocked/unreachable"

echo "Testing Gmail SMTP port 465..."
timeout 10 bash -c "</dev/tcp/smtp.gmail.com/465" && echo "✅ Port 465 accessible" || echo "❌ Port 465 blocked/unreachable"

echo "Testing Gmail SMTP port 25..."
timeout 10 bash -c "</dev/tcp/smtp.gmail.com/25" && echo "✅ Port 25 accessible" || echo "❌ Port 25 blocked/unreachable"

echo ""
echo "2. 🔍 DNS Resolution Tests:"
echo "--------------------------"
echo "Resolving smtp.gmail.com..."
nslookup smtp.gmail.com || echo "❌ DNS resolution failed"

echo ""
echo "Testing with dig..."
dig smtp.gmail.com A +short || echo "❌ dig command failed"

echo ""
echo "3. 🔥 Firewall Status:"
echo "--------------------"
echo "UFW Status:"
ufw status || echo "❌ UFW not available"

echo ""
echo "Checking iptables for SMTP ports:"
iptables -L | grep -E "(587|465|25)" || echo "No specific SMTP rules found"

echo ""
echo "4. 📦 System Information:"
echo "------------------------"
echo "Node.js version: $(node -v 2>/dev/null || echo 'Node.js not found')"
echo "NPM version: $(npm -v 2>/dev/null || echo 'NPM not found')"
echo "PM2 version: $(pm2 -v 2>/dev/null || echo 'PM2 not found')"

echo ""
echo "5. 🚀 PM2 Process Status:"
echo "------------------------"
pm2 list || echo "❌ PM2 not running or not available"

echo ""
echo "6. 🌍 Environment Variables Check:"
echo "--------------------------------"
echo "NODE_ENV: ${NODE_ENV:-'Not set'}"

# Check if .env file exists
if [ -f ".env" ]; then
    echo "✅ .env file exists"
    echo "EMAIL_USER set: $(grep -q "EMAIL_USER=" .env && echo "✅ Yes" || echo "❌ No")"
    echo "EMAIL_PASS set: $(grep -q "EMAIL_PASS=" .env && echo "✅ Yes" || echo "❌ No")"
else
    echo "❌ .env file not found"
fi

echo ""
echo "7. 📊 Network Interface Information:"
echo "-----------------------------------"
ip addr show | grep -E "(inet|eth|ens)" || echo "❌ Network interface info not available"

echo ""
echo "8. 🧪 SMTP Connection Test:"
echo "--------------------------"
echo "Testing SMTP connection with telnet..."
timeout 10 telnet smtp.gmail.com 587 2>/dev/null << EOF
QUIT
EOF
if [ $? -eq 0 ]; then
    echo "✅ SMTP connection successful"
else
    echo "❌ SMTP connection failed"
fi

echo ""
echo "9. 📝 Recent PM2 Logs (Email related):"
echo "-------------------------------------"
if command -v pm2 &> /dev/null; then
    echo "Last 20 lines containing 'email', 'otp', or 'mail':"
    pm2 logs --lines 100 | grep -i -E "(email|otp|mail|smtp)" | tail -20 || echo "No email-related logs found"
else
    echo "❌ PM2 not available"
fi

echo ""
echo "10. 🔧 System Resource Usage:"
echo "----------------------------"
echo "Memory usage:"
free -h || echo "❌ Memory info not available"

echo ""
echo "Disk usage:"
df -h | head -5 || echo "❌ Disk info not available"

echo ""
echo "11. 🌐 Internet Connectivity Test:"
echo "---------------------------------"
echo "Testing Google DNS (8.8.8.8)..."
ping -c 3 8.8.8.8 >/dev/null 2>&1 && echo "✅ Internet connectivity OK" || echo "❌ No internet connectivity"

echo "Testing Gmail SMTP server ping..."
ping -c 3 smtp.gmail.com >/dev/null 2>&1 && echo "✅ Gmail SMTP server reachable" || echo "❌ Gmail SMTP server unreachable"

echo ""
echo "12. 🔍 Process Information:"
echo "-------------------------"
echo "Processes listening on SMTP ports:"
netstat -tlnp 2>/dev/null | grep -E "(587|465|25)" || echo "No processes listening on SMTP ports"

echo ""
echo "Node.js processes:"
ps aux | grep node | grep -v grep || echo "No Node.js processes found"

echo ""
echo "================================================"
echo "✅ Diagnostics Complete!"
echo "================================================"
echo ""
echo "📋 Quick Troubleshooting Steps:"
echo "1. If ports are blocked: sudo ufw allow 587"
echo "2. If DNS fails: Add '8.8.8.8' to /etc/resolv.conf"
echo "3. If auth fails: Check Gmail App Password"
echo "4. If connection fails: Contact VPS provider"
echo ""
echo "🧪 Test OTP API directly:"
echo "curl -X POST https://startradersindia.in/api/user/send-withdraw-otp \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"email\":\"test@gmail.com\"}'"
