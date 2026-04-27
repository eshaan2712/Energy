import sys
import json
import pandas as pd
import numpy as np

from lstm_model import run_lstm_forecast
from arima_flexible import run_arima_forecast
from prophet_flexible import run_prophet_forecast_flexible
from optimizer import optimize_energy


# ================= JSON SAFETY =================
def make_json_safe(obj):
    import numpy as np
    import pandas as pd

    if isinstance(obj, dict):
        return {k: make_json_safe(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [make_json_safe(v) for v in obj]
    elif isinstance(obj, (np.integer,)):
        return int(obj)
    elif isinstance(obj, (np.floating,)):
        return float(obj)
    elif isinstance(obj, (np.ndarray,)):
        return obj.tolist()
    elif isinstance(obj, (pd.Timestamp,)):
        return obj.strftime('%Y-%m-%d')
    return obj


# ================= DATAFRAME CREATION =================
def create_df(values):
    today = pd.Timestamp.today().normalize()

    return pd.DataFrame({
        "date": pd.date_range(end=today, periods=len(values)),
        "energy_consumed": values
    })


# ================= SAFE MODEL RUN =================
def safe_run(model_func, df, model_name):
    try:
        result = model_func(df)

        if not isinstance(result, dict):
            return {"status": "error", "message": f"{model_name} invalid"}

        if "status" not in result:
            result["status"] = "success"

        return result

    except Exception as e:
        return {"status": "error", "message": str(e)}


# ================= MAIN PIPELINE =================
def run_all(values):
    df = create_df(values)

    # Run models
    lstm_result = safe_run(run_lstm_forecast, df.copy(), "LSTM")
    arima_result = safe_run(run_arima_forecast, df.copy(), "ARIMA")

    prophet_df = df.rename(columns={
        "date": "ds",
        "energy_consumed": "y"
    })

    prophet_result = safe_run(run_prophet_forecast_flexible, prophet_df, "Prophet")

    # ================= ENSEMBLE FORECAST =================
    forecasts = []

    if lstm_result.get("status") == "success" and "forecast" in lstm_result:
        forecasts.append(lstm_result["forecast"])

    if arima_result.get("status") == "success" and "forecast" in arima_result:
        forecasts.append(arima_result["forecast"])

    if prophet_result.get("status") == "success" and "forecast" in prophet_result:
        forecasts.append(prophet_result["forecast"])

    final_forecast = None

    if forecasts:
        try:
            final_forecast = np.mean(np.array(forecasts), axis=0).tolist()
        except Exception:
            final_forecast = forecasts[0]  # fallback

    # ================= OPTIMIZATION =================
    optimization_result = None

    if final_forecast:
        optimization_result = optimize_energy(final_forecast)

    # ================= FINAL OUTPUT =================
    return {
        "status": "success",
        "models": {
            "lstm": lstm_result,
            "arima": arima_result,
            "prophet": prophet_result
        },
        "final_forecast": final_forecast,
        "optimization": optimization_result,
        "data_info": {
            "total_records": len(df),
            "date_range": {
                "start": df["date"].iloc[0].strftime("%Y-%m-%d"),
                "end": df["date"].iloc[-1].strftime("%Y-%m-%d")
            }
        }
    }


# ================= ENTRY POINT =================
if __name__ == "__main__":
    try:
        raw = sys.stdin.read()
        input_data = json.loads(raw)

        values = input_data.get("values")

        if not values or not isinstance(values, list):
            print(json.dumps({"status": "error", "message": "Invalid input"}))
            sys.exit(1)

        result = run_all(values)

        print(json.dumps(make_json_safe(result)))

    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}))