#!/usr/bin/env python3
"""
ASTMA536 Element Configuration Training Pipeline - Updated Targets
Specialized training pipeline for ASTMA536 (Ductile Iron) grade with updated target configurations:
- Target C: 3.4%, Si: 2.6%, Mn: 0.275%, P: 0.40%, S: 0.0075%, Cu: 0.35%, Mg: 0.050%
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import lightgbm as lgb
from catboost import CatBoostRegressor
import joblib
import json
import warnings
warnings.filterwarnings('ignore')

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

def update_target_specifications(df):
    """Update the dataset with new target specifications."""
    print("=" * 60)
    print("UPDATING TARGET SPECIFICATIONS")
    print("=" * 60)
    
    # Updated target specifications
    updated_targets = {
        'C': 3.4, 'Si': 2.6, 'Mn': 0.275, 'P': 0.40, 
        'S': 0.0075, 'Cu': 0.35, 'Mg': 0.050
    }
    
    print("Original vs Updated Target Specifications:")
    elements = ['C', 'Si', 'Mn', 'P', 'S', 'Cu', 'Mg']
    
    for element in elements:
        target_col = f'{element}_Target_Config'
        if target_col in df.columns:
            original = df[target_col].iloc[0]
            updated = updated_targets[element]
            change = "CHANGED" if abs(original - updated) > 0.001 else "SAME"
            print(f"  {element}: {original:.4f}% → {updated:.4f}% ({change})")
            
            # Update the target configuration
            df[target_col] = updated
    
    print(f"\n✓ Updated target specifications for {len(elements)} elements")
    return df

def analyze_dataset(df):
    """Analyze the ASTMA536 dataset structure."""
    print("\n" + "=" * 60)
    print("ASTMA536 DATASET ANALYSIS - UPDATED TARGETS")
    print("=" * 60)
    
    print(f"Dataset Shape: {df.shape}")
    print(f"Missing Values: {df.isnull().sum().sum()}")
    print(f"Grade: {df['Grade_Code'].unique()[0]}")
    
    # Identify element columns
    elements = ['C', 'Si', 'Mn', 'P', 'S', 'Cu', 'Mg']
    
    # Feature columns
    feature_columns = []
    target_columns = []
    
    for element in elements:
        # Current composition
        current_col = f'{element}_Current'
        if current_col in df.columns:
            feature_columns.append(current_col)
        
        # Target configuration (input feature)
        target_config_col = f'{element}_Target_Config'
        if target_config_col in df.columns:
            feature_columns.append(target_config_col)
        
        # Element configuration (target to predict)
        element_config_col = f'{element}_Element_Config'
        if element_config_col in df.columns:
            target_columns.append(element_config_col)
        
        # Add other element-specific features
        for suffix in ['_Min', '_Max', '_Absorption_Rate', '_Cost_Per_Kg', '_Target_Min', '_Target_Max']:
            col = f'{element}{suffix}'
            if col in df.columns:
                feature_columns.append(col)
    
    # Add general features
    other_features = ['Furnace_ID', 'Grade_Code']
    for col in other_features:
        if col in df.columns:
            feature_columns.append(col)
    
    print(f"\nFeature Columns ({len(feature_columns)}):")
    for i, col in enumerate(feature_columns[:20]):
        print(f"  {i+1:2d}. {col}")
    if len(feature_columns) > 20:
        print(f"  ... and {len(feature_columns) - 20} more")
    
    print(f"\nTarget Columns (Element_Config to predict):")
    for i, col in enumerate(target_columns):
        print(f"  {i+1}. {col}")
    
    return feature_columns, target_columns, elements

def preprocess_data(df, feature_columns, target_columns):
    """Preprocess the dataset for training."""
    print("\n" + "=" * 60)
    print("DATA PREPROCESSING")
    print("=" * 60)
    
    # Create feature matrix and targets
    X = df[feature_columns].copy()
    y = df[target_columns].copy()
    
    # Handle categorical columns
    categorical_columns = ['Furnace_ID', 'Grade_Code']
    label_encoders = {}
    categorical_features = []
    
    for col in categorical_columns:
        if col in X.columns:
            le = LabelEncoder()
            X[col] = le.fit_transform(X[col].astype(str))
            label_encoders[col] = le
            categorical_features.append(X.columns.get_loc(col))
            print(f"Encoded {col}: {len(le.classes_)} unique values")
    
    # Feature engineering - create composition ratios and differences
    elements = ['C', 'Si', 'Mn', 'P', 'S', 'Cu', 'Mg']
    engineered_features = []
    
    for element in elements:
        current_col = f'{element}_Current'
        target_col = f'{element}_Target_Config'
        
        if current_col in X.columns and target_col in X.columns:
            # Difference between target and current
            diff_col = f'{element}_Diff'
            X[diff_col] = X[target_col] - X[current_col]
            engineered_features.append(diff_col)
            
            # Ratio of target to current
            ratio_col = f'{element}_Ratio'
            X[ratio_col] = X[target_col] / (X[current_col] + 1e-8)
            engineered_features.append(ratio_col)
            
            # Relative change percentage
            pct_change_col = f'{element}_PctChange'
            X[pct_change_col] = (X[target_col] - X[current_col]) / (X[current_col] + 1e-8) * 100
            engineered_features.append(pct_change_col)
    
    print(f"\nEngineered Features ({len(engineered_features)}):")
    for feature in engineered_features:
        print(f"  - {feature}")
    
    # Scale numerical features for LightGBM
    scaler = StandardScaler()
    numerical_columns = X.select_dtypes(include=[np.number]).columns
    X_scaled = X.copy()
    X_scaled[numerical_columns] = scaler.fit_transform(X[numerical_columns])
    
    print(f"\nScaled {len(numerical_columns)} numerical features")
    print(f"Final feature matrix shape: {X_scaled.shape}")
    print(f"Target matrix shape: {y.shape}")
    
    return X, X_scaled, y, scaler, label_encoders, categorical_features

def train_lightgbm_models(X_scaled, y, test_size=0.2, random_state=42):
    """Train LightGBM models for ASTMA536 Element_Config prediction."""
    print("\n" + "=" * 60)
    print("LIGHTGBM MODEL TRAINING - ASTMA536 UPDATED")
    print("=" * 60)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=test_size, random_state=random_state
    )
    
    print(f"Training set: {X_train.shape}")
    print(f"Test set: {X_test.shape}")
    
    # LightGBM parameters optimized for ASTMA536
    lgb_params = {
        'objective': 'regression',
        'metric': 'rmse',
        'boosting_type': 'gbdt',
        'num_leaves': 31,
        'learning_rate': 0.05,
        'feature_fraction': 0.9,
        'bagging_fraction': 0.8,
        'bagging_freq': 5,
        'verbose': -1,
        'n_estimators': 1000,
        'early_stopping_rounds': 100,
        'random_state': random_state
    }
    
    # Try GPU first, fallback to CPU
    gpu_params = lgb_params.copy()
    gpu_params.update({'device_type': 'gpu', 'max_bin': 255})
    
    lgbm_models = {}
    lgbm_training_info = {}
    
    for i, target_col in enumerate(y.columns):
        print(f"\nTraining LightGBM for {target_col} ({i+1}/{len(y.columns)})...")
        
        y_train_single = y_train.iloc[:, i]
        y_test_single = y_test.iloc[:, i]
        
        # Try GPU first
        try:
            print("  Attempting GPU training...")
            model = lgb.LGBMRegressor(**gpu_params)
            model.fit(
                X_train, y_train_single,
                eval_set=[(X_test, y_test_single)],
                callbacks=[lgb.early_stopping(100), lgb.log_evaluation(0)]
            )
            device_used = 'GPU'
        except Exception as e:
            print(f"  GPU failed: {str(e)[:50]}...")
            print("  Using CPU training...")
            model = lgb.LGBMRegressor(**lgb_params)
            model.fit(
                X_train, y_train_single,
                eval_set=[(X_test, y_test_single)],
                callbacks=[lgb.early_stopping(100), lgb.log_evaluation(0)]
            )
            device_used = 'CPU'
        
        # Evaluate
        y_pred_test = model.predict(X_test)
        test_rmse = np.sqrt(mean_squared_error(y_test_single, y_pred_test))
        test_mae = mean_absolute_error(y_test_single, y_pred_test)
        test_r2 = r2_score(y_test_single, y_pred_test)
        
        lgbm_models[target_col] = model
        lgbm_training_info[target_col] = {
            'test_rmse': test_rmse,
            'test_mae': test_mae,
            'test_r2': test_r2,
            'device_used': device_used
        }
        
        print(f"  Device: {device_used}")
        print(f"  Test RMSE: {test_rmse:.4f}")
        print(f"  Test MAE:  {test_mae:.4f}")
        print(f"  Test R²:   {test_r2:.4f}")
    
    return lgbm_models, lgbm_training_info, (X_train, X_test, y_train, y_test)

def train_catboost_models(X, y, categorical_features, test_size=0.2, random_state=42):
    """Train CatBoost models for ASTMA536 Element_Config prediction."""
    print("\n" + "=" * 60)
    print("CATBOOST MODEL TRAINING - ASTMA536 UPDATED")
    print("=" * 60)
    
    # Split data (use same random state for consistency)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state
    )
    
    # CatBoost parameters optimized for ASTMA536
    catboost_params = {
        'iterations': 1000,
        'learning_rate': 0.05,
        'depth': 6,
        'l2_leaf_reg': 3,
        'random_seed': random_state,
        'verbose': False,
        'early_stopping_rounds': 100,
        'task_type': 'GPU',
        'devices': '0'
    }
    
    catboost_models = {}
    catboost_training_info = {}
    
    for i, target_col in enumerate(y.columns):
        print(f"\nTraining CatBoost for {target_col} ({i+1}/{len(y.columns)})...")
        
        y_train_single = y_train.iloc[:, i]
        y_test_single = y_test.iloc[:, i]
        
        # Try GPU first
        try:
            print("  Attempting GPU training...")
            model = CatBoostRegressor(**catboost_params)
            model.fit(
                X_train, y_train_single,
                eval_set=(X_test, y_test_single),
                cat_features=categorical_features,
                use_best_model=True
            )
            device_used = 'GPU'
        except Exception as e:
            print(f"  GPU failed: {str(e)[:50]}...")
            print("  Using CPU training...")
            cpu_params = catboost_params.copy()
            cpu_params.update({'task_type': 'CPU'})
            cpu_params.pop('devices', None)
            
            model = CatBoostRegressor(**cpu_params)
            model.fit(
                X_train, y_train_single,
                eval_set=(X_test, y_test_single),
                cat_features=categorical_features,
                use_best_model=True
            )
            device_used = 'CPU'
        
        # Evaluate
        y_pred_test = model.predict(X_test)
        test_rmse = np.sqrt(mean_squared_error(y_test_single, y_pred_test))
        test_mae = mean_absolute_error(y_test_single, y_pred_test)
        test_r2 = r2_score(y_test_single, y_pred_test)
        
        catboost_models[target_col] = model
        catboost_training_info[target_col] = {
            'test_rmse': test_rmse,
            'test_mae': test_mae,
            'test_r2': test_r2,
            'device_used': device_used
        }
        
        print(f"  Device: {device_used}")
        print(f"  Test RMSE: {test_rmse:.4f}")
        print(f"  Test MAE:  {test_mae:.4f}")
        print(f"  Test R²:   {test_r2:.4f}")
    
    return catboost_models, catboost_training_info

def evaluate_ensemble(lgbm_models, catboost_models, X_test_scaled, X_test_raw, y_test, scaler):
    """Evaluate the ASTMA536 updated ensemble model."""
    print("\n" + "=" * 60)
    print("ASTMA536 UPDATED ENSEMBLE MODEL EVALUATION")
    print("=" * 60)
    
    ensemble_model = ASTMA536UpdatedEnsembleModel(
        lgbm_models=lgbm_models,
        catboost_models=catboost_models,
        lgbm_scaler=scaler,
        weights=[0.5, 0.5]
    )
    
    # Make ensemble predictions
    ensemble_predictions = ensemble_model.predict(X_test_raw)
    
    ensemble_results = {}
    for target in y_test.columns:
        y_true = y_test[target]
        y_pred = ensemble_predictions[target]
        
        rmse = np.sqrt(mean_squared_error(y_true, y_pred))
        mae = mean_absolute_error(y_true, y_pred)
        r2 = r2_score(y_true, y_pred)
        
        ensemble_results[target] = {'rmse': rmse, 'mae': mae, 'r2': r2}
        
        print(f"{target}:")
        print(f"  RMSE: {rmse:.4f}")
        print(f"  MAE:  {mae:.4f}")
        print(f"  R²:   {r2:.4f}")
    
    avg_r2 = np.mean([results['r2'] for results in ensemble_results.values()])
    avg_rmse = np.mean([results['rmse'] for results in ensemble_results.values()])
    
    print(f"\nASTMA536 Updated Ensemble Average Performance:")
    print(f"  RMSE: {avg_rmse:.4f}")
    print(f"  R²:   {avg_r2:.4f}")
    
    return ensemble_model, ensemble_results

def save_models(ensemble_model, lgbm_training_info, catboost_training_info, ensemble_results, label_encoders):
    """Save all ASTMA536 updated models and training information."""
    print("\n" + "=" * 60)
    print("SAVING ASTMA536 UPDATED MODELS")
    print("=" * 60)
    
    # Save ensemble model components
    ensemble_package = {
        'lgbm_models': ensemble_model.lgbm_models,
        'catboost_models': ensemble_model.catboost_models,
        'lgbm_scaler': ensemble_model.lgbm_scaler,
        'weights': ensemble_model.weights,
        'target_columns': ensemble_model.target_columns,
        'label_encoders': label_encoders,
        'grade': ensemble_model.grade,
        'target_specs': ensemble_model.target_specs
    }
    
    joblib.dump(ensemble_package, 'astma536_updated_ensemble_model.pkl')
    print("✓ Saved ASTMA536 updated ensemble model: astma536_updated_ensemble_model.pkl")
    
    # Save training information
    training_info = {
        'grade': 'ASTMA536',
        'version': 'Updated Targets',
        'target_specifications': ensemble_model.target_specs,
        'lightgbm': lgbm_training_info,
        'catboost': catboost_training_info,
        'ensemble': ensemble_results,
        'model_info': {
            'target_columns': ensemble_model.target_columns,
            'ensemble_weights': ensemble_model.weights,
            'grade': ensemble_model.grade
        }
    }
    
    # Convert numpy types for JSON serialization
    def convert_numpy(obj):
        if isinstance(obj, dict):
            return {k: convert_numpy(v) for k, v in obj.items()}
        elif isinstance(obj, (np.integer, np.floating)):
            return float(obj)
        else:
            return obj
    
    training_info = convert_numpy(training_info)
    
    with open('astma536_updated_training_info.json', 'w') as f:
        json.dump(training_info, f, indent=2)
    print("✓ Saved ASTMA536 updated training info: astma536_updated_training_info.json")

def main():
    """Main training pipeline for ASTMA536 with updated targets."""
    print("ASTMA536 Element Configuration Ensemble Training Pipeline - UPDATED TARGETS")
    print("=" * 70)
    print("Updated Target Specifications:")
    print("  C: 3.4%, Si: 2.6%, Mn: 0.275%, P: 0.40% (UPDATED)")
    print("  S: 0.0075%, Cu: 0.35%, Mg: 0.050%")
    print("=" * 70)
    
    # Load dataset
    print("Loading ASTMA536 dataset with ElementConfig...")
    df = pd.read_csv('ASTMA536_Dataset_with_ElementConfig/ASTMA536_with_element_config.csv')
    print(f"✓ Dataset loaded: {df.shape}")
    
    # Update target specifications
    df = update_target_specifications(df)
    
    # Analyze dataset
    feature_columns, target_columns, elements = analyze_dataset(df)
    
    # Preprocess data
    X_raw, X_scaled, y, scaler, label_encoders, categorical_features = preprocess_data(
        df, feature_columns, target_columns
    )
    
    # Train LightGBM models
    lgbm_models, lgbm_training_info, split_data = train_lightgbm_models(X_scaled, y)
    X_train, X_test_scaled, y_train, y_test = split_data
    
    # Get raw test data for CatBoost
    X_test_raw = X_raw.iloc[X_test_scaled.index]
    
    # Train CatBoost models
    catboost_models, catboost_training_info = train_catboost_models(
        X_raw, y, categorical_features
    )
    
    # Create and evaluate ensemble
    ensemble_model, ensemble_results = evaluate_ensemble(
        lgbm_models, catboost_models, X_test_scaled, X_test_raw, y_test, scaler
    )
    
    # Save everything
    save_models(ensemble_model, lgbm_training_info, catboost_training_info, ensemble_results, label_encoders)
    
    # Final summary
    print("\n" + "=" * 70)
    print("ASTMA536 UPDATED TRAINING COMPLETE")
    print("=" * 70)
    
    avg_r2 = np.mean([results['r2'] for results in ensemble_results.values()])
    print(f"ASTMA536 Updated Ensemble Model Performance: R² = {avg_r2:.4f}")
    print(f"Element Configurations Predicted: {len(target_columns)}")
    print(f"Features Used: {len(feature_columns)}")
    
    print("\nFiles created:")
    print("  - astma536_updated_ensemble_model.pkl")
    print("  - astma536_updated_training_info.json")
    
    print("\nUpdated Target Specifications:")
    for elem, target in ensemble_model.target_specs.items():
        print(f"  {elem}: {target}%")

if __name__ == "__main__":
    main()
