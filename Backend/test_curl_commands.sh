#!/bin/bash

# AlloyMind API Test Commands using curl
# Make sure the FastAPI server is running on http://localhost:8000

echo "🚀 AlloyMind API Curl Tests"
echo "================================="

# Set base URL
BASE_URL="http://localhost:8000"

echo ""
echo "1. 🔍 Testing Root Endpoint"
echo "Command: curl -X GET $BASE_URL/"
curl -X GET "$BASE_URL/" | jq '.'

echo ""
echo "2. 🔍 Testing Health Check"
echo "Command: curl -X GET $BASE_URL/health"
curl -X GET "$BASE_URL/health" | jq '.'

echo ""
echo "3. 🔍 Testing Models Info"
echo "Command: curl -X GET $BASE_URL/models"
curl -X GET "$BASE_URL/models" | jq '.'

echo ""
echo "4. 🔍 Testing Grade Targets - ASTMA536_UPDATED"
echo "Command: curl -X GET $BASE_URL/grades/ASTMA536_UPDATED/targets"
curl -X GET "$BASE_URL/grades/ASTMA536_UPDATED/targets" | jq '.'

echo ""
echo "5. 🔍 Testing Grade Targets - ASTMA395_UPDATED"
echo "Command: curl -X GET $BASE_URL/grades/ASTMA395_UPDATED/targets"
curl -X GET "$BASE_URL/grades/ASTMA395_UPDATED/targets" | jq '.'

echo ""
echo "6. 🧪 Testing Prediction - EN1563 (Multi-Grade)"
echo "Command: curl -X POST $BASE_URL/predict ..."
curl -X POST "$BASE_URL/predict" \
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
}' | jq '.'

echo ""
echo "7. 🧪 Testing Prediction - ASTMA536_UPDATED (High P)"
echo "Command: curl -X POST $BASE_URL/predict ..."
curl -X POST "$BASE_URL/predict" \
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
}' | jq '.'

echo ""
echo "8. 🧪 Testing Prediction - ASTMA395_UPDATED (High Mn, Zero P)"
echo "Command: curl -X POST $BASE_URL/predict ..."
curl -X POST "$BASE_URL/predict" \
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
}' | jq '.'

echo ""
echo "9. 🧪 Testing Prediction - ASTMA536 (Standard)"
echo "Command: curl -X POST $BASE_URL/predict ..."
curl -X POST "$BASE_URL/predict" \
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
  "furnace_id": "F03"
}' | jq '.'

echo ""
echo "10. ❌ Testing Invalid Grade"
echo "Command: curl -X POST $BASE_URL/predict ..."
curl -X POST "$BASE_URL/predict" \
-H "Content-Type: application/json" \
-d '{
  "alloy_grade": "INVALID_GRADE",
  "current_composition": {
    "C": 3.5,
    "Si": 2.5,
    "Mn": 0.2,
    "P": 0.04,
    "S": 0.008,
    "Cu": 0.3,
    "Mg": 0.04
  },
  "furnace_id": "F01"
}' | jq '.'

echo ""
echo "✅ All curl tests completed!"
echo ""
echo "📋 Summary of Available Endpoints:"
echo "  GET  /           - API information"
echo "  GET  /health     - Health check"
echo "  GET  /models     - Loaded models info"
echo "  GET  /grades/{grade}/targets - Target specifications"
echo "  POST /predict    - Element configuration prediction"
echo "  GET  /docs       - Interactive API documentation"
echo ""
echo "🎯 Supported Grades:"
echo "  - EN1563 (Multi-grade model)"
echo "  - ASTMA536 (Multi-grade model)"
echo "  - ASTMA395 (Multi-grade model)"
echo "  - ASTMA536_UPDATED (High P: 0.40%)"
echo "  - ASTMA395_UPDATED (High Mn: 0.725%, Zero P: 0.0%)"
