import pandas as pd
import numpy as np
import random
import os

def generate_en1563_dataset_single_row(num_heats=300, num_furnaces=5):
    """
    Generate EN1563 alloy dataset with Element Config field for each element
    """
    
    grade_spec = {
        'C': {'min': 3.40, 'max': 3.80, 'absorption_rate': 90, 'cost_per_kg': 150},
        'Si': {'min': 2.80, 'max': 3.20, 'absorption_rate': 85, 'cost_per_kg': 120},
        'Mn': {'min': 0.10, 'max': 0.35, 'absorption_rate': 75, 'cost_per_kg': 400},
        'P': {'min': 0.000, 'max': 0.040, 'absorption_rate': 60, 'cost_per_kg': 300},
        'S': {'min': 0.000, 'max': 0.008, 'absorption_rate': 70, 'cost_per_kg': 250},
        'Cu': {'min': 0.10, 'max': 0.25, 'absorption_rate': 80, 'cost_per_kg': 700},
        'Mg': {'min': 0.025, 'max': 0.055, 'absorption_rate': 95, 'cost_per_kg': 2800}
    }
    
    data = []
    
    for heat_num in range(1, num_heats + 1):
        heat_id = f"H{heat_num:03d}"
        furnace_id = f"F{(heat_num - 1) % num_furnaces + 1:02d}"
        
        record = {
            'Heat_ID': heat_id,
            'Furnace_ID': furnace_id,
            'Grade_Code': 'ASTMA395' 
        }
        
        for element, spec in grade_spec.items():
            target_config = (spec['min'] + spec['max']) / 2
            
            # Generate current values that give reasonable final costs
            if element == 'P':
                current = round(random.uniform(0.020, 0.040), 3)
            elif element == 'S':
                current = round(random.uniform(0.002, 0.008), 3)
            else:
                if random.random() < 0.8:
                    current = round(random.uniform(spec['min'], spec['max']), 3)
                else:
                    range_val = spec['max'] - spec['min']
                    if random.random() < 0.5:
                        current = round(spec['min'] - random.uniform(0, 0.1 * range_val), 3)
                    else:
                        current = round(spec['max'] + random.uniform(0, 0.1 * range_val), 3)
            
            current = max(0, current)
            
            # Calculate Element Config: (3000 × abs(current - mean(target_min, target_max))) / absorption_rate
            element_config = (3000 * abs(current - target_config)) / spec['absorption_rate']
            element_config = round(element_config, 4)
            
            # Final cost = Element Config × Cost per kg
            final_cost = element_config * spec['cost_per_kg']
            final_cost = round(final_cost, 2)
            
            # Add element columns to record
            record[f'{element}_Current'] = current
            record[f'{element}_Min'] = spec['min']
            record[f'{element}_Max'] = spec['max']
            record[f'{element}_Absorption_Rate'] = spec['absorption_rate']
            record[f'{element}_Cost_Per_Kg'] = spec['cost_per_kg']
            record[f'{element}_Target_Min'] = spec['min']
            record[f'{element}_Target_Max'] = spec['max']
            record[f'{element}_Target_Config'] = target_config
            record[f'{element}_Element_Config'] = element_config  # NEW FIELD
            record[f'{element}_Final_Cost'] = final_cost
        
        data.append(record)
    
    return pd.DataFrame(data)

def test_element_config_calculation():
    """Test the Element Config calculation for different elements"""
    
    print("Element Config Calculation Tests:")
    print("=" * 60)
    
    # Test cases for different elements
    test_cases = [
        {'element': 'P', 'current': 0.030, 'target': 0.025, 'absorption_rate': 60},
        {'element': 'C', 'current': 3.65, 'target': 3.60, 'absorption_rate': 90},
        {'element': 'Si', 'current': 2.45, 'target': 2.40, 'absorption_rate': 85},
        {'element': 'S', 'current': 0.005, 'target': 0.005, 'absorption_rate': 70}
    ]
    
    for case in test_cases:
        element = case['element']
        current = case['current']
        target = case['target']
        absorption_rate = case['absorption_rate']
        
        element_config = (3000 * abs(current - target)) / absorption_rate
        
        print(f"\n{element} Element:")
        print(f"  Current: {current}")
        print(f"  Target:  {target}")
        print(f"  Absorption Rate: {absorption_rate}")
        print(f"  Element Config: (3000 × abs({current} - {target})) / {absorption_rate}")
        print(f"  Element Config: (3000 × {abs(current - target)}) / {absorption_rate}")
        print(f"  Element Config: {element_config:.4f}")
        print("-" * 40)
def save_dataset_to_folder(df, folder_name='395_Dataset_with_ElementConfig', filename='395_with_element_config.csv'):
    if not os.path.exists(folder_name):
        os.makedirs(folder_name)
        print(f"Created folder: {folder_name}")
    
    file_path = os.path.join(folder_name, filename)
    df.to_csv(file_path, index=False)
    
    print(f"Dataset saved as: {file_path}")
    print(f"Total records: {len(df)}")
    print(f"Total columns: {len(df.columns)}")
    return file_path

def show_sample_data(df):
    """Show sample data with the new Element Config columns"""
    print("\nSample Data with Element Config:")
    print("=" * 80)
    
    # Show key columns including Element Config
    sample_cols = ['Heat_ID', 'Furnace_ID', 'Grade_Code', 
                   'C_Current', 'C_Element_Config', 'C_Final_Cost',
                   'P_Current', 'P_Element_Config', 'P_Final_Cost']
    
    print(df[sample_cols].head())
    
    print(f"\nTotal columns: {len(df.columns)}")
    
    # Show all Element Config columns
    element_config_cols = [col for col in df.columns if '_Element_Config' in col]
    print(f"\nElement Config columns: {element_config_cols}")

def show_column_structure_with_element_config(df):
    """Show the complete column structure including Element Config"""
    print("\nComplete Column Structure per Element:")
    print("=" * 60)
    elements = ['C', 'Si', 'Mn', 'P', 'S', 'Cu', 'Mg']
    
    for element in elements:
        element_cols = [col for col in df.columns if col.startswith(f'{element}_')]
        print(f"\n{element} Element Columns ({len(element_cols)} total):")
        for i, col in enumerate(element_cols, 1):
            if '_Element_Config' in col:
                print(f"  {i:2d}. {col} ← NEW FIELD")
            else:
                print(f"  {i:2d}. {col}")

# Main execution
if __name__ == "__main__":
    # Test the Element Config calculation first
    test_element_config_calculation()
    
    # Set random seed
    random.seed(42)
    np.random.seed(42)
    
    # Generate dataset with 300 records
    print("\nGenerating EN1563 dataset with Element Config field (300 records)...")
    df = generate_en1563_dataset_single_row(num_heats=700, num_furnaces=5)
    
    # Show sample data
    show_sample_data(df)
    
    # Show complete column structure
    show_column_structure_with_element_config(df)
    
    # Save dataset
    file_path = save_dataset_to_folder(df)
    
    print(f"\n✓ Dataset with Element Config field generated and saved!")
    print("Each element now has an Element_Config field showing the cost impact calculation.")