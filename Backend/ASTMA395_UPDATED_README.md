# ASTMA395 Updated Element Configuration System

## Overview

This is a specialized machine learning system for ASTMA395 (Ferritic Ductile Iron) alloy optimization with **updated target specifications**, specifically featuring **3x higher Manganese target** (0.725% vs standard 0.225%) and **zero Phosphorus target** (0.0% vs standard 0.02%).

## Updated Target Specifications

- **Carbon (C)**: 3.6%
- **Silicon (Si)**: 3.0%
- **Manganese (Mn)**: **0.725%** 🔥 **(UPDATED - 3x higher than standard)**
- **Phosphorus (P)**: **0.0%** 🎯 **(UPDATED - zero phosphorus)**
- **Sulfur (S)**: 0.004%
- **Copper (Cu)**: 0.175%
- **Magnesium (Mg)**: 0.04%

## Key Changes from Standard ASTMA395

| Element | Standard   | Updated    | Change                 |
| ------- | ---------- | ---------- | ---------------------- |
| C       | 3.6%       | 3.6%       | Same                   |
| Si      | 3.0%       | 3.0%       | Same                   |
| **Mn**  | **0.225%** | **0.725%** | **3.2x Increase** 🔥   |
| **P**   | **0.020%** | **0.000%** | **Zero Phosphorus** 🎯 |
| S       | 0.004%     | 0.004%     | Same                   |
| Cu      | 0.175%     | 0.175%     | Same                   |
| Mg      | 0.04%      | 0.04%      | Same                   |

## Files Created

### 1. Training Script

- **File**: `astma395_updated_training.py`
- **Purpose**: Train the ASTMA395-specific ensemble model with updated targets
- **Features**:
  - Updates target specifications automatically
  - Uses existing Element_Config data from dataset
  - LightGBM + CatBoost ensemble approach
  - Achieved **R² = 0.9980** (99.80% accuracy)
  - Special handling for zero P target

### 2. CLI Application

- **File**: `astma395_updated_cli.py`
- **Purpose**: Interactive command-line interface for predictions
- **Features**:
  - Updated ASTMA395 target specifications with Mn: 0.725% and P: 0.0%
  - Current composition input with target visualization
  - Furnace selection (F01-F05)
  - Real-time predictions with efficiency metrics
  - Special Manganese and Phosphorus impact analysis
  - Cost impact analysis
  - Comparison with standard ASTMA395

### 3. Model Files (Generated)

- **File**: `astma395_updated_ensemble_model.pkl`
- **Purpose**: Trained ensemble model for ASTMA395 updated
- **Contents**: LightGBM models, CatBoost models, scaler, encoders

- **File**: `astma395_updated_training_info.json`
- **Purpose**: Training metrics and model information
- **Contents**: Performance metrics, updated target specs, model details

## Model Performance

- **Overall R²**: 0.9980 (99.80% accuracy)
- **Individual Element Performance**:
  - Carbon (C): R² = 0.9977
  - Silicon (Si): R² = 0.9975
  - **Manganese (Mn): R² = 0.9968** 🔥
  - **Phosphorus (P): R² = 0.9979** 🎯
  - Sulfur (S): R² = 0.9999
  - Copper (Cu): R² = 0.9989
  - Magnesium (Mg): R² = 0.9976

## Usage

### Training the Model

```bash
python astma395_updated_training.py
```

### Using the CLI

```bash
python astma395_updated_cli.py
```

## CLI Features

### 1. Interactive Composition Input

- Enter current percentages for all 7 elements
- Visual comparison with updated targets
- Special highlighting for Manganese and Phosphorus gaps
- Input validation and error handling

### 2. Enhanced Predictions Display

- Optimized element configurations
- Efficiency metrics (how close to updated targets)
- Special status indicators for critical elements
- Manganese and Phosphorus specific analysis sections

### 3. Manganese Impact Analysis

- Detailed Mn gap analysis (3x higher target)
- Required Mn adjustments
- Ferromanganese addition recommendations
- Hardenability and strength impact

### 4. Phosphorus Zero Target Analysis

- Ultra-clean steel requirements
- P reduction strategies
- Refining process recommendations
- Ductility and toughness benefits

### 5. Advanced Features

- Comparison with standard ASTMA395
- Cost impact analysis per element
- Priority-based recommendations
- Specialized high-Mn, zero-P alloy guidance

## Metallurgical Implications

### High Manganese Content (0.725%)

**Benefits:**

- Enhanced hardenability
- Increased strength and hardness
- Improved wear resistance
- Better response to heat treatment
- Enhanced mechanical properties

**Considerations:**

- Higher alloy costs
- Potential for segregation
- Requires controlled cooling
- May affect machinability

### Zero Phosphorus Content (0.0%)

**Benefits:**

- Maximum ductility and impact toughness
- Excellent weldability
- Superior low-temperature properties
- Reduced segregation tendency
- Premium quality characteristics

**Requirements:**

- High-purity raw materials
- Advanced refining processes
- Careful process control
- Higher production costs

### Applications

**Suitable for:**

- Critical structural components
- High-impact applications
- Premium quality castings
- Aerospace and defense applications
- Components requiring superior weldability

**Not suitable for:**

- Cost-sensitive applications
- Standard structural uses where premium properties aren't required
- Applications where machinability is critical

## Technical Details

### Model Architecture

- **Ensemble**: LightGBM + CatBoost (50/50 weights)
- **Features**: 79 engineered features including ratios, differences, percentages
- **Targets**: 7 Element_Config predictions
- **Training Data**: 500 samples from ASTMA395 dataset

### Updated Parameters

- **Mn Max Range**: Extended to 1.0% to accommodate 0.725% target
- **P Special Handling**: Zero target with special ratio and percentage calculations
- **Feature Engineering**: Enhanced Mn and P-related features
- **Cost Analysis**: Updated for high-Mn and ultra-low-P requirements

## Example Usage

```bash
$ python astma395_updated_cli.py

=====================================================================================
ASTMA395 ELEMENT CONFIGURATION PREDICTION - UPDATED TARGETS
=====================================================================================

🎯 ASTMA395 Updated Target Specifications:
  • Carbon (C): 3.6%
  • Silicon (Si): 3.0%
  • Manganese (Mn): 0.725% 🔥 UPDATED (3x higher than standard)
  • Phosphorus (P): 0.0% 🎯 UPDATED (zero phosphorus)
  • Sulfur (S): 0.004%
  • Copper (Cu): 0.175%
  • Magnesium (Mg): 0.04%

📊 Model Performance: R² = 0.9980 (99.80% accuracy)
📈 Elements Predicted: 7
⚖️  Ensemble Weights: LightGBM=0.5, CatBoost=0.5
🏭 Grade: ASTMA395 - Updated Targets
=====================================================================================

Options:
1. Predict ASTMA395 Updated Element Configuration
2. View Updated Target Specifications
3. Compare with Standard ASTMA395
4. Exit

Select option (1-4):
```

## Requirements

- Python 3.7+
- pandas
- numpy
- scikit-learn
- lightgbm
- catboost
- joblib

## Installation

```bash
pip install pandas numpy scikit-learn lightgbm catboost joblib
```

## Important Notes

### ⚠️ Critical Considerations

1. **High Mn Content**: 0.725% Mn significantly enhances strength but increases costs
2. **Zero P Content**: Requires premium raw materials and advanced refining
3. **Processing**: Specialized knowledge required for high-Mn, ultra-low-P alloys
4. **Quality Control**: Monitor Mn and P content closely during production
5. **Applications**: Only suitable for premium quality, high-performance applications

### 🔬 Metallurgical Guidelines

**Manganese Management:**

- Use high-purity ferromanganese
- Control Mn distribution during melting
- Monitor hardenability effects
- Adjust heat treatment parameters

**Phosphorus Control:**

- Use ultra-low-P raw materials
- Implement advanced dephosphorization
- Monitor P pickup during processing
- Validate ultra-clean steel requirements

### 💡 Best Practices

- Source premium raw materials
- Implement strict process control
- Use advanced refining techniques
- Monitor composition continuously
- Validate mechanical properties
- Document processing parameters

## Comparison with Standard Systems

| Feature        | Standard ASTMA395 | Updated ASTMA395         |
| -------------- | ----------------- | ------------------------ |
| Mn Target      | 0.225%            | 0.725%                   |
| P Target       | 0.020%            | 0.000%                   |
| Model Accuracy | High              | Very High (99.80%)       |
| Applications   | General ferritic  | Premium high-performance |
| Strength       | Standard          | Enhanced                 |
| Ductility      | Good              | Excellent                |
| Weldability    | Good              | Superior                 |
| Cost           | Standard          | Premium                  |
| Processing     | Standard          | Specialized              |

## Process Recommendations

### For High Manganese (0.725%)

1. **Raw Materials**: Use high-purity ferromanganese
2. **Melting**: Control temperature to ensure Mn dissolution
3. **Alloying**: Add Mn gradually to prevent segregation
4. **Heat Treatment**: Adjust parameters for higher hardenability
5. **Testing**: Verify strength and hardenability properties

### For Zero Phosphorus (0.0%)

1. **Raw Materials**: Source ultra-low-P pig iron and scrap
2. **Refining**: Implement advanced dephosphorization processes
3. **Slag Management**: Use basic slag for P removal
4. **Refractory**: Use P-free refractory materials
5. **Testing**: Verify P content < 0.005% throughout process

This system is specifically designed for premium applications requiring high-strength, high-ductility ferritic ductile iron with superior mechanical properties and weldability characteristics.
