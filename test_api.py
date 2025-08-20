#!/usr/bin/env python3
"""
Test script for AlloyMind FastAPI application
Demonstrates all API endpoints with sample data
"""

import requests
import json
import time

# API base URL
BASE_URL = "http://localhost:8000"

def test_root():
    """Test root endpoint"""
    print("🔍 Testing root endpoint...")
    response = requests.get(f"{BASE_URL}/")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print("-" * 60)

def test_models():
    """Test models endpoint"""
    print("🔍 Testing models endpoint...")
    response = requests.get(f"{BASE_URL}/models")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print("-" * 60)

def test_grade_targets(grade):
    """Test grade targets endpoint"""
    print(f"🔍 Testing grade targets for {grade}...")
    response = requests.get(f"{BASE_URL}/grades/{grade}/targets")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print("-" * 60)

def test_prediction(grade, composition_data):
    """Test prediction endpoint"""
    print(f"🔍 Testing prediction for {grade}...")
    
    payload = {
        "alloy_grade": grade,
        "current_composition": composition_data,
        "furnace_id": "F01"
    }
    
    response = requests.post(f"{BASE_URL}/predict", json=payload)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"Success: {result['success']}")
        print(f"Grade: {result['alloy_grade']}")
        print(f"Target Specs: {result['target_specifications']}")
        print(f"Optimization Insights: {result['optimization_insights']}")
        print(f"Cost Analysis: ${result['cost_analysis']['total_cost_impact_per_tonne']:.2f}/tonne")
        print(f"Model Performance: R² = {result['model_performance'].get('r2_score', 'N/A'):.4f}")
        print("Element Predictions:")
        for pred in result['element_predictions']:
            print(f"  {pred['element']}: {pred['current']:.4f}% → {pred['predicted_config']:.4f}% ({pred['status']})")
    else:
        print(f"Error: {response.text}")
    
    print("-" * 60)

def test_health():
    """Test health endpoint"""
    print("🔍 Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print("-" * 60)

def main():
    """Run all tests"""
    print("🚀 Starting AlloyMind API Tests")
    print("=" * 60)
    
    # Wait for server to start
    print("Waiting for server to start...")
    time.sleep(2)
    
    try:
        # Test basic endpoints
        test_root()
        test_health()
        test_models()
        
        # Test grade targets
        grades = ["EN1563", "ASTMA536", "ASTMA395", "ASTMA536_UPDATED", "ASTMA395_UPDATED"]
        for grade in grades:
            test_grade_targets(grade)
        
        # Test predictions with sample compositions
        
        # 1. Multi-grade EN1563
        print("🧪 Testing Multi-Grade EN1563...")
        en1563_composition = {
            "C": 3.45,
            "Si": 2.48,
            "Mn": 0.19,
            "P": 0.048,
            "S": 0.009,
            "Cu": 0.28,
            "Mg": 0.043
        }
        test_prediction("EN1563", en1563_composition)
        
        # 2. ASTMA536 Updated (High P)
        print("🧪 Testing ASTMA536 Updated (High P)...")
        astma536_composition = {
            "C": 3.21,
            "Si": 2.489,
            "Mn": 0.319,
            "P": 0.038,  # Low P, needs increase to 0.40%
            "S": 0.003,
            "Cu": 0.209,
            "Mg": 0.05
        }
        test_prediction("ASTMA536_UPDATED", astma536_composition)
        
        # 3. ASTMA395 Updated (High Mn, Zero P)
        print("🧪 Testing ASTMA395 Updated (High Mn, Zero P)...")
        astma395_composition = {
            "C": 3.58,
            "Si": 2.98,
            "Mn": 0.22,   # Low Mn, needs increase to 0.725%
            "P": 0.018,   # Needs reduction to 0.0%
            "S": 0.0041,
            "Cu": 0.17,
            "Mg": 0.039
        }
        test_prediction("ASTMA395_UPDATED", astma395_composition)
        
        print("✅ All tests completed!")
        
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to API server. Make sure it's running on http://localhost:8000")
    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == "__main__":
    main()
