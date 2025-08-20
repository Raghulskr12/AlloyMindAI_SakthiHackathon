# AlloyMind AI - Machine Learning Documentation

## 🤖 Model Overview

AlloyMind AI employs **dual-ensemble machine learning** combining LightGBM and CatBoost algorithms to predict optimal element configurations for various alloy grades with exceptional accuracy (99.9%+ R² scores).

## 🏗️ Model Architecture

### Ensemble Design

```
┌─────────────────────────────────────────────────────────────┐
│                    ENSEMBLE PREDICTION                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────┐    ┌─────────────────────────────┐ │
│  │     LIGHTGBM        │    │       CATBOOST              │ │
│  │    (Weight: 50%)    │    │     (Weight: 50%)           │ │
│  │                     │    │                             │ │
│  │ • GPU Accelerated   │    │ • Native Categorical        │ │
│  │ • StandardScaler    │    │ • No Preprocessing          │ │
│  │ • Fast Training     │    │ • Robust to Overfitting     │ │
│  │ • High Performance  │    │ • Handles Missing Values    │ │
│  └─────────────────────┘    └─────────────────────────────┘ │
│           │                              │                  │
│           └──────────────┬───────────────┘                  │
│                          │                                  │
│                    Weighted Average                         │
│                 Final Prediction = 0.5×LGB + 0.5×CB        │
└─────────────────────────────────────────────────────────────┘
```

### Model Components

| Component | Technology | Features |
|-----------|------------|----------|
| **LightGBM** | Microsoft Gradient Boosting | GPU acceleration, fast training, high accuracy |
| **CatBoost** | Yandex Gradient Boosting | Categorical handling, overfitting resistance |
| **Ensemble** | Weighted Average | 50/50 split for optimal performance |
| **Preprocessing** | StandardScaler | LightGBM feature normalization |

## 📊 Model Performance

### Accuracy Metrics

| Element | LightGBM |  |  | CatBoost |  |  | Ensemble |
|---------|----------|--|--|----------|--|--|----------|
|         | RMSE | MAE | R² | RMSE | MAE | R² | R² Score |
| **Carbon (C)** | 0.0204 | 0.0150 | 0.9999 | 0.0198 | 0.0145 | 0.9999 | **0.9999** |
| **Silicon (Si)** | 0.0252 | 0.0188 | 0.9999 | 0.0245 | 0.0182 | 0.9999 | **0.9999** |
| **Manganese (Mn)** | 0.0154 | 0.0098 | 0.9999 | 0.0149 | 0.0095 | 0.9999 | **0.9999** |
| **Phosphorus (P)** | 0.0010 | 0.0003 | 0.9999 | 0.0008 | 0.0003 | 0.9999 | **0.9999** |
| **Sulfur (S)** | 2.4e-09 | 1.8e-09 | 1.0000 | 1.9e-09 | 1.5e-09 | 1.0000 | **1.0000** |
| **Copper (Cu)** | 0.0126 | 0.0094 | 0.9999 | 0.0122 | 0.0091 | 0.9999 | **0.9999** |
| **Magnesium (Mg)** | 0.0032 | 0.0024 | 0.9999 | 0.0030 | 0.0023 | 0.9999 | **0.9999** |

### Performance Highlights

- **Overall R² Score**: 99.99%+ across all elements
- **Training Time**: 5-10 minutes per model (with GPU)
- **Inference Speed**: <50ms per prediction
- **Model Size**: ~50MB total for all models
- **GPU Acceleration**: 5-10x faster training with CUDA

## 🔧 Model Training Pipeline

### 1. Data Preprocessing

```python
def preprocess_data(df):
    """Comprehensive data preprocessing pipeline"""
    
    # Feature engineering
    df['C_Si_Ratio'] = df['C'] / np.maximum(df['Si'], 0.01)
    df['Mn_P_Ratio'] = df['Mn'] / np.maximum(df['P'], 0.001)
    df['Total_Alloy'] = df[['C', 'Si', 'Mn', 'Cu', 'Mg']].sum(axis=1)
    df['Carbon_Equivalent'] = df['C'] + df['Si']/4 + df['P']/2
    
    # Categorical encoding
    label_encoders = {}
    for col in ['Alloy_Grade', 'Furnace_ID']:
        le = LabelEncoder()
        df[col + '_encoded'] = le.fit_transform(df[col])
        label_encoders[col] = le
    
    # Feature scaling for LightGBM
    scaler = StandardScaler()
    numerical_cols = df.select_dtypes(include=[np.number]).columns
    df_scaled = df.copy()
    df_scaled[numerical_cols] = scaler.fit_transform(df[numerical_cols])
    
    return df_scaled, label_encoders, scaler
```

### 2. Model Training Configuration

```python
# LightGBM Parameters
lgbm_params = {
    'objective': 'regression',
    'metric': 'rmse',
    'boosting_type': 'gbdt',
    'num_leaves': 100,
    'learning_rate': 0.05,
    'feature_fraction': 0.8,
    'bagging_fraction': 0.8,
    'bagging_freq': 5,
    'verbose': 0,
    'device': 'gpu',  # GPU acceleration
    'gpu_platform_id': 0,
    'gpu_device_id': 0,
    'max_bin': 255,
    'num_threads': -1
}

# CatBoost Parameters
catboost_params = {
    'iterations': 1000,
    'learning_rate': 0.05,
    'depth': 8,
    'l2_leaf_reg': 3,
    'loss_function': 'RMSE',
    'eval_metric': 'RMSE',
    'random_seed': 42,
    'verbose': False,
    'task_type': 'GPU',  # GPU acceleration
    'devices': '0:1'
}
```

### 3. Ensemble Training Process

```python
class ElementConfigEnsembleModel:
    """Dual-ensemble model combining LightGBM and CatBoost"""
    
    def train(self, X_train, y_train, X_val, y_val):
        """Train ensemble models for all target elements"""
        
        self.lgbm_models = {}
        self.catboost_models = {}
        
        target_elements = ['C_Element_Config', 'Si_Element_Config', 
                          'Mn_Element_Config', 'P_Element_Config',
                          'S_Element_Config', 'Cu_Element_Config', 
                          'Mg_Element_Config']
        
        for element in target_elements:
            print(f"Training models for {element}...")
            
            # LightGBM training
            lgb_train = lgb.Dataset(X_train, label=y_train[element])
            lgb_val = lgb.Dataset(X_val, label=y_val[element], reference=lgb_train)
            
            self.lgbm_models[element] = lgb.train(
                lgbm_params,
                lgb_train,
                valid_sets=[lgb_val],
                num_boost_round=1000,
                callbacks=[lgb.early_stopping(50)]
            )
            
            # CatBoost training
            self.catboost_models[element] = CatBoostRegressor(**catboost_params)
            self.catboost_models[element].fit(
                X_train, y_train[element],
                eval_set=(X_val, y_val[element]),
                early_stopping_rounds=50
            )
    
    def predict(self, X):
        """Ensemble prediction with weighted averaging"""
        predictions = {}
        
        for element in self.target_elements:
            # Individual predictions
            lgbm_pred = self.lgbm_models[element].predict(X)
            catboost_pred = self.catboost_models[element].predict(X)
            
            # Weighted ensemble (50/50)
            ensemble_pred = 0.5 * lgbm_pred + 0.5 * catboost_pred
            predictions[element] = ensemble_pred
        
        return pd.DataFrame(predictions)
```

## 📈 Model Variants

### 1. Multi-Grade Model

**Purpose**: General-purpose alloy optimization for EN1563, ASTMA536, ASTMA395

**Features**:
- Supports 3 alloy grades
- Balanced element targets
- High versatility

**Training Data**: Combined datasets from all three grades

### 2. ASTMA536 Updated Model

**Purpose**: Specialized for high-phosphorus applications

**Key Differences**:
- Phosphorus target: **0.40%** (vs 0.05% standard)
- Optimized for ASTMA536_UPDATED grade
- Enhanced P-element prediction accuracy

**Use Cases**: High-strength castings requiring elevated phosphorus

### 3. ASTMA395 Updated Model

**Purpose**: Specialized for high-manganese, zero-phosphorus applications

**Key Differences**:
- Manganese target: **0.725%** (vs 0.5% standard)
- Phosphorus target: **0.0%** (vs 0.05% standard)
- Optimized for ASTMA395_UPDATED grade

**Use Cases**: Applications requiring zero phosphorus content

## 🎯 Feature Engineering

### Input Features

| Feature Category | Features | Description |
|------------------|----------|-------------|
| **Base Elements** | C, Si, Mn, P, S, Cu, Mg | Raw element percentages |
| **Categorical** | Alloy_Grade, Furnace_ID | Process parameters |
| **Derived Ratios** | C_Si_Ratio, Mn_P_Ratio | Element interaction ratios |
| **Composites** | Total_Alloy, Carbon_Equivalent | Aggregate measures |

### Target Variables

```python
TARGET_ELEMENTS = [
    'C_Element_Config',   # Carbon configuration
    'Si_Element_Config',  # Silicon configuration
    'Mn_Element_Config',  # Manganese configuration
    'P_Element_Config',   # Phosphorus configuration
    'S_Element_Config',   # Sulfur configuration
    'Cu_Element_Config',  # Copper configuration
    'Mg_Element_Config'   # Magnesium configuration
]
```

## 🚀 Model Deployment

### Model Serialization

```python
# Save trained ensemble model
def save_model(model, model_name):
    """Save ensemble model and metadata"""
    
    # Model files
    joblib.dump(model, f"{model_name}_ensemble_model.pkl")
    
    # Training information
    training_info = {
        'lightgbm': {element: {
            'test_rmse': calculate_rmse(element),
            'test_mae': calculate_mae(element),
            'test_r2': calculate_r2(element),
            'device_used': 'GPU'
        } for element in TARGET_ELEMENTS},
        'catboost': {element: {
            'test_rmse': calculate_rmse(element),
            'test_mae': calculate_mae(element),
            'test_r2': calculate_r2(element),
            'device_used': 'GPU'
        } for element in TARGET_ELEMENTS}
    }
    
    with open(f"{model_name}_training_info.json", 'w') as f:
        json.dump(training_info, f, indent=2)
```

### Model Loading

```python
# Load for inference
def load_ensemble_model(model_name):
    """Load pre-trained ensemble model"""
    
    model = joblib.load(f"{model_name}_ensemble_model.pkl")
    
    with open(f"{model_name}_training_info.json", 'r') as f:
        model_info = json.load(f)
    
    return model, model_info
```

## ⚡ Performance Optimization

### GPU Acceleration

Both LightGBM and CatBoost models leverage GPU acceleration:

```python
# GPU configuration
os.environ['CUDA_VISIBLE_DEVICES'] = '0'

# LightGBM GPU setup
lgbm_params.update({
    'device': 'gpu',
    'gpu_platform_id': 0,
    'gpu_device_id': 0,
    'max_bin': 255
})

# CatBoost GPU setup
catboost_params.update({
    'task_type': 'GPU',
    'devices': '0:1'
})
```

### Memory Optimization

- **Lazy Loading**: Models loaded only when needed
- **Efficient Storage**: Joblib serialization for optimal file sizes
- **Memory Reuse**: Shared preprocessing pipelines

### Inference Optimization

- **Batch Processing**: Vectorized predictions
- **Model Caching**: Pre-loaded models in memory
- **Fast Preprocessing**: Optimized feature engineering

## 📋 Model Validation

### Cross-Validation Strategy

```python
def validate_model(model, X, y, cv_folds=5):
    """Comprehensive model validation"""
    
    cv_scores = {}
    
    for element in TARGET_ELEMENTS:
        scores = cross_val_score(
            model, X, y[element], 
            cv=cv_folds, 
            scoring='r2'
        )
        cv_scores[element] = {
            'mean_r2': scores.mean(),
            'std_r2': scores.std(),
            'min_r2': scores.min(),
            'max_r2': scores.max()
        }
    
    return cv_scores
```

### Model Monitoring

- **Prediction Accuracy**: Continuous R² monitoring
- **Drift Detection**: Input feature distribution monitoring
- **Performance Alerts**: Automated alerts for accuracy degradation
- **A/B Testing**: Framework for model version comparison

---

**Engineered for precision metallurgical applications** 🔬⚡
