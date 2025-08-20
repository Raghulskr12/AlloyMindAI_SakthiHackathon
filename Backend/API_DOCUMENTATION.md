# AlloyMind FastAPI Documentation

## Overview

The AlloyMind FastAPI application serves three specialized machine learning models for alloy element configuration prediction:

1. **Multi-Grade Model** - Supports EN1563, ASTMA536, and ASTMA395
2. **ASTMA536 Updated Model** - High Phosphorus target (0.40%)
3. **ASTMA395 Updated Model** - High Manganese (0.725%) and Zero Phosphorus (0.0%)

## API Endpoints

### Base URL

```
http://localhost:8000
```

### 1. Root Endpoint

```http
GET /
```

**Response:**

```json
{
  "message": "AlloyMind Element Configuration API",
  "version": "1.0.0",
  "available_models": ["MULTI_GRADE", "ASTMA536_UPDATED", "ASTMA395_UPDATED"],
  "supported_grades": [
    "EN1563",
    "ASTMA536",
    "ASTMA395",
    "ASTMA536_UPDATED",
    "ASTMA395_UPDATED"
  ],
  "docs": "/docs"
}
```

### 2. Health Check

```http
GET /health
```

**Response:**

```json
{
  "status": "healthy",
  "models_loaded": 3,
  "available_models": ["MULTI_GRADE", "ASTMA536_UPDATED", "ASTMA395_UPDATED"]
}
```

### 3. Models Information

```http
GET /models
```

**Response:**

```json
{
  "models": {
    "MULTI_GRADE": {
      "loaded": true,
      "grade": "MULTI_GRADE",
      "target_specs": {},
      "performance": {
        "C_Element_Config": { "rmse": 0.027, "mae": 0.02, "r2": 0.9998 },
        "Si_Element_Config": { "rmse": 0.026, "mae": 0.02, "r2": 0.9999 }
        // ... other elements
      }
    },
    "ASTMA536_UPDATED": {
      "loaded": true,
      "grade": "ASTMA536",
      "target_specs": {
        "C": 3.4,
        "Si": 2.6,
        "Mn": 0.275,
        "P": 0.4,
        "S": 0.0075,
        "Cu": 0.35,
        "Mg": 0.05
      },
      "performance": {
        "C_Element_Config": { "rmse": 0.164, "mae": 0.128, "r2": 0.9953 }
        // ... other elements
      }
    },
    "ASTMA395_UPDATED": {
      "loaded": true,
      "grade": "ASTMA395",
      "target_specs": {
        "C": 3.6,
        "Si": 3.0,
        "Mn": 0.725,
        "P": 0.0,
        "S": 0.004,
        "Cu": 0.175,
        "Mg": 0.04
      },
      "performance": {
        "C_Element_Config": { "rmse": 0.113, "mae": 0.081, "r2": 0.9977 }
        // ... other elements
      }
    }
  },
  "total_loaded": 3
}
```

### 4. Grade Target Specifications

```http
GET /grades/{grade}/targets
```

**Parameters:**

- `grade` (path): Alloy grade (EN1563, ASTMA536, ASTMA395, ASTMA536_UPDATED, ASTMA395_UPDATED)

**Example:**

```http
GET /grades/ASTMA536_UPDATED/targets
```

**Response:**

```json
{
  "grade": "ASTMA536_UPDATED",
  "target_specifications": {
    "C": 3.4,
    "Si": 2.6,
    "Mn": 0.275,
    "P": 0.4,
    "S": 0.0075,
    "Cu": 0.35,
    "Mg": 0.05
  },
  "description": "Target composition specifications for ASTMA536_UPDATED"
}
```

### 5. Element Configuration Prediction

```http
POST /predict
```

**Request Body:**

```json
{
  "alloy_grade": "ASTMA536_UPDATED",
  "current_composition": {
    "C": 3.21,
    "Si": 2.489,
    "Mn": 0.319,
    "P": 0.038,
    "S": 0.003,
    "Cu": 0.209,
    "Mg": 0.05
  },
  "furnace_id": "F01"
}
```

**Response:**

```json
{
  "success": true,
  "alloy_grade": "ASTMA536_UPDATED",
  "furnace_id": "F01",
  "target_specifications": {
    "C": 3.4,
    "Si": 2.6,
    "Mn": 0.275,
    "P": 0.4,
    "S": 0.0075,
    "Cu": 0.35,
    "Mg": 0.05
  },
  "element_predictions": [
    {
      "element": "C",
      "current": 3.21,
      "target": 3.4,
      "predicted_config": 6.67,
      "adjustment_needed": 3.46,
      "efficiency": 0.0,
      "status": "❌ Poor",
      "priority": "🔥 HIGH"
    },
    {
      "element": "P",
      "current": 0.038,
      "target": 0.4,
      "predicted_config": 0.078,
      "adjustment_needed": 0.04,
      "efficiency": 10.93,
      "status": "❌ Poor 🎯",
      "priority": "🔥 HIGH"
    }
    // ... other elements
  ],
  "optimization_insights": {
    "total_adjustment_percentage": 11.51,
    "high_efficiency_elements": 1.0,
    "total_elements": 7.0,
    "average_efficiency": 15.85
  },
  "cost_analysis": {
    "total_cost_impact_per_tonne": 4881.07,
    "currency": "USD"
  },
  "recommendations": [
    "C: Add 3.4595% - 🔥 HIGH",
    "P: Add 0.0396% - 🔥 HIGH"
    // ... other recommendations
  ],
  "model_performance": {
    "r2_score": 0.9946,
    "accuracy_percentage": 99.46,
    "elements_predicted": 7.0
  }
}
```

## Supported Alloy Grades

### 1. EN1563 (Multi-Grade Model)

- **Target Specs**: C:3.5%, Si:2.5%, Mn:0.2%, P:0.05%, S:0.01%, Cu:0.3%, Mg:0.045%
- **Application**: Standard ductile iron for general applications

### 2. ASTMA536 (Multi-Grade Model)

- **Target Specs**: C:3.4%, Si:2.6%, Mn:0.275%, P:0.04%, S:0.0075%, Cu:0.35%, Mg:0.05%
- **Application**: Standard ductile iron for automotive and structural uses

### 3. ASTMA395 (Multi-Grade Model)

- **Target Specs**: C:3.6%, Si:3.0%, Mn:0.225%, P:0.02%, S:0.004%, Cu:0.175%, Mg:0.04%
- **Application**: Ferritic ductile iron for general structural applications

### 4. ASTMA536_UPDATED (Dedicated Model)

- **Target Specs**: C:3.4%, Si:2.6%, Mn:0.275%, **P:0.40%** 🎯, S:0.0075%, Cu:0.35%, Mg:0.05%
- **Application**: High-phosphorus ductile iron for enhanced strength and wear resistance
- **Key Feature**: 10x higher phosphorus content than standard

### 5. ASTMA395_UPDATED (Dedicated Model)

- **Target Specs**: C:3.6%, Si:3.0%, **Mn:0.725%** 🔥, **P:0.0%** 🎯, S:0.004%, Cu:0.175%, Mg:0.04%
- **Application**: Premium ferritic ductile iron for critical applications
- **Key Features**: 3x higher manganese, zero phosphorus for maximum ductility

## Model Performance

| Model            | Overall R² | Accuracy | Elements Predicted |
| ---------------- | ---------- | -------- | ------------------ |
| Multi-Grade      | 99.99%     | 99.99%   | 7                  |
| ASTMA536 Updated | 99.46%     | 99.46%   | 7                  |
| ASTMA395 Updated | 99.80%     | 99.80%   | 7                  |

## Usage Examples

### PowerShell (Windows)

```powershell
# Test ASTMA536_UPDATED prediction
$body = @{
  alloy_grade = "ASTMA536_UPDATED"
  current_composition = @{
    C = 3.21; Si = 2.489; Mn = 0.319; P = 0.038
    S = 0.003; Cu = 0.209; Mg = 0.05
  }
  furnace_id = "F01"
} | ConvertTo-Json -Depth 3

Invoke-WebRequest -Uri "http://localhost:8000/predict" -Method POST -Body $body -ContentType "application/json"
```

### Curl (Linux/Mac)

```bash
curl -X POST "http://localhost:8000/predict" \
-H "Content-Type: application/json" \
-d '{
  "alloy_grade": "ASTMA395_UPDATED",
  "current_composition": {
    "C": 3.58, "Si": 2.98, "Mn": 0.22, "P": 0.018,
    "S": 0.0041, "Cu": 0.17, "Mg": 0.039
  },
  "furnace_id": "F02"
}'
```

### Python

```python
import requests
import json

url = "http://localhost:8000/predict"
payload = {
    "alloy_grade": "EN1563",
    "current_composition": {
        "C": 3.45, "Si": 2.48, "Mn": 0.19, "P": 0.048,
        "S": 0.009, "Cu": 0.28, "Mg": 0.043
    },
    "furnace_id": "F03"
}

response = requests.post(url, json=payload)
result = response.json()
print(json.dumps(result, indent=2))
```

## Running the API

### Installation

```bash
pip install -r requirements.txt
```

### Start Server

```bash
python main.py
```

The server will start on `http://localhost:8000`

### Interactive Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Error Handling

### Common Errors

1. **Unsupported Grade**

```json
{
  "detail": "Unsupported grade: INVALID_GRADE. Supported: ['EN1563', 'ASTMA536', 'ASTMA395', 'ASTMA536_UPDATED', 'ASTMA395_UPDATED']"
}
```

2. **Invalid Composition Values**

```json
{
  "detail": [
    {
      "type": "less_than_equal",
      "loc": ["body", "current_composition", "C"],
      "msg": "Input should be less than or equal to 10"
    }
  ]
}
```

3. **Model Not Loaded**

```json
{
  "detail": "Model for ASTMA536_UPDATED not loaded"
}
```

## Response Fields Explanation

- **element_predictions**: Individual element optimization results

  - **efficiency**: How well the prediction moves toward target (0-100%)
  - **status**: Visual indicator (✅ Good >80%, ⚠️ Fair 50-80%, ❌ Poor <50%)
  - **priority**: Action priority (🔥 HIGH, 🔸 MED, 🔹 LOW)

- **optimization_insights**: Overall optimization metrics
- **cost_analysis**: Estimated cost impact per tonne in USD
- **recommendations**: Prioritized action items
- **model_performance**: Model accuracy and reliability metrics

## Files Required

Ensure these model files are present in the working directory:

- `element_config_ensemble_model.pkl` (Multi-grade model)
- `astma536_updated_ensemble_model.pkl` (ASTMA536 updated model)
- `astma395_updated_ensemble_model.pkl` (ASTMA395 updated model)
- `element_config_training_info.json` (Multi-grade info)
- `astma536_updated_training_info.json` (ASTMA536 info)
- `astma395_updated_training_info.json` (ASTMA395 info)

## Features

✅ **Three Specialized Models**: Multi-grade, ASTMA536 Updated, ASTMA395 Updated  
✅ **High Accuracy**: 99%+ prediction accuracy across all models  
✅ **Real-time Predictions**: Fast API responses with detailed analysis  
✅ **Cost Analysis**: Economic impact estimation for alloy adjustments  
✅ **Priority Recommendations**: Action items ranked by importance  
✅ **Interactive Documentation**: Built-in Swagger UI and ReDoc  
✅ **Error Handling**: Comprehensive validation and error messages  
✅ **Model Performance Metrics**: Transparency in prediction reliability
