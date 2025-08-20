#!/usr/bin/env python3
"""
Element Configuration Prediction CLI
Interactive command-line interface for predicting Element_Config values using ensemble model.
"""

import pandas as pd
import numpy as np
import joblib
import json
import sys
from sklearn.preprocessing import LabelEncoder

class ElementConfigEnsembleModel:
    """Ensemble model combining LightGBM and CatBoost for Element_Config prediction."""
    
    def __init__(self, lgbm_models, catboost_models, lgbm_scaler=None, weights=None):
        self.lgbm_models = lgbm_models
        self.catboost_models = catboost_models
        self.lgbm_scaler = lgbm_scaler
        self.weights = weights or [0.5, 0.5]
        self.target_columns = list(lgbm_models.keys())
    
    def predict(self, X):
        """Make ensemble predictions by combining LightGBM and CatBoost outputs."""
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

def load_ensemble_model():
    """Load the trained ensemble model."""
    try:
        ensemble_package = joblib.load('element_config_ensemble_model.pkl')
        
        ensemble_model = ElementConfigEnsembleModel(
            lgbm_models=ensemble_package['lgbm_models'],
            catboost_models=ensemble_package['catboost_models'],
            lgbm_scaler=ensemble_package['lgbm_scaler'],
            weights=ensemble_package['weights']
        )
        
        print("SUCCESS: Element Config Ensemble model loaded successfully")
        return ensemble_model
    except Exception as e:
        print(f"ERROR: Failed to load ensemble model: {e}")
        print("Please run element_config_ensemble_training.py first.")
        return None

def display_welcome():
    """Display welcome message and model information."""
    print("=" * 75)
    print("ELEMENT CONFIGURATION PREDICTION - ENSEMBLE MODEL")
    print("=" * 75)
    print("This tool predicts Element_Config values for metal alloy optimization")
    print("using an ensemble of LightGBM and CatBoost models.")
    print()
    print("Configuration:")
    print("  • Fixed Target Composition: C: 3.6%, Si: 2.4%, Mn: 0.25%")
    print("    P: 0.025%, S: 0.005%, Cu: 0.225%, Mg: 0.0475%")
    print("  • Default Furnace: F01, Grade: EN1563")
    print("  • Optimized Element Parameters: Auto-configured")
    print()
    
    # Load and display model info
    try:
        with open('element_config_training_info.json', 'r') as f:
            info = json.load(f)
        
        ensemble_r2 = np.mean([v['r2'] for v in info['ensemble'].values()])
        print(f"Model Performance: R² = {ensemble_r2:.4f}")
        print(f"Elements Predicted: {len(info['model_info']['target_columns'])}")
        print(f"Ensemble Weights: LightGBM={info['model_info']['ensemble_weights'][0]}, CatBoost={info['model_info']['ensemble_weights'][1]}")
    except:
        pass
    
    print("=" * 75)

def get_element_composition_input():
    """Get current compositions for all elements (targets are static)."""
    print("\n" + "=" * 50)
    print("CURRENT COMPOSITION INPUT")
    print("=" * 50)
    
    # Static target values
    static_targets = {
        'C': 3.6,
        'Si': 2.4,
        'Mn': 0.25,
        'P': 0.025,
        'S': 0.005,
        'Cu': 0.225,
        'Mg': 0.0475
    }
    
    print("Target Composition (Fixed):")
    print("  C: 3.6%, Si: 2.4%, Mn: 0.25%, P: 0.025%")
    print("  S: 0.005%, Cu: 0.225%, Mg: 0.0475%")
    print("\nPlease enter current composition:")
    
    elements = ['C', 'Si', 'Mn', 'P', 'S', 'Cu', 'Mg']
    element_names = {
        'C': 'Carbon',
        'Si': 'Silicon', 
        'Mn': 'Manganese',
        'P': 'Phosphorus',
        'S': 'Sulfur',
        'Cu': 'Copper',
        'Mg': 'Magnesium'
    }
    
    compositions = {}
    
    for element in elements:
        print(f"\n{element_names[element]} ({element}):")
        
        while True:
            try:
                current = float(input(f"  Current {element} (%): "))
                if current >= 0:
                    break
                else:
                    print("  Please enter a non-negative value.")
            except ValueError:
                print("  Please enter a valid number.")
        
        # Use static target
        target = static_targets[element]
        compositions[element] = {'current': current, 'target': target}
    
    return compositions

def get_default_parameters():
    """Get default process parameters (no user input needed)."""
    # Default furnace and grade
    furnace = "F01"  # Default furnace
    grade = "EN1563"
    
    # Default element parameters
    default_params = {
        'C': {'min': 3.5, 'max': 3.7, 'absorption_rate': 90, 'cost_per_kg': 150, 'target_min': 3.5, 'target_max': 3.7},
        'Si': {'min': 2.3, 'max': 2.5, 'absorption_rate': 85, 'cost_per_kg': 120, 'target_min': 2.3, 'target_max': 2.5},
        'Mn': {'min': 0.2, 'max': 0.3, 'absorption_rate': 75, 'cost_per_kg': 400, 'target_min': 0.2, 'target_max': 0.3},
        'P': {'min': 0.0, 'max': 0.05, 'absorption_rate': 60, 'cost_per_kg': 300, 'target_min': 0.0, 'target_max': 0.05},
        'S': {'min': 0.0, 'max': 0.01, 'absorption_rate': 70, 'cost_per_kg': 250, 'target_min': 0.0, 'target_max': 0.01},
        'Cu': {'min': 0.15, 'max': 0.3, 'absorption_rate': 80, 'cost_per_kg': 700, 'target_min': 0.15, 'target_max': 0.3},
        'Mg': {'min': 0.035, 'max': 0.06, 'absorption_rate': 95, 'cost_per_kg': 2800, 'target_min': 0.035, 'target_max': 0.06}
    }
    
    return furnace, grade, default_params

def create_input_dataframe(compositions, furnace, grade, element_params):
    """Create input DataFrame for the model."""
    input_data = {}
    
    elements = ['C', 'Si', 'Mn', 'P', 'S', 'Cu', 'Mg']
    
    # Add element-specific data
    for element in elements:
        # Current and target compositions
        input_data[f'{element}_Current'] = [compositions[element]['current']]
        input_data[f'{element}_Target_Config'] = [compositions[element]['target']]
        
        # Element parameters
        params = element_params[element]
        input_data[f'{element}_Min'] = [params['min']]
        input_data[f'{element}_Max'] = [params['max']]
        input_data[f'{element}_Absorption_Rate'] = [params['absorption_rate']]
        input_data[f'{element}_Cost_Per_Kg'] = [params['cost_per_kg']]
        input_data[f'{element}_Target_Min'] = [params['target_min']]
        input_data[f'{element}_Target_Max'] = [params['target_max']]
    
    # Add furnace and grade
    input_data['Furnace_ID'] = [furnace]
    input_data['Grade_Code'] = [grade]
    
    # Create DataFrame
    df = pd.DataFrame(input_data)
    
    # Encode categorical columns
    le_furnace = LabelEncoder()
    le_grade = LabelEncoder()
    
    # Fit with all possible values
    furnace_values = ['F01', 'F02', 'F03', 'F04', 'F05']
    grade_values = ['EN1563']
    
    le_furnace.fit(furnace_values)
    le_grade.fit(grade_values)
    
    df['Furnace_ID'] = le_furnace.transform(df['Furnace_ID'])
    df['Grade_Code'] = le_grade.transform(df['Grade_Code'])
    
    # Feature engineering - add ratios, differences, and percentage changes
    for element in elements:
        current_col = f'{element}_Current'
        target_col = f'{element}_Target_Config'
        
        # Difference
        df[f'{element}_Diff'] = df[target_col] - df[current_col]
        
        # Ratio
        df[f'{element}_Ratio'] = df[target_col] / (df[current_col] + 1e-8)
        
        # Percentage change
        df[f'{element}_PctChange'] = (df[target_col] - df[current_col]) / (df[current_col] + 1e-8) * 100
    
    return df

def display_predictions(predictions, compositions):
    """Display Element_Config predictions in a formatted way."""
    print("\n" + "=" * 80)
    print("ELEMENT CONFIGURATION PREDICTIONS")
    print("=" * 80)
    
    elements = ['C', 'Si', 'Mn', 'P', 'S', 'Cu', 'Mg']
    element_names = {
        'C': 'Carbon',
        'Si': 'Silicon', 
        'Mn': 'Manganese',
        'P': 'Phosphorus',
        'S': 'Sulfur',
        'Cu': 'Copper',
        'Mg': 'Magnesium'
    }
    
    print(f"{'Element':<12} {'Current':<10} {'Target':<10} {'Element Config':<15} {'Config-Current':<15}")
    print("-" * 80)
    
    for element in elements:
        config_col = f'{element}_Element_Config'
        if config_col in predictions.columns:
            current = compositions[element]['current']
            target = compositions[element]['target']
            predicted = predictions[config_col].iloc[0]
            difference = predicted - current
            
            print(f"{element_names[element]:<12} {current:<10.4f} {target:<10.4f} {predicted:<15.4f} {difference:<+15.4f}")
    
    print("=" * 80)
    print("\nElement_Config: Optimized configuration values for alloy composition")
    print("Config-Current: Difference between predicted config and current values")

def main():
    """Main CLI interface."""
    display_welcome()
    
    # Load ensemble model
    ensemble_model = load_ensemble_model()
    if ensemble_model is None:
        return
    
    while True:
        print("\nOptions:")
        print("1. Predict Element Configuration")
        print("2. Exit")
        
        choice = input("\nSelect option (1-2): ").strip()
        
        if choice == '1':
            try:
                # Get current compositions (targets are static)
                compositions = get_element_composition_input()
                
                # Use default parameters (no user input needed)
                furnace, grade, element_params = get_default_parameters()
                
                # Create input DataFrame
                input_df = create_input_dataframe(compositions, furnace, grade, element_params)
                
                # Make prediction
                print("\nCalculating element configurations...")
                predictions = ensemble_model.predict(input_df)
                
                # Display results
                display_predictions(predictions, compositions)
                
            except KeyboardInterrupt:
                print("\n\nPrediction cancelled.")
            except Exception as e:
                print(f"\nError making prediction: {e}")
                print("Please check your inputs and try again.")
        
        elif choice == '2':
            print("\nGoodbye!")
            break
        
        else:
            print("Invalid option. Please select 1 or 2.")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nExiting...")
        sys.exit(0)
