"""
Final Improved ARIMA Model for Energy Consumption Forecasting
Fixed for project integration (column names, stability, JSON output)
"""

import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.stattools import adfuller
from sklearn.metrics import mean_absolute_error, mean_squared_error, mean_absolute_percentage_error
import json
import warnings

warnings.filterwarnings('ignore')


#  Stationarity Check
def check_stationarity(data):
    result = adfuller(data)
    return {
        'ADF Statistic': float(result[0]),
        'p_value': float(result[1]),
        'Stationary': bool(result[1] <= 0.05)
    }


class ARIMAEnergyModel:
    def __init__(self, order=(1, 1, 1)):
        self.order = order
        self.model = None
        self.results = None
        self.is_log_transformed = False

    #  Prepare Data (FIXED for your dataset)
    def prepare_data(self, df, place=None, sector=None):
        filtered_df = df.copy()

        if place:
            filtered_df = filtered_df[filtered_df['location'] == place]
        if sector:
            filtered_df = filtered_df[filtered_df['sector'] == sector]

        filtered_df['date'] = pd.to_datetime(filtered_df['date'])
        filtered_df = filtered_df.sort_values('date')

        filtered_df.set_index('date', inplace=True)

        # Safer frequency handling
        filtered_df = filtered_df.asfreq('D', method='pad')

        # Fill missing values
        filtered_df['value'] = filtered_df['value'].interpolate()

        energy_values = filtered_df['value'].values

        return energy_values, filtered_df

    #  Transform Data
    def transform_data(self, energy_values):
        stationarity = check_stationarity(energy_values)

        if not stationarity['Stationary']:
            energy_values = np.log1p(energy_values)
            self.is_log_transformed = True

        return energy_values, stationarity

    #  Inverse Transform
    def inverse_transform(self, values):
        if self.is_log_transformed:
            return np.expm1(values)
        return values

    #  Train Model
    def train(self, energy_values):
        try:
            self.model = ARIMA(energy_values, order=self.order)
            self.results = self.model.fit()

            return {
                'success': True,
                'aic': float(self.results.aic),
                'bic': float(self.results.bic)
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}

    #  Forecast
    def forecast(self, steps=7):
        if self.results is None:
            return {'error': 'Model not trained'}

        try:
            forecast_result = self.results.get_forecast(steps=steps)
            forecast_values = forecast_result.predicted_mean.values
            conf_int = forecast_result.conf_int(alpha=0.05)

            forecast_values = self.inverse_transform(forecast_values)

            return {
                'forecast': forecast_values.tolist(),
                'upper_bound': self.inverse_transform(conf_int.iloc[:, 1].values).tolist(),
                'lower_bound': self.inverse_transform(conf_int.iloc[:, 0].values).tolist(),
                'steps': steps
            }
        except Exception as e:
            return {'error': str(e)}

    # Metrics
    def calculate_metrics(self, y_true, y_pred):
        mae = mean_absolute_error(y_true, y_pred)
        rmse = np.sqrt(mean_squared_error(y_true, y_pred))
        mape = mean_absolute_percentage_error(y_true, y_pred)

        ss_res = np.sum((y_true - y_pred) ** 2)
        ss_tot = np.sum((y_true - np.mean(y_true)) ** 2)
        r2 = 1 - (ss_res / ss_tot)

        return {
            'MAE': round(float(mae), 4),
            'RMSE': round(float(rmse), 4),
            'MAPE': round(float(mape), 4),
            'R2_Score': round(float(r2), 4),
            'AIC': round(float(self.results.aic), 2) if self.results else None,
            'BIC': round(float(self.results.bic), 2) if self.results else None
        }

    # Backtesting
    def backtest(self, energy_values, train_size_ratio=0.8):
        train_size = int(len(energy_values) * train_size_ratio)

        train_data = energy_values[:train_size]
        test_data = energy_values[train_size:]

        try:
            model = ARIMA(train_data, order=self.order)
            results = model.fit()

            forecast = results.forecast(steps=len(test_data))

            forecast = self.inverse_transform(forecast)
            actual = self.inverse_transform(test_data)

            metrics = self.calculate_metrics(actual, forecast)

            return {
                'predictions': forecast.tolist(),
                'actual': actual.tolist(),
                'metrics': metrics
            }

        except Exception as e:
            return {'error': str(e)}


# MAIN FUNCTION (used by API)
def run_arima_forecast(csv_path, place=None, sector=None, order=(1, 1, 1), forecast_steps=7):
    try:
        df = pd.read_csv(csv_path)

        model = ARIMAEnergyModel(order=order)

        # Prepare data
        energy_values, _ = model.prepare_data(df, place, sector)

        if len(energy_values) < 10:
            return {'error': 'Insufficient data points'}

        # Transform
        energy_values, stationarity_info = model.transform_data(energy_values)

        # Train
        train_result = model.train(energy_values)
        if not train_result['success']:
            return train_result

        # Backtest
        backtest_result = model.backtest(energy_values)

        # Forecast
        forecast_result = model.forecast(steps=forecast_steps)

        # Train predictions
        train_pred = model.results.predict(start=1, end=len(energy_values)-1)
        actual = energy_values[1:]

        train_pred = model.inverse_transform(train_pred)
        actual = model.inverse_transform(actual)

        metrics = model.calculate_metrics(actual, train_pred)

        return {
            'model': 'ARIMA',
            'order': order,
            'forecast': forecast_result['forecast'],
            'upper_bound': forecast_result['upper_bound'],
            'lower_bound': forecast_result['lower_bound'],
            'metrics': metrics,
            'backtest': backtest_result,
            'stationarity': stationarity_info,
            'data_points': len(energy_values)
        }

    except Exception as e:
        return {'error': f'ARIMA Error: {str(e)}'}


# CLI ENTRY (used by Node.js)
if __name__ == '__main__':
    import sys

    csv_path = sys.argv[1]
    place = sys.argv[2] if len(sys.argv) > 2 else None
    sector = sys.argv[3] if len(sys.argv) > 3 else None

    result = run_arima_forecast(csv_path, place, sector)

    print(json.dumps(result))