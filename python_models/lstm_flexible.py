import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from lstm_model import LSTMModel
import sys
import json


class LSTMFlexible:
    def __init__(self, data, lookback=10):
        self.data = np.array(data)
        self.lookback = lookback
        self.model = LSTMModel(lookback=lookback)

    def run(self, steps=7):
        try:
            forecast = self.model.predict(self.data, steps=steps)
            forecast = [float(x) for x in forecast]

            actual = self.data[-len(forecast):]
            metrics = self.evaluate(actual, forecast)

            return {
                "forecast": forecast,
                "metrics": metrics
            }

        except Exception as e:
            return {"error": str(e)}

    def evaluate(self, forecast_values):
        try:
            actual = self.data[-len(forecast_values):]
            pred = np.array(forecast_values)

            min_len = min(len(actual), len(pred))
            actual = actual[:min_len]
            pred = pred[:min_len]

            mae = mean_absolute_error(actual, pred)
            rmse = np.sqrt(mean_squared_error(actual, pred))
            mape = np.mean(np.abs((actual - pred) / (actual + 1e-8))) * 100
            r2 = r2_score(actual, pred)

            return {
                "mae": float(mae),
                "rmse": float(rmse),
                "mape": float(mape),
                "r2_score": float(r2)
            }

        except Exception as e:
            return {"error": str(e)}


# ================= MAIN (FOR NODE) =================

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.stdin.read())
        values = input_data["values"]

        model = LSTMFlexible(values)
        result = model.run(steps=7)

        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))