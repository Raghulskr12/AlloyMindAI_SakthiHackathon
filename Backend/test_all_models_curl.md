# AlloyMind API Testing with Curl Commands

## Prerequisites

- FastAPI server running on `http://localhost:8000`
- `jq` installed for JSON formatting (optional)

## Test Commands

### 1. Basic API Information

```bash
# Root endpoint
curl -X GET "http://localhost:8000/"

# Health check
curl -X GET "http://localhost:8000/health"

# Models information
curl -X GET "http://localhost:8000/models"
```

### 2. Target Specifications

```bash
# ASTMA536_UPDATED targets
curl -X GET "http://localhost:8000/grades/ASTMA536_UPDATED/targets"

# ASTMA395_UPDATED targets
curl -X GET "http://localhost:8000/grades/ASTMA395_UPDATED/targets"

# EN1563 targets
curl -X GET "http://localhost:8000/grades/EN1563/targets"
```

### 3. Model Predictions

#### EN1563 (Multi-Grade Model)

```bash
curl -X POST "http://localhost:8000/predict" \
-H "Content-Type: application/json" \
-d '{
  "alloy_grade": "EN1563",
  "current_composition": {
    "C": 3.45,
    "Si": 2.48,
    "Mn": 0.19,
    "P": 0.048,
    "S": 0.009,
    "Cu": 0.28,
    "Mg": 0.043
  },
  "furnace_id": "F01"
}'
```

#### ASTMA536 (Multi-Grade Model)

```bash
curl -X POST "http://localhost:8000/predict" \
-H "Content-Type: application/json" \
-d '{
  "alloy_grade": "ASTMA536",
  "current_composition": {
    "C": 3.35,
    "Si": 2.55,
    "Mn": 0.26,
    "P": 0.035,
    "S": 0.007,
    "Cu": 0.33,
    "Mg": 0.048
  },
  "furnace_id": "F02"
}'
```

#### ASTMA395 (Multi-Grade Model)

```bash
curl -X POST "http://localhost:8000/predict" \
-H "Content-Type: application/json" \
-d '{
  "alloy_grade": "ASTMA395",
  "current_composition": {
    "C": 3.58,
    "Si": 2.98,
    "Mn": 0.21,
    "P": 0.019,
    "S": 0.0038,
    "Cu": 0.16,
    "Mg": 0.038
  },
  "furnace_id": "F03"
}'
```

#### ASTMA536_UPDATED (High Phosphorus - 0.40%)

```bash
curl -X POST "http://localhost:8000/predict" \
-H "Content-Type: application/json" \
-d '{
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
}'
```

#### ASTMA395_UPDATED (High Mn 0.725%, Zero P 0.0%)

```bash
curl -X POST "http://localhost:8000/predict" \
-H "Content-Type: application/json" \
-d '{
  "alloy_grade": "ASTMA395_UPDATED",
  "current_composition": {
    "C": 3.58,
    "Si": 2.98,
    "Mn": 0.22,
    "P": 0.018,
    "S": 0.0041,
    "Cu": 0.17,
    "Mg": 0.039
  },
  "furnace_id": "F02"
}'
```

## Expected Results

### ASTMA536_UPDATED Key Results

- **Target P**: 0.40% (10x higher than standard)
- **Current P**: 0.038% → **Major P addition required**
- **Model Accuracy**: 99.46%
- **Cost Impact**: ~$4,881/tonne

### ASTMA395_UPDATED Key Results

- **Target Mn**: 0.725% (3x higher than standard)
- **Target P**: 0.0% (zero phosphorus)
- **Current Mn**: 0.22% → **Major Mn addition required**
- **Current P**: 0.018% → **P reduction to zero required**
- **Model Accuracy**: 99.80%
- **Cost Impact**: ~$767/tonne

### Multi-Grade Models Key Results

- **Model Accuracy**: 99.99%
- **Flexible**: Supports EN1563, ASTMA536, ASTMA395
- **Standard Targets**: Traditional alloy specifications

## PowerShell Equivalents (Windows)

### Basic Test

```powershell
Invoke-WebRequest -Uri "http://localhost:8000/" -Method GET | Select-Object -ExpandProperty Content
```

### Prediction Test

```powershell
$body = @{
  alloy_grade = "ASTMA536_UPDATED"
  current_composition = @{
    C = 3.21; Si = 2.489; Mn = 0.319; P = 0.038
    S = 0.003; Cu = 0.209; Mg = 0.05
  }
  furnace_id = "F01"
} | ConvertTo-Json -Depth 3

Invoke-WebRequest -Uri "http://localhost:8000/predict" -Method POST -Body $body -ContentType "application/json" | Select-Object -ExpandProperty Content
```

## Response Analysis

### Key Fields to Monitor

- **success**: Should be `true`
- **element_predictions**: Individual element optimization
- **efficiency**: Prediction quality (0-100%)
- **status**: Visual indicators (✅/⚠️/❌)
- **cost_analysis**: Economic impact
- **model_performance**: R² score and accuracy

### Status Indicators

- **✅ Good**: >80% efficiency
- **⚠️ Fair**: 50-80% efficiency
- **❌ Poor**: <50% efficiency
- **🔥**: High Manganese (ASTMA395_UPDATED)
- **🎯**: Updated Phosphorus targets

### Priority Levels

- **🔥 HIGH**: Critical adjustments needed
- **🔸 MED**: Moderate adjustments
- **🔹 LOW**: Minor fine-tuning

## Troubleshooting

### Common Issues

1. **Connection Refused**: Server not running
2. **Model Not Loaded**: Check .pkl files in directory
3. **Invalid Grade**: Use supported grades only
4. **Validation Errors**: Check composition ranges (0-10% for most elements)

### Verify Server Status

```bash
curl -X GET "http://localhost:8000/health"
```

Should return:

```json
{
  "status": "healthy",
  "models_loaded": 3,
  "available_models": ["MULTI_GRADE", "ASTMA536_UPDATED", "ASTMA395_UPDATED"]
}
```
