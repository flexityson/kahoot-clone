#!/bin/bash

echo "🚀 Installing Kahoot Clone..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend installation failed"
    exit 1
fi

# Create .env if not exists
if [ ! -f .env ]; then
    echo "📝 Creating backend .env..."
    cp .env.example .env
    echo "⚠️  Remember to set your GROQ_API_KEY in backend/.env"
fi

# Setup database
echo "🗄️  Setting up database..."
npx prisma db push
npx prisma db seed

cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend installation failed"
    exit 1
fi

# Create .env if not exists
if [ ! -f .env ]; then
    cp .env.example .env
fi

cd ..

echo ""
echo "✅ Installation complete!"
echo ""
echo "To start:"
echo "  Terminal 1 (Backend):  cd backend && npm run dev"
echo "  Terminal 2 (Frontend): cd frontend && npm run dev"
echo ""
echo "Test accounts:"
echo "  Teacher: teacher@example.com / teacher123"
echo "  Student: student@example.com / student123"
