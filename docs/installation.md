# Installation Guide

This guide will walk you through installing AlloyMind AI on your local development environment or production server.

## 📋 System Requirements

### Minimum Requirements
- **OS**: Windows 10/11, macOS 12+, or Ubuntu 20.04+
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 10GB free space
- **Network**: Internet connection for dependencies

### Software Prerequisites
- **Node.js**: 18.0 or higher
- **Python**: 3.10 or higher
- **MongoDB**: 6.0 or higher
- **Git**: Latest version

## 🚀 Installation Methods

### Method 1: Local Development Setup (Recommended)

#### Step 1: Clone Repository

```bash
# Clone the repository
git clone https://github.com/Raghulskr12/AlloyMindAI_SakthiHackathon.git

# Navigate to project directory
cd AlloyMindAI_SakthiHackathon
```

#### Step 2: Frontend Setup

```bash
# Install Node.js dependencies
npm install
# or using pnpm (recommended for faster installs)
pnpm install

# Copy environment configuration
cp .env.example .env.local

# Edit .env.local with your configuration
# See Configuration section below for details
```

#### Step 3: Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Create Python virtual environment
python -m venv alloy_env

# Activate virtual environment
# On Windows:
alloy_env\Scripts\activate
# On macOS/Linux:
source alloy_env/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

#### Step 4: Database Setup

```bash
# Install MongoDB (if not already installed)
# On Windows: Download from https://www.mongodb.com/try/download/community
# On macOS: brew install mongodb-community
# On Ubuntu: sudo apt install mongodb

# Start MongoDB service
# On Windows: Run as service or mongod command
# On macOS: brew services start mongodb-community
# On Ubuntu: sudo systemctl start mongod

# Create database (optional - will be created automatically)
mongosh
use alloymind
exit
```

#### Step 5: Start Development Servers

**Terminal 1 (Frontend):**
```bash
npm run dev
# Frontend will be available at http://localhost:3000
```

**Terminal 2 (Backend):**
```bash
cd Backend
python main.py
# Backend API will be available at http://localhost:8000
# API documentation at http://localhost:8000/docs
```

### Method 2: Docker Setup

#### Prerequisites
- **Docker**: 20.0 or higher
- **Docker Compose**: 2.0 or higher

#### Quick Start with Docker

```bash
# Clone repository
git clone https://github.com/Raghulskr12/AlloyMindAI_SakthiHackathon.git
cd AlloyMindAI_SakthiHackathon

# Copy environment file
cp .env.example .env.local

# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- MongoDB: localhost:27017

## ⚙️ Configuration

### Environment Variables

Edit `.env.local` with your configuration:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/alloymind
MONGODB_DB=alloymind

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
API_SECRET_KEY=your_api_secret

# Environment
NODE_ENV=development
```

### Clerk Authentication Setup

1. **Create Clerk Account**
   - Visit [clerk.com](https://clerk.com)
   - Sign up for a free account
   - Create a new application

2. **Get API Keys**
   - Copy your publishable key
   - Copy your secret key
   - Add webhook endpoint: `http://localhost:3000/api/webhooks/clerk`

3. **Configure Authentication**
   ```bash
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

### MongoDB Configuration

#### Local MongoDB
```bash
# Default local configuration
MONGODB_URI=mongodb://localhost:27017/alloymind
```

#### MongoDB Atlas (Cloud)
```bash
# Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/alloymind
```

## ✅ Verification

### Check Installation

1. **Frontend Health Check**
   ```bash
   curl http://localhost:3000
   # Should return the landing page HTML
   ```

2. **Backend Health Check**
   ```bash
   curl http://localhost:8000
   # Should return: {"message": "AlloyMind Element Configuration API", "version": "1.0.0"}
   ```

3. **Database Connection**
   ```bash
   # Check MongoDB connection
   mongosh mongodb://localhost:27017/alloymind
   # Should connect successfully
   ```

### Test ML Models

```bash
# Navigate to backend directory
cd Backend

# Test ASTM A536 model
python astma536_updated_cli.py

# Test ASTM A395 model
python astma395_updated_cli.py

# Test multi-grade model
python element_config_cli.py
```

## 🔧 Troubleshooting

### Common Issues

#### Node.js Version Issues
```bash
# Check Node.js version
node --version

# Install specific version using nvm
nvm install 18.0.0
nvm use 18.0.0
```

#### Python Dependencies
```bash
# If pip install fails, try upgrading pip
python -m pip install --upgrade pip

# Install dependencies with verbose output
pip install -r requirements.txt -v
```

#### MongoDB Connection
```bash
# Check if MongoDB is running
# Windows: Check Services
# macOS: brew services list | grep mongodb
# Ubuntu: systemctl status mongod

# Test connection
mongosh --eval "db.adminCommand('ismaster')"
```

#### Port Conflicts
```bash
# Check if ports are in use
# Windows: netstat -an | findstr :3000
# macOS/Linux: lsof -i :3000

# Kill processes using ports
# Windows: taskkill /PID <pid> /F
# macOS/Linux: kill -9 <pid>
```

### Memory Issues

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=8192"

# Or set in package.json scripts
"dev": "NODE_OPTIONS='--max-old-space-size=8192' next dev"
```

### Permission Issues

```bash
# On macOS/Linux, fix npm permissions
sudo chown -R $(whoami) ~/.npm

# Or use a different npm registry
npm config set registry https://registry.npmjs.org/
```

## 📦 Optional Dependencies

### Development Tools
```bash
# Install additional development tools
npm install -g typescript @types/node eslint prettier

# Backend development tools
pip install black flake8 pytest pytest-cov
```

### Monitoring Tools
```bash
# Install PM2 for process management
npm install -g pm2

# Use PM2 to run backend
pm2 start Backend/main.py --name alloymind-api --interpreter python
```

## 🎯 Next Steps

After successful installation:

1. **Read the [Quick Start Guide](quickstart.md)**
2. **Explore the [User Manual](user-guide.md)**
3. **Check the [API Documentation](api-reference.md)**
4. **Review [Configuration Options](configuration.md)**

## 📞 Support

If you encounter issues during installation:

- **Check**: [Troubleshooting Guide](troubleshooting.md)
- **Search**: [GitHub Issues](https://github.com/Raghulskr12/AlloyMindAI_SakthiHackathon/issues)
- **Ask**: [GitHub Discussions](https://github.com/Raghulskr12/AlloyMindAI_SakthiHackathon/discussions)
- **Email**: support@alloymind.ai

---

**Congratulations!** 🎉 You've successfully installed AlloyMind AI. Time to explore the intelligent metallurgy platform!
