# AlloyMind AI - Intelligent Alloy Element Configuration System

## Overview

AlloyMind AI is a sophisticated machine learning system designed for optimal alloy element configuration prediction and optimization. The system uses ensemble ML models to predict element configurations for different alloy grades, enabling precise metallurgical control and cost optimization.

## 🚀 Key Features

- **Multi-Grade Support**: EN1563, ASTMA536, ASTMA395 with specialized variants
- **Ensemble ML Models**: LightGBM + CatBoost for superior accuracy
- **Real-time API**: FastAPI-based REST API for instant predictions
- **Cost Optimization**: Built-in cost analysis and recommendations
- **High Accuracy**: 99.9%+ R² scores across all element predictions

## 📋 Table of Contents

- [Architecture](#architecture)
- [ML Models](#ml-models)
- [API Documentation](#api-documentation)
- [Installation](#installation)
- [Usage](#usage)
- [Model Performance](#model-performance)
- [Contributing](#contributing)

## 🏗️ Architecture

### System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   FastAPI       │    │   Ensemble       │    │   Prediction    │
│   Web Server    │◄──►│   ML Models      │◄──►│   Engine        │
│                 │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   REST API      │    │   LightGBM +     │    │   Element       │
│   Endpoints     │    │   CatBoost       │    │   Configuration │
│                 │    │   Models         │    │   Optimization  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Component Overview

| Component | Technology | Purpose |
|-----------|------------|---------|
| **API Server** | FastAPI + Uvicorn | REST API endpoints, request handling |
| **ML Engine** | LightGBM + CatBoost | Ensemble predictions for element configs |
| **Data Processing** | Pandas + NumPy | Data preprocessing and feature engineering |
| **Model Storage** | Joblib | Serialized model persistence |

## 🤖 ML Models

### Model Architecture

The system employs a **dual-ensemble approach** combining two powerful gradient boosting algorithms:

#### 1. LightGBM Models
- **Framework**: Microsoft LightGBM
- **Preprocessing**: StandardScaler normalization
- **GPU Acceleration**: Enabled for faster training
- **Ensemble Weight**: 50%

#### 2. CatBoost Models  
- **Framework**: Yandex CatBoost
- **Preprocessing**: Native categorical handling
- **GPU Support**: Optimized for mixed data types
- **Ensemble Weight**: 50%

### Supported Models

| Model Name | Target Elements | Alloy Grades | Specialization |
|------------|----------------|--------------|----------------|
| **Multi-Grade** | C, Si, Mn, P, S, Cu, Mg | EN1563, ASTMA536, ASTMA395 | General purpose |
| **ASTMA536 Updated** | C, Si, Mn, P, S, Cu, Mg | ASTMA536_UPDATED | High Phosphorus (0.40%) |
| **ASTMA395 Updated** | C, Si, Mn, P, S, Cu, Mg | ASTMA395_UPDATED | High Mn (0.725%), Zero P |

### Element Configuration Targets

```python
# Target element configurations by grade
TARGET_SPECS = {
    "EN1563": {
        "C": 3.6, "Si": 2.5, "Mn": 0.5, "P": 0.05,
        "S": 0.02, "Cu": 0.8, "Mg": 0.04
    },
    "ASTMA536": {
        "C": 3.6, "Si": 2.5, "Mn": 0.5, "P": 0.05,
        "S": 0.02, "Cu": 0.8, "Mg": 0.04
    },
    "ASTMA395": {
        "C": 3.6, "Si": 2.5, "Mn": 0.5, "P": 0.05,
        "S": 0.02, "Cu": 0.8, "Mg": 0.04
    },
    "ASTMA536_UPDATED": {
        "C": 3.6, "Si": 2.5, "Mn": 0.5, "P": 0.40,
        "S": 0.02, "Cu": 0.8, "Mg": 0.04
    },
    "ASTMA395_UPDATED": {
        "C": 3.6, "Si": 2.5, "Mn": 0.725, "P": 0.0,
        "S": 0.02, "Cu": 0.8, "Mg": 0.04
    }
}
```

## 📡 API Documentation

### Base URL
```
http://localhost:8000
```

### Authentication
No authentication required for current version.

### Core Endpoints

#### 1. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "models_loaded": 3,
  "available_grades": ["EN1563", "ASTMA536", "ASTMA395", "ASTMA536_UPDATED", "ASTMA395_UPDATED"]
}
```

#### 2. Element Configuration Prediction
```http
POST /predict-element-config
```

**Request Body:**
```json
{
  "alloy_grade": "EN1563",
  "current_composition": {
    "C": 3.2,
    "Si": 2.1,
    "Mn": 0.4,
    "P": 0.08,
    "S": 0.03,
    "Cu": 0.6,
    "Mg": 0.02
  },
  "furnace_id": "F01"
}
```

**Response:**
```json
{
  "success": true,
  "alloy_grade": "EN1563",
  "furnace_id": "F01",
  "target_specifications": {
    "C": 3.6,
    "Si": 2.5,
    "Mn": 0.5,
    "P": 0.05,
    "S": 0.02,
    "Cu": 0.8,
    "Mg": 0.04
  },
  "element_predictions": [
    {
      "element": "C",
      "current": 3.2,
      "target": 3.6,
      "predicted_config": 3.58,
      "adjustment_needed": 0.38,
      "efficiency": 95.0,
      "status": "needs_adjustment",
      "priority": "medium"
    }
  ],
  "optimization_insights": {
    "total_adjustment_cost": 125.50,
    "efficiency_score": 92.3,
    "optimization_potential": 7.7
  },
  "cost_analysis": {
    "total_cost_impact_per_tonne": 125.50,
    "currency": "USD"
  },
  "recommendations": [
    "Increase Carbon by 0.38%",
    "Monitor Manganese levels during adjustment"
  ],
  "model_performance": {
    "confidence_score": 0.987,
    "prediction_accuracy": 99.2
  }
}
```

#### 3. Batch Prediction
```http
POST /predict-batch
```

Supports multiple alloy grade predictions in a single request.

### Interactive Documentation

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 🛠️ Installation

### Prerequisites

- Python 3.8+
- CUDA-compatible GPU (optional, for faster training)

### Quick Start

1. **Clone the repository:**
```bash
git clone https://github.com/your-repo/alloymind-ai.git
cd alloymind-ai
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Start the FastAPI server:**
```bash
# Windows
start_server.bat

# Linux/Mac
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

4. **Access the API:**
- API: `http://localhost:8000`
- Documentation: `http://localhost:8000/docs`

### Dependencies

```text
fastapi==0.104.1          # Web framework
uvicorn[standard]==0.24.0 # ASGI server
pandas==2.1.3             # Data manipulation
numpy==1.25.2             # Numerical computing
scikit-learn==1.3.2       # ML utilities
lightgbm==4.1.0           # Gradient boosting
catboost==1.2.2           # Gradient boosting
joblib==1.3.2             # Model serialization
pydantic==2.5.0           # Data validation
```

## 📊 Model Performance

### Accuracy Metrics

| Model | Element | RMSE | MAE | R² Score |
|-------|---------|------|-----|----------|
| **Multi-Grade** | Carbon | 0.0204 | 0.0150 | 0.9999 |
| | Silicon | 0.0252 | 0.0188 | 0.9999 |
| | Manganese | 0.0154 | 0.0098 | 0.9999 |
| | Phosphorus | 0.0010 | 0.0003 | 0.9999 |
| | Sulfur | 2.4e-09 | 1.8e-09 | 1.0000 |
| | Copper | 0.0126 | 0.0094 | 0.9999 |
| | Magnesium | 0.0032 | 0.0024 | 0.9999 |

### Training Performance

- **GPU Acceleration**: Enabled for LightGBM models
- **Training Time**: ~5-10 minutes per model
- **Model Size**: ~50MB total for all models
- **Inference Speed**: <50ms per prediction

## 🔧 Usage Examples

### Python Client Example

```python
import requests
import json

# API endpoint
url = "http://localhost:8000/predict-element-config"

# Request payload
payload = {
    "alloy_grade": "EN1563",
    "current_composition": {
        "C": 3.2, "Si": 2.1, "Mn": 0.4, "P": 0.08,
        "S": 0.03, "Cu": 0.6, "Mg": 0.02
    },
    "furnace_id": "F01"
}

# Make prediction
response = requests.post(url, json=payload)
result = response.json()

print(f"Optimization Efficiency: {result['optimization_insights']['efficiency_score']}%")
```

### cURL Example

```bash
curl -X POST "http://localhost:8000/predict-element-config" \
     -H "Content-Type: application/json" \
     -d '{
       "alloy_grade": "ASTMA536_UPDATED",
       "current_composition": {
         "C": 3.4, "Si": 2.3, "Mn": 0.45, "P": 0.35,
         "S": 0.025, "Cu": 0.75, "Mg": 0.035
       },
       "furnace_id": "F02"
     }'
```

## 🎯 Use Cases

1. **Real-time Furnace Optimization**: Adjust element compositions during production
2. **Quality Control**: Predict final alloy properties before casting
3. **Cost Optimization**: Minimize raw material usage while meeting specifications
4. **Process Automation**: Integrate with industrial control systems
5. **Research & Development**: Explore new alloy compositions

## 📈 Performance Optimization

### Model Optimization Features

- **Ensemble Weighting**: Optimized weights for LightGBM (50%) + CatBoost (50%)
- **GPU Acceleration**: LightGBM models leverage GPU computing
- **Feature Scaling**: StandardScaler for LightGBM numerical features
- **Native Categorical Handling**: CatBoost processes categorical data efficiently

### API Performance

- **Async Framework**: FastAPI with async/await support
- **Model Caching**: Pre-loaded models in memory
- **Response Compression**: Automatic gzip compression
- **CORS Support**: Cross-origin resource sharing enabled

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- **API Documentation**: http://localhost:8000/docs
- **Model Training Scripts**: `element_config_ensemble_training.py`
- **Test Cases**: `test_*.json` files
- **Performance Metrics**: `*_training_info.json` files

---

**Built with ❤️ for the metallurgical industry**
