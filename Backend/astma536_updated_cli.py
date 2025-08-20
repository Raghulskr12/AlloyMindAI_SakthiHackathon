#!/usr/bin/env python3
"""
ASTMA536 Element Configuration Prediction CLI - Updated Targets
Interactive command-line interface for predicting Element_Config values using ensemble model
specifically trained for ASTMA536 (Ductile Iron) grade with updated target specifications.

Updated Target Specifications:
- C: 3.4%, Si: 2.6%, Mn: 0.275%, P: 0.40%, S: 0.0075%, Cu: 0.35%, Mg: 0.050%
"""

import pandas as pd
import numpy as np
import joblib
import json
import sys

class ASTMA536UpdatedEnsembleModel:
    """Ensemble model specifically for ASTMA536 Element_Config prediction with updated targets."""
    
    def __init__(self, lgbm_models, catboost_models, lgbm_scaler=None, weights=None):
        self.lgbm_models = lgbm_models
        self.catboost_models = catboost_models
        self.lgbm_scaler = lgbm_scaler
        self.weights = weights or [0.5, 0.5]
        self.target_columns = list(lgbm_models.keys())
        self.grade = 'ASTMA536'
        self.target_specs = {
            'C': 3.4, 'Si': 2.6, 'Mn': 0.275, 'P': 0.40, 
            'S': 0.0075, 'Cu': 0.35, 'Mg': 0.050
        }
    
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

def load_astma536_updated_ensemble_model():
    """Load the trained ASTMA536 updated ensemble model."""
    try:
        # Import required libraries
        try:
            import lightgbm as lgb
            import catboost as cb
        except ImportError as e:
            print(f"ERROR: Missing required library: {e}")
            print("Please install required packages:")
            print("  pip install lightgbm catboost")
            return None, None
        
        ensemble_package = joblib.load('astma536_updated_ensemble_model.pkl')
        
        ensemble_model = ASTMA536UpdatedEnsembleModel(
            lgbm_models=ensemble_package['lgbm_models'],
            catboost_models=ensemble_package['catboost_models'],
            lgbm_scaler=ensemble_package['lgbm_scaler'],
            weights=ensemble_package['weights']
        )
        
        label_encoders = ensemble_package.get('label_encoders', {})
        
        print("SUCCESS: ASTMA536 Updated Element Config Ensemble model loaded successfully")
        return ensemble_model, label_encoders
    except Exception as e:
        print(f"ERROR: Failed to load ASTMA536 updated ensemble model: {e}")
        print("Please run astma536_updated_training.py first.")
        return None, None

def display_welcome():
    """Display welcome message and model information."""
    print("=" * 85)
    print("ASTMA536 ELEMENT CONFIGURATION PREDICTION - UPDATED TARGETS")
    print("=" * 85)
    print("This tool predicts Element_Config values for ASTMA536 (Ductile Iron)")
    print("alloy optimization using an ensemble of LightGBM and CatBoost models.")
    print()
    print("🎯 ASTMA536 Updated Target Specifications:")
    print("  • Carbon (C): 3.4%")
    print("  • Silicon (Si): 2.6%")
    print("  • Manganese (Mn): 0.275%")
    print("  • Phosphorus (P): 0.40% ⚠️  UPDATED (was 0.04%)")
    print("  • Sulfur (S): 0.0075%")
    print("  • Copper (Cu): 0.35%")
    print("  • Magnesium (Mg): 0.050%")
    print()
    
    # Load and display model info
    try:
        with open('astma536_updated_training_info.json', 'r') as f:
            info = json.load(f)
        
        ensemble_r2 = np.mean([v['r2'] for v in info['ensemble'].values()])
        print(f"📊 Model Performance: R² = {ensemble_r2:.4f} ({ensemble_r2*100:.2f}% accuracy)")
        print(f"📈 Elements Predicted: {len(info['model_info']['target_columns'])}")
        print(f"⚖️  Ensemble Weights: LightGBM={info['model_info']['ensemble_weights'][0]}, CatBoost={info['model_info']['ensemble_weights'][1]}")
        print(f"🏭 Grade: {info['grade']} - {info.get('version', 'Updated Targets')}")
    except:
        pass
    
    print("=" * 85)

def get_element_composition_input():
    """Get current compositions for all elements (targets are fixed for ASTMA536 updated)."""
    print("\n" + "=" * 60)
    print("CURRENT COMPOSITION INPUT - ASTMA536 UPDATED")
    print("=" * 60)
    
    # ASTMA536 updated target values (fixed)
    target_specs = {
        'C': 3.4, 'Si': 2.6, 'Mn': 0.275, 'P': 0.40, 
        'S': 0.0075, 'Cu': 0.35, 'Mg': 0.050
    }
    
    print("🎯 Target Composition for ASTMA536 Updated (Fixed):")
    print("  C: 3.4%, Si: 2.6%, Mn: 0.275%, P: 0.40% ⚠️")
    print("  S: 0.0075%, Cu: 0.35%, Mg: 0.050%")
    print("\n📝 Please enter current composition:")
    
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
        target = target_specs[element]
        print(f"\n{element_names[element]} ({element}) - Target: {target}%:")
        
        while True:
            try:
                current = float(input(f"  Current {element} (%): "))
                if current >= 0:
                    break
                else:
                    print("  Please enter a non-negative value.")
            except ValueError:
                print("  Please enter a valid number.")
        
        # Use ASTMA536-updated specific target
        compositions[element] = {'current': current, 'target': target}
    
    return compositions

def get_furnace_selection():
    """Allow user to select furnace."""
    furnaces = ['F01', 'F02', 'F03', 'F04', 'F05']
    
    print("\n" + "=" * 30)
    print("FURNACE SELECTION")
    print("=" * 30)
    
    print("Available furnaces:")
    for i, furnace in enumerate(furnaces, 1):
        print(f"  {i}. {furnace}")
    
    while True:
        try:
            choice = int(input(f"\nSelect furnace (1-{len(furnaces)}) [default: 1]: ") or "1")
            if 1 <= choice <= len(furnaces):
                selected_furnace = furnaces[choice - 1]
                print(f"✓ Selected: {selected_furnace}")
                return selected_furnace
            else:
                print(f"Please enter a number between 1 and {len(furnaces)}")
        except ValueError:
            print("Please enter a valid number")

def get_astma536_updated_parameters():
    """Get default process parameters for ASTMA536 updated."""
    # ASTMA536-specific element parameters (updated for higher P target)
    astma536_params = {
        'C': {'min': 3.2, 'max': 3.6, 'absorption_rate': 90, 'cost_per_kg': 150, 'target_min': 3.2, 'target_max': 3.6},
        'Si': {'min': 2.4, 'max': 2.8, 'absorption_rate': 85, 'cost_per_kg': 120, 'target_min': 2.4, 'target_max': 2.8},
        'Mn': {'min': 0.15, 'max': 0.4, 'absorption_rate': 75, 'cost_per_kg': 400, 'target_min': 0.15, 'target_max': 0.4},
        'P': {'min': 0.0, 'max': 0.8, 'absorption_rate': 60, 'cost_per_kg': 300, 'target_min': 0.0, 'target_max': 0.8},  # Updated for higher P
        'S': {'min': 0.0, 'max': 0.015, 'absorption_rate': 70, 'cost_per_kg': 250, 'target_min': 0.0, 'target_max': 0.015},
        'Cu': {'min': 0.2, 'max': 0.5, 'absorption_rate': 80, 'cost_per_kg': 700, 'target_min': 0.2, 'target_max': 0.5},
        'Mg': {'min': 0.03, 'max': 0.07, 'absorption_rate': 95, 'cost_per_kg': 2800, 'target_min': 0.03, 'target_max': 0.07}
    }
    
    return astma536_params

def create_input_dataframe(compositions, furnace, label_encoders):
    """Create input DataFrame for the ASTMA536 updated model."""
    input_data = {}
    
    elements = ['C', 'Si', 'Mn', 'P', 'S', 'Cu', 'Mg']
    astma536_params = get_astma536_updated_parameters()
    
    # Add element-specific data
    for element in elements:
        # Current and target compositions
        input_data[f'{element}_Current'] = [compositions[element]['current']]
        input_data[f'{element}_Target_Config'] = [compositions[element]['target']]
        
        # Element parameters for ASTMA536 updated
        params = astma536_params[element]
        input_data[f'{element}_Min'] = [params['min']]
        input_data[f'{element}_Max'] = [params['max']]
        input_data[f'{element}_Absorption_Rate'] = [params['absorption_rate']]
        input_data[f'{element}_Cost_Per_Kg'] = [params['cost_per_kg']]
        input_data[f'{element}_Target_Min'] = [params['target_min']]
        input_data[f'{element}_Target_Max'] = [params['target_max']]
    
    # Add furnace and grade
    input_data['Furnace_ID'] = [furnace]
    input_data['Grade_Code'] = ['ASTMA536']
    
    # Create DataFrame
    df = pd.DataFrame(input_data)
    
    # Encode categorical columns using saved encoders
    if 'Furnace_ID' in label_encoders:
        try:
            df['Furnace_ID'] = label_encoders['Furnace_ID'].transform(df['Furnace_ID'])
        except ValueError as e:
            print(f"Warning: Unknown furnace {furnace}, using default encoding")
            df['Furnace_ID'] = 0
    
    if 'Grade_Code' in label_encoders:
        try:
            df['Grade_Code'] = label_encoders['Grade_Code'].transform(df['Grade_Code'])
        except ValueError as e:
            print(f"Warning: Unknown grade ASTMA536, using default encoding")
            df['Grade_Code'] = 0
    
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
    print("\n" + "=" * 100)
    print("ASTMA536 UPDATED ELEMENT CONFIGURATION PREDICTIONS")
    print("=" * 100)
    
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
    
    print(f"{'Element':<12} {'Current':<10} {'Target':<10} {'Element Config':<15} {'Config-Current':<15} {'Efficiency':<12} {'Status':<10}")
    print("-" * 100)
    
    total_adjustment = 0
    high_efficiency_count = 0
    critical_elements = []
    
    for element in elements:
        config_col = f'{element}_Element_Config'
        if config_col in predictions.columns:
            current = compositions[element]['current']
            target = compositions[element]['target']
            predicted = predictions[config_col].iloc[0]
            difference = predicted - current
            
            # Calculate efficiency (how close the prediction gets us to target)
            if abs(target - current) > 1e-6:
                efficiency = max(0, min(100, (1 - abs(target - predicted) / abs(target - current)) * 100))
            else:
                efficiency = 100.0
            
            if efficiency > 80:
                high_efficiency_count += 1
                status = "✅ Good"
            elif efficiency > 50:
                status = "⚠️  Fair"
            else:
                status = "❌ Poor"
                critical_elements.append(element)
            
            # Special highlighting for Phosphorus (updated target)
            if element == 'P':
                status += " 🎯"
            
            total_adjustment += abs(difference)
            
            print(f"{element_names[element]:<12} {current:<10.4f} {target:<10.4f} {predicted:<15.4f} {difference:<+15.4f} {efficiency:<12.1f}% {status}")
    
    print("=" * 100)
    
    # Display optimization insights
    print("\n🎯 ASTMA536 UPDATED OPTIMIZATION INSIGHTS:")
    print(f"   • Total Element Adjustment: {total_adjustment:.4f}%")
    print(f"   • High Efficiency Elements (>80%): {high_efficiency_count}/{len(elements)}")
    avg_efficiency = np.mean([max(0, min(100, (1 - abs(compositions[elem]['target'] - predictions[f'{elem}_Element_Config'].iloc[0]) / abs(compositions[elem]['target'] - compositions[elem]['current'])) * 100)) if abs(compositions[elem]['target'] - compositions[elem]['current']) > 1e-6 else 100.0 for elem in elements])
    print(f"   • Average Efficiency: {avg_efficiency:.1f}%")
    
    if critical_elements:
        print(f"   • Critical Elements (Low Efficiency): {', '.join(critical_elements)}")
    
    # Special note about Phosphorus
    p_current = compositions['P']['current']
    p_target = compositions['P']['target']
    p_predicted = predictions['P_Element_Config'].iloc[0]
    print(f"\n🎯 PHOSPHORUS UPDATE ANALYSIS:")
    print(f"   • Updated P Target: {p_target:.4f}% (10x higher than standard 0.04%)")
    print(f"   • Current P Level: {p_current:.4f}%")
    print(f"   • Predicted P Config: {p_predicted:.4f}%")
    print(f"   • P Adjustment Needed: {abs(p_predicted - p_current):.4f}%")
    
    print("\n📊 RECOMMENDED ACTIONS:")
    action_count = 0
    for element in elements:
        config_col = f'{element}_Element_Config'
        if config_col in predictions.columns:
            current = compositions[element]['current']
            predicted = predictions[config_col].iloc[0]
            difference = predicted - current
            
            if abs(difference) > 0.001:  # Only show significant adjustments
                action = "Add" if difference > 0 else "Reduce"
                priority = "🔥 HIGH" if element == 'P' else ("🔸 MED" if abs(difference) > 0.1 else "🔹 LOW")
                print(f"   • {element}: {action} {abs(difference):.4f}% (from {current:.4f}% to {predicted:.4f}%) - {priority}")
                action_count += 1
    
    if action_count == 0:
        print("   • ✅ Current composition is well-optimized!")
    
    # Cost analysis
    print("\n💰 ESTIMATED COST IMPACT:")
    cost_per_kg = {'C': 150, 'Si': 120, 'Mn': 400, 'P': 300, 'S': 250, 'Cu': 700, 'Mg': 2800}
    total_cost_impact = 0
    
    for element in elements:
        config_col = f'{element}_Element_Config'
        if config_col in predictions.columns:
            current = compositions[element]['current']
            predicted = predictions[config_col].iloc[0]
            adjustment = abs(predicted - current)
            cost_impact = adjustment * cost_per_kg[element]
            total_cost_impact += cost_impact
            
            if adjustment > 0.001:
                print(f"   • {element}: {adjustment:.4f}% adjustment → ${cost_impact:.2f}/tonne")
    
    print(f"   • 💵 Total estimated cost impact: ${total_cost_impact:.2f}/tonne")
    
    print("\n📋 Legend:")
    print("  • Element Config: Optimized configuration values for ASTMA536 updated alloy")
    print("  • Config-Current: Difference between predicted config and current values")
    print("  • Efficiency: How well the prediction moves toward updated target composition")
    print("  • 🎯 P target updated to 0.40% (10x higher than standard)")
    print("  • Status: ✅ Good (>80%), ⚠️ Fair (50-80%), ❌ Poor (<50%)")

def main():
    """Main CLI interface for ASTMA536 updated."""
    display_welcome()
    
    # Load ensemble model
    ensemble_model, label_encoders = load_astma536_updated_ensemble_model()
    if ensemble_model is None:
        return
    
    while True:
        print("\nOptions:")
        print("1. Predict ASTMA536 Updated Element Configuration")
        print("2. View Updated Target Specifications")
        print("3. Compare with Standard ASTMA536")
        print("4. Exit")
        
        choice = input("\nSelect option (1-4): ").strip()
        
        if choice == '1':
            try:
                # Get current compositions (targets are fixed for ASTMA536 updated)
                compositions = get_element_composition_input()
                
                # Select furnace
                furnace = get_furnace_selection()
                
                # Create input DataFrame
                input_df = create_input_dataframe(compositions, furnace, label_encoders)
                
                # Make prediction
                print("\n🔄 Calculating ASTMA536 updated element configurations...")
                predictions = ensemble_model.predict(input_df)
                
                # Display results
                display_predictions(predictions, compositions)
                
            except KeyboardInterrupt:
                print("\n\nPrediction cancelled.")
            except Exception as e:
                print(f"\nError making prediction: {e}")
                print("Please check your inputs and try again.")
        
        elif choice == '2':
            print("\n" + "=" * 60)
            print("ASTMA536 UPDATED TARGET SPECIFICATIONS")
            print("=" * 60)
            print("ASTMA536 Updated (Ductile Iron) Target Composition:")
            target_specs = {
                'C': 3.4, 'Si': 2.6, 'Mn': 0.275, 'P': 0.40, 
                'S': 0.0075, 'Cu': 0.35, 'Mg': 0.050
            }
            
            standard_specs = {
                'C': 3.4, 'Si': 2.6, 'Mn': 0.275, 'P': 0.04, 
                'S': 0.0075, 'Cu': 0.35, 'Mg': 0.050
            }
            
            print(f"{'Element':<12} {'Updated':<10} {'Standard':<10} {'Change':<15}")
            print("-" * 50)
            
            for elem in ['C', 'Si', 'Mn', 'P', 'S', 'Cu', 'Mg']:
                updated = target_specs[elem]
                standard = standard_specs[elem]
                change = "UPDATED" if abs(updated - standard) > 0.001 else "SAME"
                if elem == 'P':
                    change += " 🎯"
                print(f"{elem:<12} {updated:<10.4f} {standard:<10.4f} {change}")
            
            print("\nKey Changes:")
            print("  🎯 Phosphorus (P): 0.04% → 0.40% (10x increase)")
            print("  📈 This significantly changes alloy properties")
            print("  ⚗️  Higher P content affects strength and ductility")
        
        elif choice == '3':
            print("\n" + "=" * 60)
            print("ASTMA536: UPDATED vs STANDARD COMPARISON")
            print("=" * 60)
            print("Phosphorus Content Impact:")
            print("  Standard ASTMA536: P ≤ 0.04% (Low P)")
            print("    • Higher ductility")
            print("    • Better impact resistance")
            print("    • Easier machining")
            print()
            print("  Updated ASTMA536: P = 0.40% (High P)")
            print("    • Increased strength")
            print("    • Reduced ductility")
            print("    • Enhanced wear resistance")
            print("    • Different heat treatment response")
            print()
            print("Applications:")
            print("  • High P version suitable for:")
            print("    - Wear-resistant components")
            print("    - High-strength applications")
            print("    - Specialized industrial uses")
            print("  • Standard version suitable for:")
            print("    - General ductile iron applications")
            print("    - Automotive components")
            print("    - Pipe and fittings")
        
        elif choice == '4':
            print("\nGoodbye!")
            break
        
        else:
            print("Invalid option. Please select 1, 2, 3, or 4.")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nExiting...")
        sys.exit(0)
