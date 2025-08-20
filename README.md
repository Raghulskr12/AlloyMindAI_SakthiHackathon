# 🧬 AlloyMind AI - Intelligent Metallurgy Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=flat&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776ab?style=flat&logo=python)](https://python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6?style=flat&logo=typescript)](https://typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Transform your metallurgical operations with AI-powered real-time analysis, predictive recommendations, and automated quality control for optimal alloy composition.**

## 🎯 Overview

AlloyMind AI is a comprehensive metallurgical intelligence platform that leverages machine learning to optimize alloy composition, predict material properties, and enhance quality control processes. Built for the modern foundry, it combines cutting-edge AI with practical metallurgical expertise.

### 🌟 Key Features

- **🤖 AI-Powered Analysis**: Real-time alloy composition optimization using ensemble ML models
- **📊 Predictive Analytics**: Advanced forecasting for material properties and performance
- **⚡ Real-time Monitoring**: Live dashboard for metallurgical process tracking
- **🔬 Multi-Standard Support**: Compatible with ASTM A395, ASTM A536, and EN1563 standards
- **📱 Mobile Responsive**: Access insights anywhere with responsive design
- **🛡️ Quality Control**: Automated anomaly detection and quality assurance
- **📈 Performance Metrics**: Comprehensive analytics and reporting

## 🏗️ Architecture

```
AlloyMind AI Platform
├── Frontend (Next.js 15)     │ Modern React-based UI
├── Backend (FastAPI)         │ High-performance ML API
├── ML Models                 │ Specialized alloy prediction models
└── Database (MongoDB)        │ Scalable data storage
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0+ 
- **Python** 3.10+
- **MongoDB** 6.0+
- **Git**

### 1. Clone Repository

```bash
git clone https://github.com/Raghulskr12/AlloyMindAI_SakthiHackathon.git
cd AlloyMindAI_SakthiHackathon
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install
# or
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

### 3. Backend Setup

```bash
# Navigate to backend
cd Backend

# Create virtual environment
python -m venv alloy_env
source alloy_env/bin/activate  # On Windows: alloy_env\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
python main.py
```

### 4. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📁 Project Structure

```
AlloyMind AI/
├── 📂 app/                          # Next.js App Router
│   ├── 📂 api/                      # API Routes
│   │   ├── 📂 alloys/              # Alloy management endpoints
│   │   ├── 📂 analytics/           # Analytics API
│   │   └── 📂 logs/                # Logging endpoints
│   ├── 📂 auth/                     # Authentication pages
│   ├── 📂 dashboard/                # Main application UI
│   │   ├── 📂 ai-console/          # AI interaction interface
│   │   ├── 📂 analytics/           # Data visualization
│   │   ├── 📂 config/              # Configuration management
│   │   ├── 📂 history/             # Historical data view
│   │   └── 📂 performance/         # Performance metrics
│   └── layout.tsx                   # Root layout
│
├── 📂 Backend/                      # FastAPI Backend
│   ├── 📂 CLI/                     # Command-line interfaces
│   ├── 📂 *_Dataset_with_ElementConfig/ # Training datasets
│   ├── main.py                     # FastAPI application entry
│   ├── *.pkl                       # Trained ML models
│   ├── *_cli.py                    # Model-specific CLIs
│   └── requirements.txt            # Python dependencies
│
├── 📂 components/                   # Reusable React components
│   ├── 📂 ui/                      # UI component library
│   ├── app-sidebar.tsx             # Navigation sidebar
│   └── header.tsx                  # Application header
│
├── 📂 lib/                         # Utility libraries
│   ├── 📂 services/                # Service layer
│   ├── mongodb.ts                  # Database connection
│   └── utils.ts                    # Helper functions
│
├── 📂 types/                       # TypeScript type definitions
├── 📂 hooks/                       # Custom React hooks
├── 📂 public/                      # Static assets
└── 📂 docs/                        # Documentation
```

## 🤖 Machine Learning Models

AlloyMind AI incorporates three specialized ensemble models:

### 1. Multi-Grade Element Configuration Model
- **Standards**: EN1563, ASTM A536, ASTM A395
- **Algorithm**: Ensemble (LightGBM + CatBoost + RandomForest)
- **Use Case**: General-purpose alloy optimization

### 2. ASTM A536 Updated Model
- **Specialization**: High Phosphorus targets (0.40%)
- **Optimization**: Enhanced for ductile iron applications
- **Features**: Advanced phosphorus content prediction

### 3. ASTM A395 Updated Model  
- **Specialization**: High Manganese (0.725%) + Zero Phosphorus (0.0%)
- **Optimization**: Ferritic ductile iron applications
- **Features**: Precise manganese-phosphorus balance

## 🔧 API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | API health check |
| `POST` | `/predict/multi-grade` | Multi-standard prediction |
| `POST` | `/predict/astma536` | ASTM A536 specialized prediction |
| `POST` | `/predict/astma395` | ASTM A395 specialized prediction |
| `GET` | `/models/info` | Model metadata and statistics |

### Frontend API Routes

| Route | Description |
|-------|-------------|
| `/api/alloys` | Alloy data management |
| `/api/analytics` | Performance analytics |
| `/api/logs` | System logging and audit trails |

## 🌐 Deployment

### Production Build

```bash
# Frontend
npm run build
npm start

# Backend
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Environment Variables

Create `.env.local` in the root directory:

```env
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

## 🧪 Testing

```bash
# Frontend tests
npm run test

# Backend tests
cd Backend
python -m pytest tests/

# API testing
python test_api.py
```

## 📊 Key Technologies

### Frontend Stack
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Clerk** - Authentication and user management
- **Radix UI** - Accessible component primitives
- **Lucide React** - Modern iconography

### Backend Stack
- **FastAPI** - High-performance API framework
- **Pydantic** - Data validation and serialization
- **Scikit-learn** - Machine learning library
- **LightGBM** - Gradient boosting framework
- **CatBoost** - Categorical feature handling
- **Pandas** - Data manipulation and analysis

### Database & Infrastructure
- **MongoDB** - Document-based database
- **Uvicorn** - ASGI server implementation
- **Joblib** - Model serialization and parallel processing

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Lead Developer**: [Raghulskr12](https://github.com/Raghulskr12)
- **Project**: Sakthi Hackathon Submission

## 🆘 Support

- 📧 **Email**: support@alloymind.ai
- 🐛 **Issues**: [GitHub Issues](https://github.com/Raghulskr12/AlloyMindAI_SakthiHackathon/issues)
- 📖 **Documentation**: [Project Wiki](https://github.com/Raghulskr12/AlloyMindAI_SakthiHackathon/wiki)

## 🎉 Acknowledgments

- Sakthi Hackathon organizers
- Open source ML community
- Metallurgical engineering experts who provided domain knowledge

---

<div align="center">

**Built with ❤️ for the future of intelligent metallurgy**

[⭐ Star this repo](https://github.com/Raghulskr12/AlloyMindAI_SakthiHackathon) | [🍴 Fork it](https://github.com/Raghulskr12/AlloyMindAI_SakthiHackathon/fork) | [📧 Contact us](mailto:support@alloymind.ai)

</div>