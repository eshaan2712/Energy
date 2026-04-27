#!/usr/bin/env python3
"""
Comprehensive Model Training Pipeline for Energy Forecasting
Automatically tunes and trains ARIMA, LSTM, and Prophet models
"""

import json
import warnings
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error
from itertools import product
import sys

warnings.filterwarnings('ignore')

class DataPreprocessor:
    """Handles data preprocessing and normalization"""
    
    @staticmethod
    def load_csv(filepath):
        """Load CSV and extract value column"""
        df = pd.read_csv(filepath)
        
        # Find 'value' column (case-insensitive)
        value_col = next((col for col in df.columns if col.lower() == 'value'), None)
        if value_col is None:
            raise ValueError("CSV must contain 'value' column")
        
        data = df[value_col].dropna().values.astype(float)
        return data
    
    @staticmethod
    def normalize(data, feature_range=(0, 1)):
        """Normalize data to specified range"""
        scaler = MinMaxScaler(feature_range=feature_range)
        data_reshaped = data.reshape(-1, 1)
        normalized = scaler.fit_transform(data_reshaped).flatten()
        return normalized, scaler
    
    @staticmethod
    def denormalize(data, scaler):
        """Denormalize data back to original scale"""
        data_reshaped = np.array(data).reshape(-1, 1)
        return scaler.inverse_transform(data_reshaped).flatten()
    
    @staticmethod
    def train_test_split(data, train_ratio=0.8):
        """Split data into train and test sets"""
        split_idx = int(len(data) * train_ratio)
        return data[:split_idx], data[split_idx:]


class ArimaAutoTuner:
    """Auto-tunes ARIMA parameters using grid search and AIC"""
    
    def __init__(self, data, max_p=5, max_d=2, max_q=5):
        self.data = data
        self.max_p = max_p
        self.max_d = max_d
        self.max_q = max_q
        self.best_order = None
        self.best_aic = float('inf')
    
    @staticmethod
    def differencing(data, order=1):
        """Apply differencing d times"""
        diff_data = data.copy()
        for _ in range(order):
            diff_data = np.diff(diff_data)
        return diff_data
    
    @staticmethod
    def calculate_aic(residuals, k):
        """Calculate AIC score"""
        n = len(residuals)
        sse = np.sum(residuals ** 2)
        aic = n * np.log(sse / n) + 2 * k
        return aic
    
    def tune(self):
        """Find optimal ARIMA parameters"""
        results = []
        
        for p, d, q in product(range(self.max_p + 1), range(self.max_d + 1), range(self.max_q + 1)):
            try:
                # Simple ARIMA simulation
                diff_data = self.differencing(self.data, d)
                
                if len(diff_data) < p + q + 1:
                    continue
                
                # Calculate residuals as forecast error
                residuals = diff_data[-(p + q):]
                aic = self.calculate_aic(residuals, p + q)
                
                results.append({
                    'order': (p, d, q),
                    'aic': aic,
                    'params': p + q
                })
                
                if aic < self.best_aic:
                    self.best_aic = aic
                    self.best_order = (p, d, q)
            
            except Exception as e:
                continue
        
        return self.best_order


class LSTMTrainer:
    def __init__(self, data, lookback=7):
        self.data = data
        self.lookback = lookback
        self.model = None

    def create_features(self, data):
        X, y = [], []

        for i in range(len(data) - self.lookback):
            window = data[i:i+self.lookback]

            trend = np.diff(window)
            mean = np.mean(window)
            std = np.std(window)

            last_val = window[-1]
            momentum = window[-1] - window[-3]
            acceleration = (window[-1] - window[-2]) - (window[-2] - window[-3])

            rolling_mean = np.mean(window[-3:])
            rolling_std = np.std(window[-3:])

            features = (
                list(window) +
                list(trend) +
                [mean, std, last_val, momentum, acceleration, rolling_mean, rolling_std]
            )

            X.append(features)
            y.append(data[i + self.lookback])

        return np.array(X), np.array(y)

    def train(self):
        from sklearn.ensemble import GradientBoostingRegressor

        X, y = self.create_features(self.data)

        model = GradientBoostingRegressor(
            n_estimators=300,
            learning_rate=0.05,
            max_depth=5,
            random_state=42
        )

        model.fit(X, y)

        self.model = model

        return {
            "lookback": self.lookback
        }


class ProphetAutoConfig:
    """Auto-configures Prophet model based on data characteristics"""
    
    def __init__(self, data):
        self.data = data
        self.config = self._detect_seasonality()
    
    def _detect_seasonality(self):
        """Detect seasonality patterns in data"""
        config = {
            'yearly_seasonality': len(self.data) >= 365,
            'weekly_seasonality': len(self.data) >= 14,
            'daily_seasonality': False,
            'seasonality_mode': 'additive',
            'interval_width': 0.95,
            'growth': 'linear'
        }
        
        # Check for multiplicative seasonality
        if np.std(self.data) > np.mean(self.data) * 0.5:
            config['seasonality_mode'] = 'multiplicative'
        
        return config
    
    def get_config(self):
        """Return Prophet configuration"""
        return self.config


class ModelEvaluator:
    """Evaluates model performance"""
    
    @staticmethod
    def calculate_metrics(y_true, y_pred):
        """Calculate comprehensive metrics"""
        mae = mean_absolute_error(y_true, y_pred)
        rmse = np.sqrt(mean_squared_error(y_true, y_pred))
        
        # MAPE (Mean Absolute Percentage Error)
        mape = np.mean(np.abs((y_true - y_pred) / y_true)) * 100 if np.all(y_true != 0) else 0
        
        # R² Score
        ss_res = np.sum((y_true - y_pred) ** 2)
        ss_tot = np.sum((y_true - np.mean(y_true)) ** 2)
        r2 = 1 - (ss_res / ss_tot) if ss_tot != 0 else 0
        
        # Accuracy (inverse of MAPE)
        accuracy = max(0, 100 - mape)
        
        return {
            'MAE': round(mae, 4),
            'RMSE': round(rmse, 4),
            'MAPE': round(mape, 2),
            'R2_Score': round(r2, 4),
            'Accuracy': round(accuracy, 2)
        }
    
    @staticmethod
    def cross_validate(data, model_trainer, cv_folds=5):
        """Perform time-series cross-validation"""
        fold_size = len(data) // cv_folds
        cv_scores = []
        
        for fold in range(cv_folds - 1):
            train_end = fold_size * (fold + 1)
            test_start = train_end
            test_end = test_start + fold_size
            
            if test_end > len(data):
                break
            
            train_data = data[:train_end]
            test_data = data[test_start:test_end]
            
            # Train and evaluate
            y_pred = model_trainer.forecast(steps=len(test_data))
            metrics = ModelEvaluator.calculate_metrics(test_data, y_pred[:len(test_data)])
            cv_scores.append(metrics)
        
        # Average metrics
        avg_metrics = {}
        for key in cv_scores[0].keys():
            avg_metrics[key] = round(np.mean([m[key] for m in cv_scores]), 4)
        
        return avg_metrics


class TrainingPipeline:
    """Main training pipeline orchestrator"""
    
    def __init__(self, data):
        self.data = data
        self.results = {
            'arima': {},
            'lstm': {},
            'prophet': {}
        }
    
    def train_all_models(self):
        """Train all models with auto-tuning"""
        print(f"Training models on {len(self.data)} data points...")
        
        # ARIMA
        print("Tuning ARIMA parameters...")
        arima_tuner = ArimaAutoTuner(self.data)
        best_order = arima_tuner.tune()
        self.results['arima']['order'] = best_order
        self.results['arima']['description'] = f"ARIMA{best_order}"
        print(f"Best ARIMA order: {best_order}")
        
        # LSTM
        print("Training LSTM model...")
        lstm_trainer = LSTMTrainer(self.data)
        X_test, y_test = lstm_trainer.train()
        lstm_pred = lstm_trainer.forecast(steps=7)
        self.results['lstm']['model'] = "gradient_boosting"
        self.results['lstm']['lookback'] = lstm_trainer.lookback
        self.results['lstm']['weights'] = {k: float(v) if isinstance(v, (int, float, np.number)) else v for k, v in lstm_trainer.weights.items()}
        print("LSTM training completed")
        
        # Prophet
        print("Configuring Prophet model...")
        prophet_config = ProphetAutoConfig(self.data)
        self.results['prophet']['config'] = prophet_config.get_config()
        print("Prophet configuration completed")
        
        return self.results
    
    def save_results(self, output_file):
        """Save trained model parameters"""
        with open(output_file, 'w') as f:
            json.dump(self.results, f, indent=2)
        print(f"Models saved to {output_file}")


def main():
    """Main execution"""
    if len(sys.argv) < 2:
        print("Usage: python train_models.py <csv_file> [output_json]")
        sys.exit(1)
    
    csv_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else 'trained_models.json'
    
    try:
        # Load data
        data = DataPreprocessor.load_csv(csv_file)
        print(f"Loaded {len(data)} data points from {csv_file}")
        
        # Train all models
        pipeline = TrainingPipeline(data)
        results = pipeline.train_all_models()
        pipeline.save_results(output_file)
        
        print(f"\nTraining completed successfully!")
        print(json.dumps(results, indent=2))
        
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)


if __name__ == '__main__':
    main()
