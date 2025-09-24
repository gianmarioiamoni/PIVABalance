#!/bin/bash

echo "🔐 PIVABalance Login Test"
echo "========================="
echo

# Prompt for credentials
read -p "Enter SUPER_ADMIN_EMAIL: " email
read -s -p "Enter SUPER_ADMIN_PASSWORD: " password
echo
echo

echo "📡 Testing login API..."

# Test login API
response=$(curl -s -w "HTTP_STATUS:%{http_code}" \
  -X POST https://piva-balance.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$email\",\"password\":\"$password\"}")

# Extract status code
http_status=$(echo "$response" | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
body=$(echo "$response" | sed -E 's/HTTP_STATUS:[0-9]*$//')

echo "📋 HTTP Status: $http_status"
echo "📋 Response:"
echo "$body" | jq . 2>/dev/null || echo "$body"
echo

# Interpret results
if [ "$http_status" = "200" ]; then
    echo "✅ LOGIN SUCCESS! The super admin is working."
    echo "🎯 You can now login via the web interface."
elif [ "$http_status" = "401" ]; then
    echo "❌ LOGIN FAILED - Wrong credentials or user not found"
    echo "🔧 Check your SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD in Vercel"
elif [ "$http_status" = "500" ]; then
    echo "❌ SERVER ERROR - Database or internal issue"
    echo "🔧 Check Vercel function logs for details"
else
    echo "❓ UNEXPECTED STATUS: $http_status"
fi
