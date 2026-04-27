import pandas as pd
import numpy as np
from prophet import Prophet
from sklearn.metrics import mean_absolute_error, mean_squared_error


# ================= IMPROVED MODEL =================
def create_model():
    model = Prophet(
        daily_seasonality=False,
        weekly_seasonality=True,
        yearly_seasonality=False,
        changepoint_prior_scale=2.5,     # 🔥 more flexible trend
        seasonality_prior_scale=35,      # 🔥 stronger seasonal learning
        interval_width=0.95
    )

    # 🔥 Capture repeating fluctuations
    model.add_seasonality(name='short_cycle', period=3, fourier_order=10)
    model.add_seasonality(name='medium_cycle', period=7, fourier_order=8)

    return model


def run_prophet_forecast(df, forecast_steps=7):
    try:
        df = df.copy()

        # ================= VALIDATION =================
        if 'ds' not in df.columns or 'y' not in df.columns:
            return {"status": "error", "message": "Data must contain ds and y"}

        df['ds'] = pd.to_datetime(df['ds'], errors='coerce')
        df = df.dropna(subset=['ds', 'y']).sort_values('ds')

        if len(df) < 30:
            return {"status": "error", "message": "Not enough data"}

        # ================= 🔥 LOG TRANSFORM =================
        df['y'] = np.log1p(df['y'])

        # ================= SPLIT =================
        split = int(len(df) * 0.8)
        train = df.iloc[:split]
        test = df.iloc[split:]

        # ================= TRAIN FOR EVALUATION =================
        model = create_model()
        model.fit(train)

        # ================= TEST PREDICTION =================
        test_forecast = model.predict(test[['ds']])
        y_true = np.expm1(test['y'].values)
        y_pred = np.expm1(test_forecast['yhat'].values)

        # ================= METRICS =================
        mae = mean_absolute_error(y_true, y_pred)
        rmse = np.sqrt(mean_squared_error(y_true, y_pred))

        mask = y_true > 10
        mape = (
            np.mean(np.abs((y_true[mask] - y_pred[mask]) / y_true[mask])) * 100
            if np.any(mask) else 0
        )

        ss_res = np.sum((y_true - y_pred) ** 2)
        ss_tot = np.sum((y_true - np.mean(y_true)) ** 2)
        r2 = 1 - (ss_res / ss_tot) if ss_tot != 0 else 0

        # ================= 🔥 FINAL MODEL =================
        final_model = create_model()
        final_model.fit(df)

        # ================= FUTURE FORECAST =================
        future_dates = pd.date_range(
            start=df['ds'].max() + pd.Timedelta(days=1),
            periods=forecast_steps
        )

        future_df = pd.DataFrame({'ds': future_dates})
        future_forecast = final_model.predict(future_df)

        forecast_output = []

        for i, row in enumerate(future_forecast.itertuples(), 1):
            value = float(np.expm1(row.yhat))  # 🔥 reverse log
            forecast_output.append({
                "day": f"Day {i}",
                "date": row.ds.strftime("%Y-%m-%d"),
                "value": round(value, 2)
            })

        # ================= HISTORICAL =================
        historical = [
            {
                "date": row['ds'].strftime("%Y-%m-%d"),
                "value": float(np.expm1(row['y']))
            }
            for _, row in df.tail(20).iterrows()
        ]

        return {
            "status": "success",
            "model": "Improved Prophet",
            "forecast": forecast_output,
            "metrics": {
                "MAE": float(mae),
                "RMSE": float(rmse),
                "MAPE": float(mape),
                "R2": float(r2)
            },
            "historical": historical,
            "data_points": len(df)
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}