# 🚀 Quick Start Guide

Get AlloyMind AI up and running in under 10 minutes! This guide will help you quickly set up the development environment and start exploring the platform.

## ⚡ Prerequisites Check

Before starting, ensure you have:
- ✅ **Node.js 18+** (`node --version`)
- ✅ **Python 3.10+** (`python --version`)
- ✅ **MongoDB** (local or cloud)
- ✅ **Git** (`git --version`)

## 🏃‍♂️ Speed Setup (5 minutes)

### 1. Get the Code
```bash
git clone https://github.com/Raghulskr12/AlloyMindAI_SakthiHackathon.git
cd AlloyMindAI_SakthiHackathon
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your keys (see Configuration below)
```

### 3. Install & Run Frontend
```bash
# Install dependencies (choose one)
npm install     # or pnpm install

# Start development server
npm run dev
```
🌐 **Frontend**: http://localhost:3000

### 4. Install & Run Backend
```bash
# In a new terminal
cd Backend

# Create Python environment
python -m venv alloy_env
alloy_env\Scripts\activate  # Windows
# source alloy_env/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Start API server
python main.py
```
🚀 **Backend**: http://localhost:8000
📚 **API Docs**: http://localhost:8000/docs

## ⚙️ Quick Configuration

### Authentication (Clerk)
1. Sign up at [clerk.com](https://clerk.com) (free)
2. Create new application
3. Copy keys to `.env.local`:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Database (MongoDB)
```bash
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/alloymind

# Or MongoDB Atlas (cloud)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/alloymind
```

## 🎯 First Steps

### 1. Create Account
- Visit http://localhost:3000
- Click "Sign In" → "Sign Up"
- Complete registration

### 2. Explore Dashboard
- Navigate to **AI Console** for predictions
- Check **Analytics** for data insights
- Visit **Configuration** for settings

### 3. Test ML Models
```bash
# Test predictions via API
curl -X POST http://localhost:8000/predict/multi-grade \
  -H "Content-Type: application/json" \
  -d '{"carbon": 3.5, "silicon": 2.1, "manganese": 0.5}'
```

### 4. Explore Features
- **Real-time Analysis**: Upload alloy data for instant predictions
- **Historical Tracking**: View past analyses and trends
- **Performance Metrics**: Monitor system performance
- **Quality Control**: Set up automated quality checks

## 🔍 Verification Checklist

- [ ] Frontend loads at http://localhost:3000
- [ ] Backend API responds at http://localhost:8000
- [ ] Authentication works (sign up/in)
- [ ] Dashboard displays correctly
- [ ] ML models load without errors
- [ ] Database connections established

## 🐛 Quick Troubleshooting

### Port Already in Use
```bash
# Find and kill process
netstat -ano | findstr :3000  # Windows
lsof -ti:3000 | xargs kill    # macOS/Linux
```

### Python Environment Issues
```bash
# Recreate virtual environment
rm -rf alloy_env
python -m venv alloy_env
alloy_env\Scripts\activate
pip install -r requirements.txt
```

### MongoDB Connection
```bash
# Check MongoDB status
mongosh --eval "db.adminCommand('ismaster')"
```

### Clerk Authentication
- Verify keys in `.env.local`
- Check Clerk dashboard for application status
- Ensure webhook URL is configured

## 📱 Next Steps

Once everything is running:

1. **📖 Read the [User Guide](docs/user-guide.md)** - Complete feature walkthrough
2. **🔧 Check [Configuration](docs/configuration.md)** - Customize your setup
3. **🤖 Explore [ML Models](docs/ml-models.md)** - Understand the AI capabilities
4. **🚀 Review [Deployment](docs/deployment.md)** - Production setup

## 🆘 Need Help?

- **🐛 Issues**: [GitHub Issues](https://github.com/Raghulskr12/AlloyMindAI_SakthiHackathon/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/Raghulskr12/AlloyMindAI_SakthiHackathon/discussions)
- **📧 Email**: support@alloymind.ai
- **📖 Docs**: [Full Documentation](docs/README.md)

## 🏗️ Development Workflow

```bash
# Make changes to code
git checkout -b feature/my-feature

# Test your changes
npm run test          # Frontend tests
cd Backend && pytest # Backend tests

# Commit and push
git add .
git commit -m "feat: add amazing feature"
git push origin feature/my-feature
```

---

**Congratulations!** 🎉 You now have AlloyMind AI running locally. Ready to explore the future of intelligent metallurgy?

**⭐ Star the repo** if you find it useful and consider **🤝 contributing** to help improve the platform!
