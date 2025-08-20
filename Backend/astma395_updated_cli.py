#!/usr/bin/env python3
"""
ASTMA395 Element Configuration Prediction CLI - Updated Targets
Interactive command-line interface for predicting Element_Config values using ensemble model
specifically trained for ASTMA395 (Ferritic Ductile Iron) grade with updated target specifications.

Updated Target Specifications:
- C: 3.6%, Si: 3.0%, Mn: 0.725%, P: 0.0%, S: 0.004%, Cu: 0.175%, Mg: 0.04%
"""

import pandas as pd
import numpy as np
import joblib
import json
import sys

class ASTMA395UpdatedEnsembleModel:
    """Ensemble model specifically for ASTMA395 Element_Config prediction with updated targets."""
    
    def __init__(self, lgbm_models, catboost_models, lgbm_scaler=None, weights=None):
        self.lgbm_models = lgbm_models
        self.catboost_models = catboost_models
        self.lgbm_scaler = lgbm_scaler
        self.weights = weights or [0.5, 0.5]
        self.target_columns = list(lgbm_models.keys())
        self.grade = 'ASTMA395'
        self.target_specs = {
            'C': 3.6, 'Si': 3.0, 'Mn': 0.725, 'P': 0.0, 
            'S': 0.004, 'Cu': 0.175, 'Mg': 0.04
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

def load_astma395_updated_ensemble_model():
    """Load the trained ASTMA395 updated ensemble model."""
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
        
        ensemble_package = joblib.load('astma395_updated_ensemble_model.pkl')
        
        ensemble_model = ASTMA395UpdatedEnsembleModel(
            lgbm_models=ensemble_package['lgbm_models'],
            catboost_models=ensemble_package['catboost_models'],
            lgbm_scaler=ensemble_package['lgbm_scaler'],
            weights=ensemble_package['weights']
        )
        
        label_encoders = ensemble_package.get('label_encoders', {})
        
        print("SUCCESS: ASTMA395 Updated Element Config Ensemble model loaded successfully")
        return ensemble_model, label_encoders
    except Exception as e:
        print(f"ERROR: Failed to load ASTMA395 updated ensemble model: {e}")
        print("Please run astma395_updated_training.py first.")
        return None, None

def display_welcome():
    """Display welcome message and model information."""
    print("=" * 85)
    print("ASTMA395 ELEMENT CONFIGURATION PREDICTION - UPDATED TARGETS")
    print("=" * 85)
    print("This tool predicts Element_Config values for ASTMA395 (Ferritic Ductile Iron)")
    print("alloy optimization using an ensemble of LightGBM and CatBoost models.")
    print()
    print("🎯 ASTMA395 Updated Target Specifications:")
    print("  • Carbon (C): 3.6%")
    print("  • Silicon (Si): 3.0%")
    print("  • Manganese (Mn): 0.725% 🔥 UPDATED (3x higher than standard)")
    print("  • Phosphorus (P): 0.0% 🎯 UPDATED (zero phosphorus)")
    print("  • Sulfur (S): 0.004%")
    print("  • Copper (Cu): 0.175%")
    print("  • Magnesium (Mg): 0.04%")
    print()
    
    # Load and display model info
    try:
        with open('astma395_updated_training_info.json', 'r') as f:
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
    """Get current compositions for all elements (targets are fixed for ASTMA395 updated)."""
    print("\n" + "=" * 60)
    print("CURRENT COMPOSITION INPUT - ASTMA395 UPDATED")
    print("=" * 60)
    
    # ASTMA395 updated target values (fixed)
    target_specs = {
        'C': 3.6, 'Si': 3.0, 'Mn': 0.725, 'P': 0.0, 
        'S': 0.004, 'Cu': 0.175, 'Mg': 0.04
    }
    
    print("🎯 Target Composition for ASTMA395 Updated (Fixed):")
    print("  C: 3.6%, Si: 3.0%, Mn: 0.725% 🔥, P: 0.0% 🎯")
    print("  S: 0.004%, Cu: 0.175%, Mg: 0.04%")
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
        if element == 'Mn':
            print(f"\n{element_names[element]} ({element}) - Target: {target}% 🔥 (3x higher):")
        elif element == 'P':
            print(f"\n{element_names[element]} ({element}) - Target: {target}% 🎯 (zero P):")
        else:
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
        
        # Use ASTMA395-updated specific target
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

def get_astma395_updated_parameters():
    """Get default process parameters for ASTMA395 updated."""
    # ASTMA395-specific element parameters (updated for higher Mn and zero P)
    astma395_params = {
        'C': {'min': 3.4, 'max': 3.8, 'absorption_rate': 90, 'cost_per_kg': 150, 'target_min': 3.4, 'target_max': 3.8},
        'Si': {'min': 2.8, 'max': 3.2, 'absorption_rate': 85, 'cost_per_kg': 120, 'target_min': 2.8, 'target_max': 3.2},
        'Mn': {'min': 0.1, 'max': 1.0, 'absorption_rate': 75, 'cost_per_kg': 400, 'target_min': 0.1, 'target_max': 1.0},  # Extended for higher Mn
        'P': {'min': 0.0, 'max': 0.04, 'absorption_rate': 60, 'cost_per_kg': 300, 'target_min': 0.0, 'target_max': 0.04},  # Zero target
        'S': {'min': 0.0, 'max': 0.008, 'absorption_rate': 70, 'cost_per_kg': 250, 'target_min': 0.0, 'target_max': 0.008},
        'Cu': {'min': 0.1, 'max': 0.25, 'absorption_rate': 80, 'cost_per_kg': 700, 'target_min': 0.1, 'target_max': 0.25},
        'Mg': {'min': 0.025, 'max': 0.055, 'absorption_rate': 95, 'cost_per_kg': 2800, 'target_min': 0.025, 'target_max': 0.055}
    }
    
    return astma395_params

def create_input_dataframe(compositions, furnace, label_encoders):
    """Create input DataFrame for the ASTMA395 updated model."""
    input_data = {}
    
    elements = ['C', 'Si', 'Mn', 'P', 'S', 'Cu', 'Mg']
    astma395_params = get_astma395_updated_parameters()
    
    # Add element-specific data
    for element in elements:
        # Current and target compositions
        input_data[f'{element}_Current'] = [compositions[element]['current']]
        input_data[f'{element}_Target_Config'] = [compositions[element]['target']]
        
        # Element parameters for ASTMA395 updated
        params = astma395_params[element]
        input_data[f'{element}_Min'] = [params['min']]
        input_data[f'{element}_Max'] = [params['max']]
        input_data[f'{element}_Absorption_Rate'] = [params['absorption_rate']]
        input_data[f'{element}_Cost_Per_Kg'] = [params['cost_per_kg']]
        input_data[f'{element}_Target_Min'] = [params['target_min']]
        input_data[f'{element}_Target_Max'] = [params['target_max']]
    
    # Add furnace and grade
    input_data['Furnace_ID'] = [furnace]
    input_data['Grade_Code'] = ['ASTMA395']
    
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
            print(f"Warning: Unknown grade ASTMA395, using default encoding")
            df['Grade_Code'] = 0
    
    # Feature engineering - add ratios, differences, and percentage changes
    for element in elements:
        current_col = f'{element}_Current'
        target_col = f'{element}_Target_Config'
        
        # Difference
        df[f'{element}_Diff'] = df[target_col] - df[current_col]
        
        # Ratio (special handling for zero P target)
        if element == 'P':
            df[f'{element}_Ratio'] = 0.0  # Zero ratio for zero target
        else:
            df[f'{element}_Ratio'] = df[target_col] / (df[current_col] + 1e-8)
        
        # Percentage change (special handling for zero P target)
        if element == 'P':
            df[f'{element}_PctChange'] = -100.0 * df[current_col] / (df[current_col] + 1e-8)  # Negative change to zero
        else:
            df[f'{element}_PctChange'] = (df[target_col] - df[current_col]) / (df[current_col] + 1e-8) * 100
    
    return df

def display_predictions(predictions, compositions):
    """Display Element_Config predictions in a formatted way."""
    print("\n" + "=" * 105)
    print("ASTMA395 UPDATED ELEMENT CONFIGURATION PREDICTIONS")
    print("=" * 105)
    
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
    
    print(f"{'Element':<12} {'Current':<10} {'Target':<10} {'Element Config':<15} {'Config-Current':<15} {'Efficiency':<12} {'Status':<12}")
    print("-" * 105)
    
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
            if element == 'P' and target == 0.0:
                # Special handling for zero P target
                if current <= 0.001:
                    efficiency = 100.0  # Already near zero
                else:
                    efficiency = max(0, min(100, (1 - abs(predicted) / current) * 100))
            elif abs(target - current) > 1e-6:
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
            
            # Special highlighting for updated elements
            if element == 'Mn':
                status += " 🔥"
            elif element == 'P':
                status += " 🎯"
            
            total_adjustment += abs(difference)
            
            print(f"{element_names[element]:<12} {current:<10.4f} {target:<10.4f} {predicted:<15.4f} {difference:<+15.4f} {efficiency:<12.1f}% {status}")
    
    print("=" * 105)
    
    # Display optimization insights
    print("\n🎯 ASTMA395 UPDATED OPTIMIZATION INSIGHTS:")
    print(f"   • Total Element Adjustment: {total_adjustment:.4f}%")
    print(f"   • High Efficiency Elements (>80%): {high_efficiency_count}/{len(elements)}")
    avg_efficiency = np.mean([max(0, min(100, (1 - abs(compositions[elem]['target'] - predictions[f'{elem}_Element_Config'].iloc[0]) / abs(compositions[elem]['target'] - compositions[elem]['current'])) * 100)) if elem != 'P' and abs(compositions[elem]['target'] - compositions[elem]['current']) > 1e-6 else (100.0 if elem == 'P' and compositions[elem]['current'] <= 0.001 else max(0, min(100, (1 - abs(predictions[f'{elem}_Element_Config'].iloc[0]) / compositions[elem]['current']) * 100))) if elem == 'P' else 100.0 for elem in elements])
    print(f"   • Average Efficiency: {avg_efficiency:.1f}%")
    
    if critical_elements:
        print(f"   • Critical Elements (Low Efficiency): {', '.join(critical_elements)}")
    
    # Special analysis for Mn and P
    mn_current = compositions['Mn']['current']
    mn_target = compositions['Mn']['target']
    mn_predicted = predictions['Mn_Element_Config'].iloc[0]
    
    p_current = compositions['P']['current']
    p_target = compositions['P']['target']
    p_predicted = predictions['P_Element_Config'].iloc[0]
    
    print(f"\n🔥 MANGANESE UPDATE ANALYSIS:")
    print(f"   • Updated Mn Target: {mn_target:.4f}% (3x higher than standard 0.225%)")
    print(f"   • Current Mn Level: {mn_current:.4f}%")
    print(f"   • Predicted Mn Config: {mn_predicted:.4f}%")
    print(f"   • Mn Adjustment Needed: {abs(mn_predicted - mn_current):.4f}%")
    
    print(f"\n🎯 PHOSPHORUS ZERO TARGET ANALYSIS:")
    print(f"   • Zero P Target: {p_target:.4f}% (ultra-low phosphorus)")
    print(f"   • Current P Level: {p_current:.4f}%")
    print(f"   • Predicted P Config: {p_predicted:.4f}%")
    print(f"   • P Reduction Needed: {abs(p_predicted - p_current):.4f}%")
    
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
                if element == 'Mn':
                    priority = "🔥 HIGH" if abs(difference) > 0.1 else "🔸 MED"
                elif element == 'P':
                    priority = "🎯 HIGH" if abs(difference) > 0.005 else "🔹 LOW"
                else:
                    priority = "🔸 MED" if abs(difference) > 0.1 else "🔹 LOW"
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
    print("  • Element Config: Optimized configuration values for ASTMA395 updated alloy")
    print("  • Config-Current: Difference between predicted config and current values")
    print("  • Efficiency: How well the prediction moves toward updated target composition")
    print("  • 🔥 Mn target updated to 0.725% (3x higher than standard)")
    print("  • 🎯 P target updated to 0.0% (zero phosphorus)")
    print("  • Status: ✅ Good (>80%), ⚠️ Fair (50-80%), ❌ Poor (<50%)")

def main():
    """Main CLI interface for ASTMA395 updated."""
    display_welcome()
    
    # Load ensemble model
    ensemble_model, label_encoders = load_astma395_updated_ensemble_model()
    if ensemble_model is None:
        return
    
    while True:
        print("\nOptions:")
        print("1. Predict ASTMA395 Updated Element Configuration")
        print("2. View Updated Target Specifications")
        print("3. Compare with Standard ASTMA395")
        print("4. Exit")
        
        choice = input("\nSelect option (1-4): ").strip()
        
        if choice == '1':
            try:
                # Get current compositions (targets are fixed for ASTMA395 updated)
                compositions = get_element_composition_input()
                
                # Select furnace
                furnace = get_furnace_selection()
                
                # Create input DataFrame
                input_df = create_input_dataframe(compositions, furnace, label_encoders)
                
                # Make prediction
                print("\n🔄 Calculating ASTMA395 updated element configurations...")
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
            print("ASTMA395 UPDATED TARGET SPECIFICATIONS")
            print("=" * 60)
            print("ASTMA395 Updated (Ferritic Ductile Iron) Target Composition:")
            target_specs = {
                'C': 3.6, 'Si': 3.0, 'Mn': 0.725, 'P': 0.0, 
                'S': 0.004, 'Cu': 0.175, 'Mg': 0.04
            }
            
            standard_specs = {
                'C': 3.6, 'Si': 3.0, 'Mn': 0.225, 'P': 0.02, 
                'S': 0.004, 'Cu': 0.175, 'Mg': 0.04
            }
            
            print(f"{'Element':<12} {'Updated':<10} {'Standard':<10} {'Change':<20}")
            print("-" * 55)
            
            for elem in ['C', 'Si', 'Mn', 'P', 'S', 'Cu', 'Mg']:
                updated = target_specs[elem]
                standard = standard_specs[elem]
                if elem == 'Mn':
                    change = "3x INCREASE 🔥"
                elif elem == 'P':
                    change = "ZERO P 🎯"
                else:
                    change = "SAME" if abs(updated - standard) < 0.001 else "CHANGED"
                print(f"{elem:<12} {updated:<10.4f} {standard:<10.4f} {change}")
            
            print("\nKey Changes:")
            print("  🔥 Manganese (Mn): 0.225% → 0.725% (3.2x increase)")
            print("  🎯 Phosphorus (P): 0.020% → 0.000% (zero phosphorus)")
            print("\nMetallurgical Impact:")
            print("  • Higher Mn: Improved hardenability and strength")
            print("  • Zero P: Maximum ductility and toughness")
        
        elif choice == '3':
            print("\n" + "=" * 60)
            print("ASTMA395: UPDATED vs STANDARD COMPARISON")
            print("=" * 60)
            print("Manganese Content Impact:")
            print("  Standard ASTMA395: Mn = 0.225% (Low Mn)")
            print("    • Standard hardenability")
            print("    • Moderate strength")
            print("    • Good ductility")
            print()
            print("  Updated ASTMA395: Mn = 0.725% (High Mn)")
            print("    • Enhanced hardenability")
            print("    • Increased strength")
            print("    • Improved wear resistance")
            print("    • Better response to heat treatment")
            print()
            print("Phosphorus Content Impact:")
            print("  Standard ASTMA395: P ≤ 0.020% (Low P)")
            print("    • Good ductility")
            print("    • Standard properties")
            print()
            print("  Updated ASTMA395: P = 0.000% (Ultra-low P)")
            print("    • Maximum ductility")
            print("    • Excellent impact toughness")
            print("    • Superior weldability")
            print("    • Reduced segregation tendency")
            print()
            print("Applications:")
            print("  • Updated version suitable for:")
            print("    - High-strength structural components")
            print("    - Critical impact applications")
            print("    - Superior weldability requirements")
            print("    - Premium quality castings")
            print("  • Standard version suitable for:")
            print("    - General ferritic ductile iron uses")
            print("    - Standard structural applications")
            print("    - Cost-sensitive applications")
        
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
