#!/usr/bin/env python3
"""
FastAPI Application for Alloy Element Configuration Prediction
Serves three models: Multi-Grade, ASTMA536 Updated, and ASTMA395 Updated
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Optional, List
import joblib
import pandas as pd
import numpy as np
import json
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="AlloyMind Element Configuration API",
    description="Advanced alloy optimization using ensemble ML models for multiple grades",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables to store loaded models
models = {}
model_info = {}

class CompositionInput(BaseModel):
    """Input model for current element composition"""
    C: float = Field(..., ge=0, le=10, description="Carbon percentage (0-10%)")
    Si: float = Field(..., ge=0, le=10, description="Silicon percentage (0-10%)")
    Mn: float = Field(..., ge=0, le=2, description="Manganese percentage (0-2%)")
    P: float = Field(..., ge=0, le=1, description="Phosphorus percentage (0-1%)")
    S: float = Field(..., ge=0, le=0.1, description="Sulfur percentage (0-0.1%)")
    Cu: float = Field(..., ge=0, le=2, description="Copper percentage (0-2%)")
    Mg: float = Field(..., ge=0, le=0.2, description="Magnesium percentage (0-0.2%)")

class PredictionRequest(BaseModel):
    """Request model for alloy prediction"""
    alloy_grade: str = Field(..., description="Alloy grade: EN1563, ASTMA536, ASTMA395, ASTMA536_UPDATED, or ASTMA395_UPDATED")
    current_composition: CompositionInput
    furnace_id: Optional[str] = Field("F01", description="Furnace ID (F01-F05)")

class ElementPrediction(BaseModel):
    """Model for individual element prediction"""
    element: str
    current: float
    target: float
    predicted_config: float
    adjustment_needed: float
    efficiency: float
    status: str
    priority: str

class CostAnalysis(BaseModel):
    """Cost analysis model"""
    total_cost_impact_per_tonne: float
    currency: str

class PredictionResponse(BaseModel):
    """Response model for predictions"""
    success: bool
    alloy_grade: str
    furnace_id: str
    target_specifications: Dict[str, float]
    element_predictions: List[ElementPrediction]
    optimization_insights: Dict[str, float]
    cost_analysis: CostAnalysis
    recommendations: List[str]
    model_performance: Dict[str, float]

class EnsembleModel:
    """Base ensemble model class"""
    
    def __init__(self, lgbm_models, catboost_models, lgbm_scaler=None, weights=None):
        self.lgbm_models = lgbm_models
        self.catboost_models = catboost_models
        self.lgbm_scaler = lgbm_scaler
        self.weights = weights or [0.5, 0.5]
        self.target_columns = list(lgbm_models.keys())
    
    def predict(self, X):
        """Make ensemble predictions"""
        predictions = {}
        
        # Prepare input for LightGBM (needs scaling)
        if self.lgbm_scaler is not None:
            X_scaled = X.copy()
            numerical_columns = X.select_dtypes(include=[np.number]).columns
            X_scaled[numerical_columns] = self.lgbm_scaler.transform(X[numerical_columns])
        else:
            X_scaled = X
        
        for target in self.target_columns:
            # Get LightGBM prediction
            lgbm_pred = self.lgbm_models[target].predict(X_scaled)
            
            # Get CatBoost prediction
            catboost_pred = self.catboost_models[target].predict(X)
            
            # Combine predictions with weights
            ensemble_pred = (self.weights[0] * lgbm_pred + 
                           self.weights[1] * catboost_pred)
            
            predictions[target] = ensemble_pred
        
        return pd.DataFrame(predictions)

def load_models():
    """Load all available models at startup"""
    global models, model_info
    
    model_files = {
        'MULTI_GRADE': 'element_config_ensemble_model.pkl',
        'ASTMA536_UPDATED': 'astma536_updated_ensemble_model.pkl', 
        'ASTMA395_UPDATED': 'astma395_updated_ensemble_model.pkl'
    }
    
    info_files = {
        'MULTI_GRADE': 'element_config_training_info.json',
        'ASTMA536_UPDATED': 'astma536_updated_training_info.json',
        'ASTMA395_UPDATED': 'astma395_updated_training_info.json'
    }
    
    for model_name, model_file in model_files.items():
        try:
            if Path(model_file).exists():
                logger.info(f"Loading {model_name} model from {model_file}")
                ensemble_package = joblib.load(model_file)
                
                # Create ensemble model
                ensemble_model = EnsembleModel(
                    lgbm_models=ensemble_package['lgbm_models'],
                    catboost_models=ensemble_package['catboost_models'],
                    lgbm_scaler=ensemble_package['lgbm_scaler'],
                    weights=ensemble_package['weights']
                )
                
                models[model_name] = {
                    'ensemble': ensemble_model,
                    'label_encoders': ensemble_package.get('label_encoders', {}),
                    'target_specs': ensemble_package.get('target_specs', {}),
                    'grade': ensemble_package.get('grade', model_name)
                }
                
                # Load training info
                info_file = info_files.get(model_name)
                if info_file and Path(info_file).exists():
                    with open(info_file, 'r') as f:
                        model_info[model_name] = json.load(f)
                
                logger.info(f"✓ Successfully loaded {model_name}")
            else:
                logger.warning(f"Model file {model_file} not found")
                
        except Exception as e:
            logger.error(f"Failed to load {model_name}: {e}")

def get_target_specifications(grade: str) -> Dict[str, float]:
    """Get target specifications for a given grade"""
    if grade in models and 'target_specs' in models[grade]:
        return models[grade]['target_specs']
    
    # Default specifications for multi-grade model
    grade_specs = {
        'EN1563': {'C': 3.5, 'Si': 2.5, 'Mn': 0.2, 'P': 0.05, 'S': 0.01, 'Cu': 0.3, 'Mg': 0.045},
        'ASTMA536': {'C': 3.4, 'Si': 2.6, 'Mn': 0.275, 'P': 0.04, 'S': 0.0075, 'Cu': 0.35, 'Mg': 0.05},
        'ASTMA395': {'C': 3.6, 'Si': 3.0, 'Mn': 0.225, 'P': 0.02, 'S': 0.004, 'Cu': 0.175, 'Mg': 0.04},
        'ASTMA536_UPDATED': {'C': 3.4, 'Si': 2.6, 'Mn': 0.275, 'P': 0.40, 'S': 0.0075, 'Cu': 0.35, 'Mg': 0.05},
        'ASTMA395_UPDATED': {'C': 3.6, 'Si': 3.0, 'Mn': 0.725, 'P': 0.0, 'S': 0.004, 'Cu': 0.175, 'Mg': 0.04}
    }
    
    return grade_specs.get(grade, grade_specs['EN1563'])

def get_element_parameters(grade: str) -> Dict[str, Dict]:
    """Get element parameters for a given grade"""
    # Standard parameters that work for most grades
    base_params = {
        'C': {'min': 3.0, 'max': 4.0, 'absorption_rate': 90, 'cost_per_kg': 150, 'target_min': 3.0, 'target_max': 4.0},
        'Si': {'min': 2.0, 'max': 3.5, 'absorption_rate': 85, 'cost_per_kg': 120, 'target_min': 2.0, 'target_max': 3.5},
        'Mn': {'min': 0.1, 'max': 1.0, 'absorption_rate': 75, 'cost_per_kg': 400, 'target_min': 0.1, 'target_max': 1.0},
        'P': {'min': 0.0, 'max': 0.8, 'absorption_rate': 60, 'cost_per_kg': 300, 'target_min': 0.0, 'target_max': 0.8},
        'S': {'min': 0.0, 'max': 0.02, 'absorption_rate': 70, 'cost_per_kg': 250, 'target_min': 0.0, 'target_max': 0.02},
        'Cu': {'min': 0.1, 'max': 0.6, 'absorption_rate': 80, 'cost_per_kg': 700, 'target_min': 0.1, 'target_max': 0.6},
        'Mg': {'min': 0.02, 'max': 0.08, 'absorption_rate': 95, 'cost_per_kg': 2800, 'target_min': 0.02, 'target_max': 0.08}
    }
    
    return base_params

def create_input_dataframe(grade: str, composition: CompositionInput, furnace_id: str) -> pd.DataFrame:
    """Create input DataFrame for model prediction"""
    target_specs = get_target_specifications(grade)
    element_params = get_element_parameters(grade)
    
    input_data = {}
    elements = ['C', 'Si', 'Mn', 'P', 'S', 'Cu', 'Mg']
    
    # Add element-specific data
    for element in elements:
        # Current and target compositions
        input_data[f'{element}_Current'] = [getattr(composition, element)]
        input_data[f'{element}_Target_Config'] = [target_specs.get(element, 0)]
        
        # Element parameters
        params = element_params[element]
        input_data[f'{element}_Min'] = [params['min']]
        input_data[f'{element}_Max'] = [params['max']]
        input_data[f'{element}_Absorption_Rate'] = [params['absorption_rate']]
        input_data[f'{element}_Cost_Per_Kg'] = [params['cost_per_kg']]
        input_data[f'{element}_Target_Min'] = [params['target_min']]
        input_data[f'{element}_Target_Max'] = [params['target_max']]
    
    # Add furnace and grade
    input_data['Furnace_ID'] = [furnace_id]
    input_data['Grade_Code'] = [grade.replace('_UPDATED', '')]
    
    # Create DataFrame
    df = pd.DataFrame(input_data)
    
    # Handle categorical encoding
    model_key = 'MULTI_GRADE'
    if 'ASTMA536_UPDATED' in grade:
        model_key = 'ASTMA536_UPDATED'
    elif 'ASTMA395_UPDATED' in grade:
        model_key = 'ASTMA395_UPDATED'
    
    if model_key in models:
        label_encoders = models[model_key]['label_encoders']
        
        # Encode categorical columns
        if 'Furnace_ID' in label_encoders:
            try:
                df['Furnace_ID'] = label_encoders['Furnace_ID'].transform(df['Furnace_ID'])
            except ValueError:
                df['Furnace_ID'] = 0
        
        if 'Grade_Code' in label_encoders:
            try:
                df['Grade_Code'] = label_encoders['Grade_Code'].transform(df['Grade_Code'])
            except ValueError:
                df['Grade_Code'] = 0
    
    # Feature engineering
    for element in elements:
        current_col = f'{element}_Current'
        target_col = f'{element}_Target_Config'
        
        # Difference
        df[f'{element}_Diff'] = df[target_col] - df[current_col]
        
        # Ratio (handle zero targets)
        if element == 'P' and grade == 'ASTMA395_UPDATED':
            df[f'{element}_Ratio'] = 0.0
        else:
            df[f'{element}_Ratio'] = df[target_col] / (df[current_col] + 1e-8)
        
        # Percentage change (handle zero targets)
        if element == 'P' and grade == 'ASTMA395_UPDATED':
            df[f'{element}_PctChange'] = -100.0 * df[current_col] / (df[current_col] + 1e-8)
        else:
            df[f'{element}_PctChange'] = (df[target_col] - df[current_col]) / (df[current_col] + 1e-8) * 100
    
    return df

def calculate_efficiency(current: float, target: float, predicted: float, element: str = None, grade: str = None) -> float:
    """Calculate prediction efficiency"""
    if element == 'P' and grade == 'ASTMA395_UPDATED' and target == 0.0:
        # Special handling for zero P target
        if current <= 0.001:
            return 100.0
        else:
            return max(0, min(100, (1 - abs(predicted) / current) * 100))
    elif abs(target - current) > 1e-6:
        return max(0, min(100, (1 - abs(target - predicted) / abs(target - current)) * 100))
    else:
        return 100.0

def get_status(efficiency: float, element: str = None, grade: str = None) -> tuple:
    """Get status and priority based on efficiency"""
    if efficiency > 80:
        status = "✅ Good"
        priority = "🔹 LOW"
    elif efficiency > 50:
        status = "⚠️  Fair"
        priority = "🔸 MED"
    else:
        status = "❌ Poor"
        priority = "HIGH"
    
    # Special highlighting for updated elements
    if element == 'Mn' and 'ASTMA395_UPDATED' in grade:
        status += " ⭐"
    elif element == 'P' and ('ASTMA536_UPDATED' in grade or 'ASTMA395_UPDATED' in grade):
        status += " 🎯"
    
    return status, priority

@app.on_event("startup")
async def startup_event():
    """Load models on startup"""
    logger.info("Starting AlloyMind API...")
    load_models()
    logger.info(f"Loaded {len(models)} models: {list(models.keys())}")

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "AlloyMind Element Configuration API",
        "version": "1.0.0",
        "available_models": list(models.keys()),
        "supported_grades": ["EN1563", "ASTMA536", "ASTMA395", "ASTMA536_UPDATED", "ASTMA395_UPDATED"],
        "docs": "/docs"
    }

@app.get("/models")
async def get_models():
    """Get information about loaded models"""
    model_status = {}
    for model_name in models:
        info = model_info.get(model_name, {})
        model_status[model_name] = {
            "loaded": True,
            "grade": models[model_name].get('grade', 'Unknown'),
            "target_specs": models[model_name].get('target_specs', {}),
            "performance": info.get('ensemble', {}) if 'ensemble' in info else "Not available"
        }
    
    return {
        "models": model_status,
        "total_loaded": len(models)
    }

@app.get("/grades/{grade}/targets")
async def get_grade_targets(grade: str):
    """Get target specifications for a specific grade"""
    grade = grade.upper()
    if grade not in ["EN1563", "ASTMA536", "ASTMA395", "ASTMA536_UPDATED", "ASTMA395_UPDATED"]:
        raise HTTPException(status_code=400, detail=f"Unsupported grade: {grade}")
    
    target_specs = get_target_specifications(grade)
    
    return {
        "grade": grade,
        "target_specifications": target_specs,
        "description": f"Target composition specifications for {grade}"
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict_element_config(request: PredictionRequest):
    """Predict element configuration for given alloy grade and composition"""
    grade = request.alloy_grade.upper()
    
    # Validate grade
    supported_grades = ["EN1563", "ASTMA536", "ASTMA395", "ASTMA536_UPDATED", "ASTMA395_UPDATED"]
    if grade not in supported_grades:
        raise HTTPException(status_code=400, detail=f"Unsupported grade: {grade}. Supported: {supported_grades}")
    
    # Determine which model to use
    model_key = 'MULTI_GRADE'
    if grade == 'ASTMA536_UPDATED':
        model_key = 'ASTMA536_UPDATED'
    elif grade == 'ASTMA395_UPDATED':
        model_key = 'ASTMA395_UPDATED'
    
    if model_key not in models:
        raise HTTPException(status_code=500, detail=f"Model for {grade} not loaded")
    
    try:
        # Get target specifications
        target_specs = get_target_specifications(grade)
        
        # Create input DataFrame
        input_df = create_input_dataframe(grade, request.current_composition, request.furnace_id)
        
        # Make prediction
        ensemble_model = models[model_key]['ensemble']
        predictions = ensemble_model.predict(input_df)
        
        # Process predictions
        elements = ['C', 'Si', 'Mn', 'P', 'S', 'Cu', 'Mg']
        element_predictions = []
        total_adjustment = 0
        high_efficiency_count = 0
        cost_per_kg = {'C': 150, 'Si': 120, 'Mn': 400, 'P': 300, 'S': 250, 'Cu': 700, 'Mg': 2800}
        total_cost_impact = 0
        recommendations = []
        
        for element in elements:
            config_col = f'{element}_Element_Config'
            if config_col in predictions.columns:
                current = getattr(request.current_composition, element)
                target = target_specs.get(element, 0)
                predicted = predictions[config_col].iloc[0]
                adjustment = predicted - current
                
                efficiency = calculate_efficiency(current, target, predicted, element, grade)
                status, priority = get_status(efficiency, element, grade)
                
                if efficiency > 80:
                    high_efficiency_count += 1
                
                total_adjustment += abs(adjustment)
                cost_impact = abs(adjustment) * cost_per_kg[element]
                total_cost_impact += cost_impact
                
                # Generate recommendations
                if abs(adjustment) > 0.001:
                    action = "Add" if adjustment > 0 else "Reduce"
                    recommendations.append(f"{element}: {action} {abs(adjustment):.4f}% - {priority}")
                
                element_predictions.append(ElementPrediction(
                    element=element,
                    current=current,
                    target=target,
                    predicted_config=predicted,
                    adjustment_needed=adjustment,
                    efficiency=efficiency,
                    status=status,
                    priority=priority
                ))
        
        # Calculate average efficiency
        avg_efficiency = np.mean([ep.efficiency for ep in element_predictions])
        
        # Get model performance
        model_performance = {}
        if model_key in model_info and 'ensemble' in model_info[model_key]:
            ensemble_info = model_info[model_key]['ensemble']
            avg_r2 = np.mean([v['r2'] for v in ensemble_info.values()])
            model_performance = {
                "r2_score": avg_r2,
                "accuracy_percentage": avg_r2 * 100,
                "elements_predicted": len(ensemble_info)
            }
        
        return PredictionResponse(
            success=True,
            alloy_grade=grade,
            furnace_id=request.furnace_id,
            target_specifications=target_specs,
            element_predictions=element_predictions,
            optimization_insights={
                "total_adjustment_percentage": total_adjustment,
                "high_efficiency_elements": high_efficiency_count,
                "total_elements": len(elements),
                "average_efficiency": avg_efficiency
            },
            cost_analysis=CostAnalysis(
                total_cost_impact_per_tonne=total_cost_impact,
                currency="USD"
            ),
            recommendations=recommendations,
            model_performance=model_performance
        )
        
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "models_loaded": len(models),
        "available_models": list(models.keys())
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
