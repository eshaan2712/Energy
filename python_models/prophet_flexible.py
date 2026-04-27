import pandas as pd
import numpy as np
from prophet_model import run_prophet_forecast


def run_prophet_forecast_flexible(input_data, forecast_steps=14, column_name=None):
    try:
        if not isinstance(input_data, pd.DataFrame):
            return {"status": "error", "message": "Input must be DataFrame"}

        df = input_data.copy()

        # Detect date column
        if 'ds' not in df.columns:
            for c in df.columns:
                if any(x in c.lower() for x in ['date', 'time', 'day']):
                    df.rename(columns={c: 'ds'}, inplace=True)
                    break

        # Detect target column
        if 'y' not in df.columns:
            numeric_cols = df.select_dtypes(include=[np.number]).columns
            if len(numeric_cols) == 0:
                return {"status": "error", "message": "No numeric column"}
            df.rename(columns={numeric_cols[0]: 'y'}, inplace=True)

        df = df[['ds', 'y']].dropna()

        df['ds'] = pd.to_datetime(df['ds'], errors='coerce')
        df = df.dropna(subset=['ds'])
        df = df.sort_values('ds').drop_duplicates(subset=['ds'])

        df['y'] = pd.to_numeric(df['y'], errors='coerce')
        df = df.dropna(subset=['y'])

        if df['y'].nunique() < 2:
            return {"status": "error", "message": "No variation in data"}

        # 🔥 LESS AGGRESSIVE CLIPPING
        q_low, q_high = df['y'].quantile([0.05, 0.95])
        df['y'] = np.clip(df['y'], q_low, q_high)

        # 🔥 FOCUS ON RECENT DATA
        df = df.tail(min(len(df), 3000))

        if len(df) < 30:
            return {"status": "error", "message": "Not enough data"}

        return run_prophet_forecast(df, forecast_steps)

    except Exception as e:
        return {"status": "error", "message": str(e)}