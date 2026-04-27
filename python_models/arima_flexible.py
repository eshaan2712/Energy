import json
import sys
import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import warnings

warnings.filterwarnings('ignore')


class FlexibleARIMA:
    def __init__(self, df, column_name=None):
        self.df = df
        self.column_name = column_name
        self.data = None
        self.model = None
        self.forecast_result = None

    def parse_data(self):
        numeric_cols = self.df.select_dtypes(include=[np.number]).columns.tolist()

        if not numeric_cols:
            raise ValueError("No numeric columns found")

        col = self.column_name if self.column_name in numeric_cols else numeric_cols[0]

        self.data = self.df[col].dropna().values.astype(float)

        if len(self.data) < 10:
            raise ValueError(f"Need at least 10 data points, got {len(self.data)}")

        return col

    def fit(self, order=(2, 1, 2)):  # 🔥 better order
        self.model = ARIMA(self.data, order=order).fit()

    def forecast(self, steps=14):
        result = self.model.get_forecast(steps=steps)

        forecast = result.predicted_mean
        if hasattr(forecast, "values"):
            forecast = forecast.values

        conf = result.conf_int()

        if hasattr(conf, "iloc"):
            upper = conf.iloc[:, 1].values
            lower = conf.iloc[:, 0].values
        else:
            upper = conf[:, 1]
            lower = conf[:, 0]

        self.forecast_result = {
            "forecast": forecast.tolist(),
            "upper": upper.tolist(),
            "lower": lower.tolist()
        }

    def evaluate(self):
        preds = self.model.fittedvalues

        y_true = self.data[1:]
        y_pred = preds[1:]

        mae = mean_absolute_error(y_true, y_pred)
        rmse = np.sqrt(mean_squared_error(y_true, y_pred))
        mape = np.mean(np.abs((y_true - y_pred) / y_true)) * 100
        r2 = r2_score(y_true, y_pred)

        # 🔥 Fix R2 issues
        if np.isnan(r2) or np.isinf(r2):
            r2 = 0.0

        return {
            "MAE": float(mae),
            "RMSE": float(rmse),
            "MAPE": float(mape),
            "R2_Score": float(r2),
            "AIC": float(self.model.aic),
            "BIC": float(self.model.bic)
        }


def run_arima_forecast(data_input, steps=14, column_name=None):
    try:
        # ✅ Accept both DataFrame & CSV
        if isinstance(data_input, pd.DataFrame):
            df = data_input
        else:
            df = pd.read_csv(data_input)

        arima = FlexibleARIMA(df, column_name)

        column_used = arima.parse_data()
        arima.fit()
        arima.forecast(steps)
        metrics = arima.evaluate()

        return {
            "model": "ARIMA",
            "column_used": column_used,
            "forecast": arima.forecast_result["forecast"],
            "upper_bound": arima.forecast_result["upper"],
            "lower_bound": arima.forecast_result["lower"],
            "metrics": metrics,
            "data_points": len(arima.data),
            "steps": steps
        }

    except Exception as e:
        return {"error": str(e)}



