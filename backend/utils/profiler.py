import pandas as pd
import json

def profile_data(file_path):
    try:
        # Read the CSV
        df = pd.read_csv(file_path)
        
        # Extract metadata (Types, Missing Values, and Summary Stats)
        metadata = {
            "columns": list(df.columns),
            "data_types": {col: str(dtype) for col, dtype in df.dtypes.items()},
            "missing_values": df.isnull().sum().to_dict(),
            # Convert describe() to dict, dropping NaNs for clean JSON
            "summary_stats": df.describe().fillna(0).to_dict()
        }
        
        return json.dumps(metadata)
    except Exception as e:
        raise Exception(f"Error profiling data: {str(e)}")