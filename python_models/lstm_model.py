from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
import numpy as np
import json
import sys


# ================= FEATURE ENGINEERING =================
def create_features(data, window=7):  # ⚡ reduced window (faster)
    X, y = [], []

    for i in range(len(data) - window):
        w = data[i:i + window]

        # Lags
        lags = list(w)

        # Trend
        trend = np.diff(w)

        # Stats
        mean = np.mean(w)
        std = np.std(w)

        # Momentum (safe indexing)
        momentum = w[-1] - w[-2] if len(w) >= 2 else 0
        acceleration = (
            (w[-1] - w[-2]) - (w[-2] - w[-3])
            if len(w) >= 3 else 0
        )

        # Seasonal
        weekly_avg = np.mean(w[-7:]) if len(w) >= 7 else mean
        short_avg = np.mean(w[-3:]) if len(w) >= 3 else mean

        # Time feature
        time_idx = i / len(data)

        features = (
            lags +
            list(trend) +
            [mean, std,
             momentum, acceleration,
             weekly_avg, short_avg,
             time_idx]
        )

        X.append(features)
        y.append(data[i + window])

    return np.array(X), np.array(y)


# ================= MAIN =================
def run_lstm_forecast(df, place=None, sector=None, lookback=7, forecast_steps=7):
    try:
        # ================= FILTER =================
        if place:
            df = df[df['place'] == place]
        if sector:
            df = df[df['sector'] == sector]

        df = df.sort_values('date')
        values = df['energy_consumed'].values

        # ⚡ LIMIT DATA (BIG SPEED BOOST)
        values = values[-5000:]

        if len(values) < lookback + 20:
            return {"error": "Not enough data"}

        # ================= FEATURES =================
        X, y = create_features(values, lookback)

        # ================= SCALING =================
        scaler = StandardScaler()
        X = scaler.fit_transform(X)

        # ================= SPLIT =================
        split = int(len(X) * 0.9)
        X_train, X_test = X[:split], X[split:]
        y_train, y_test = y[:split], y[split:]

        # ================= MODEL =================
        model = GradientBoostingRegressor(
            n_estimators=80,      # ⚡ reduced from 120
            learning_rate=0.05,
            max_depth=3,          # ⚡ simpler tree
            subsample=0.8,
            random_state=42
        )

        model.fit(X_train, y_train)

        y_pred = model.predict(X_test)

        # ================= METRICS =================
        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        mape = np.mean(np.abs((y_test - y_pred) / (y_test + 1e-8))) * 100
        r2 = r2_score(y_test, y_pred)

        # ================= FORECAST =================
        last_window = values[-lookback:].tolist()
        forecast = []

        for step in range(forecast_steps):
            w = last_window

            trend = np.diff(w)
            mean = np.mean(w)
            std = np.std(w)

            momentum = w[-1] - w[-2] if len(w) >= 2 else 0
            acceleration = (
                (w[-1] - w[-2]) - (w[-2] - w[-3])
                if len(w) >= 3 else 0
            )

            weekly_avg = np.mean(w[-7:]) if len(w) >= 7 else mean
            short_avg = np.mean(w[-3:]) if len(w) >= 3 else mean

            time_idx = (len(values) + step) / len(values)

            features = (
                w +
                list(trend) +
                [mean, std,
                 momentum, acceleration,
                 weekly_avg, short_avg,
                 time_idx]
            )

            features = scaler.transform([features])
            pred = model.predict(features)[0]

            forecast.append(float(pred))
            last_window.pop(0)
            last_window.append(pred)

        return {
            "forecast": forecast,
            "metrics": {
                "mae": float(mae),
                "rmse": float(rmse),
                "mape": float(mape),
                "r2_score": float(r2)
            },
            "status": "success"
        }

    except Exception as e:
        return {
            "error": str(e),
            "status": "failed"
        }


# ================= NODE ENTRY =================
if __name__ == "__main__":
    try:
        input_data = json.loads(sys.stdin.read())
        values = input_data["values"]

        import pandas as pd
        df = pd.DataFrame({
            "date": pd.date_range(start="2020-01-01", periods=len(values)),
            "energy_consumed": values
        })

        result = run_lstm_forecast(df)
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))