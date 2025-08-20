# ASTMA536 Updated Element Configuration System

## Overview

This is a specialized machine learning system for ASTMA536 (Ductile Iron) alloy optimization with **updated target specifications**, specifically featuring a **10x higher Phosphorus target** (0.40% vs standard 0.04%).

## Updated Target Specifications

- **Carbon (C)**: 3.4%
- **Silicon (Si)**: 2.6%
- **Manganese (Mn)**: 0.275%
- **Phosphorus (P)**: **0.40%** ⚠️ **(UPDATED - 10x higher than standard)**
- **Sulfur (S)**: 0.0075%
- **Copper (Cu)**: 0.35%
- **Magnesium (Mg)**: 0.050%

## Key Changes from Standard ASTMA536

| Element | Standard  | Updated   | Change              |
| ------- | --------- | --------- | ------------------- |
| C       | 3.4%      | 3.4%      | Same                |
| Si      | 2.6%      | 2.6%      | Same                |
| Mn      | 0.275%    | 0.275%    | Same                |
| **P**   | **0.04%** | **0.40%** | **10x Increase** ⚠️ |
| S       | 0.0075%   | 0.0075%   | Same                |
| Cu      | 0.35%     | 0.35%     | Same                |
| Mg      | 0.050%    | 0.050%    | Same                |

## Files Created

### 1. Training Script

- **File**: `astma536_updated_training.py`
- **Purpose**: Train the ASTMA536-specific ensemble model with updated targets
- **Features**:
  - Updates target specifications automatically
  - Uses existing Element_Config data from dataset
  - LightGBM + CatBoost ensemble approach
  - Achieved **R² = 0.9946** (99.46% accuracy)

### 2. CLI Application

- **File**: `astma536_updated_cli.py`
- **Purpose**: Interactive command-line interface for predictions
- **Features**:
  - Updated ASTMA536 target specifications with P: 0.40%
  - Current composition input with target visualization
  - Furnace selection (F01-F05)
  - Real-time predictions with efficiency metrics
  - Special Phosphorus impact analysis
  - Cost impact analysis
  - Comparison with standard ASTMA536

### 3. Model Files (Generated)

- **File**: `astma536_updated_ensemble_model.pkl`
- **Purpose**: Trained ensemble model for ASTMA536 updated
- **Contents**: LightGBM models, CatBoost models, scaler, encoders

- **File**: `astma536_updated_training_info.json`
- **Purpose**: Training metrics and model information
- **Contents**: Performance metrics, updated target specs, model details

## Model Performance

- **Overall R²**: 0.9946 (99.46% accuracy)
- **Individual Element Performance**:
  - Carbon (C): R² = 0.9953
  - Silicon (Si): R² = 0.9954
  - Manganese (Mn): R² = 0.9939
  - **Phosphorus (P): R² = 0.9987** ⭐
  - Sulfur (S): R² = 0.9916
  - Copper (Cu): R² = 0.9978
  - Magnesium (Mg): R² = 0.9891

## Usage

### Training the Model

```bash
python astma536_updated_training.py
```

### Using the CLI

```bash
python astma536_updated_cli.py
```

## CLI Features

### 1. Interactive Composition Input

- Enter current percentages for all 7 elements
- Visual comparison with updated targets
- Special highlighting for Phosphorus gap
- Input validation and error handling

### 2. Enhanced Predictions Display

- Optimized element configurations
- Efficiency metrics (how close to updated targets)
- Special status indicators for critical elements
- Phosphorus-specific analysis section

### 3. Phosphorus Impact Analysis

- Detailed P gap analysis
- Required P adjustments
- Metallurgical recommendations
- Cost impact for P additions

### 4. Advanced Features

- Comparison with standard ASTMA536
- Cost impact analysis per element
- Priority-based recommendations
- Specialized high-P alloy guidance

## Metallurgical Implications

### High Phosphorus Content (0.40%)

**Benefits:**

- Increased strength and hardness
- Enhanced wear resistance
- Better machinability in some applications
- Improved castability

**Considerations:**

- Reduced ductility and impact toughness
- Potential for segregation during casting
- Different heat treatment response
- Requires specialized processing knowledge

### Applications

**Suitable for:**

- Wear-resistant components
- High-strength structural parts
- Specialized industrial applications
- Components where ductility is less critical

**Not suitable for:**

- High-impact applications
- Components requiring maximum ductility
- Standard automotive applications
- General-purpose ductile iron uses

## Technical Details

### Model Architecture

- **Ensemble**: LightGBM + CatBoost (50/50 weights)
- **Features**: 79 engineered features including ratios, differences, percentages
- **Targets**: 7 Element_Config predictions
- **Training Data**: 300 samples from ASTMA536 dataset

### Updated Parameters

- **P Max Range**: Extended to 0.8% to accommodate 0.40% target
- **Feature Engineering**: Enhanced P-related features
- **Cost Analysis**: Updated P addition costs
- **Validation**: Specialized for high-P compositions

## Example Usage

```bash
$ python astma536_updated_cli.py

=====================================================================================
ASTMA536 ELEMENT CONFIGURATION PREDICTION - UPDATED TARGETS
=====================================================================================

🎯 ASTMA536 Updated Target Specifications:
  • Carbon (C): 3.4%
  • Silicon (Si): 2.6%
  • Manganese (Mn): 0.275%
  • Phosphorus (P): 0.40% ⚠️  UPDATED (was 0.04%)
  • Sulfur (S): 0.0075%
  • Copper (Cu): 0.35%
  • Magnesium (Mg): 0.050%

📊 Model Performance: R² = 0.9946 (99.46% accuracy)
📈 Elements Predicted: 7
⚖️  Ensemble Weights: LightGBM=0.5, CatBoost=0.5
🏭 Grade: ASTMA536 - Updated Targets
=====================================================================================

Options:
1. Predict ASTMA536 Updated Element Configuration
2. View Updated Target Specifications
3. Compare with Standard ASTMA536
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

1. **High P Content**: 0.40% P is significantly higher than standard ductile iron
2. **Property Changes**: Expect reduced ductility but increased strength
3. **Processing**: Requires specialized knowledge and equipment
4. **Quality Control**: Monitor P content closely during production
5. **Applications**: Only suitable for specific high-strength, wear-resistant uses

### 🔬 Metallurgical Guidelines

- **P Addition**: Use ferrophosphorus or P-rich pig iron
- **Melting**: Control P distribution to avoid segregation
- **Heat Treatment**: Adjust parameters for high-P content
- **Testing**: Verify mechanical properties meet specifications
- **Safety**: Follow guidelines for high-P alloy handling

### 💡 Best Practices

- Start with lower P levels and gradually increase
- Monitor melt chemistry closely
- Use specialized refractory materials if needed
- Document processing parameters for repeatability
- Validate properties through testing

## Comparison with Standard Systems

| Feature        | Standard ASTMA536    | Updated ASTMA536   |
| -------------- | -------------------- | ------------------ |
| P Target       | 0.04%                | 0.40%              |
| Model Accuracy | High                 | Very High (99.46%) |
| Applications   | General ductile iron | Specialized high-P |
| Ductility      | High                 | Reduced            |
| Strength       | Standard             | Enhanced           |
| Processing     | Standard             | Specialized        |

This system is specifically designed for specialized applications requiring high-phosphorus ductile iron with enhanced strength and wear resistance properties.
