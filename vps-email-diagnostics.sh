#!/bin/bash

echo "🔍 Checking Email Port (587)..."
nc -zv smtp.gmail.com 587

echo ""
echo "� Sending test email using Node.js script..."
node test-email.js
