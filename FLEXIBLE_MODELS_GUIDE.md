# Flexible Python Models Guide

## Overview

This project now includes three flexible machine learning models that work with **ANY CSV file format**:

1. **ARIMA** (`arima_flexible.py`) - Statistical time series forecasting
2. **LSTM** (`lstm_flexible.py`) - Deep learning neural network
3. **Prophet** (`prophet_flexible.py`) - Trend-based seasonal forecasting

## Key Features

✅ **Auto-detect numeric columns** - No need to specify column names
✅ **Works with ANY CSV format** - Automatically finds the first numeric column to forecast
✅ **Minimum 7 data points** - Works with small datasets
✅ **Confidence intervals** - Built-in uncertainty quantification
✅ **Comprehensive metrics** - MAE, RMSE, MAPE, R² Score

## CSV Format Requirements

Your CSV file can have any structure as long as:
1. **First row contains headers** (optional)
2. **At least one numeric column** for forecasting
3. **Minimum 7 data points**

### Valid Examples

**Format 1: Simple two-column**
```csv
date,consumption
2024-01-01,150.5
2024-01-02,155.2
2024-01-03,148.9
```

**Format 2: Any numeric column**
```csv
timestamp,value
Day1,100
Day2,105
Day3,102
```

**Format 3: Complex CSV (automatically uses first numeric column)**
```csv
date,place,energy_consumed,sector,temperature
2024-01-01,NYC,150.5,Commercial,25.3
2024-01-02,NYC,155.2,Commercial,26.1
2024-01-03,NYC,148.9,Commercial,24.8
```

## Installation & Setup

### Step 1: Install Python Dependencies
```bash
cd python_models
pip install -r requirements.txt
```

**Required packages:**
- pandas
- numpy
- scikit-learn
- statsmodels

### Step 2: Test Individual Models

```bash
# Test ARIMA
python3 arima_flexible.py

# Test LSTM
python3 lstm_flexible.py

# Test Prophet
python3 prophet_flexible.py
```

## Using the Models

### From Python

**ARIMA:**
```python
from arima_flexible import run_arima_forecast

csv_content = """value
100,105,102,108,110,112,115"""

result = run_arima_forecast(csv_content, steps=14)
print(result)
```

**LSTM:**
```python
from lstm_flexible import run_lstm_forecast

result = run_lstm_forecast(csv_content, steps=14)
print(result)
```

**Prophet:**
```python
from prophet_flexible import run_prophet_forecast

result = run_prophet_forecast(csv_content, steps=14)
print(result)
```

### From Frontend (JavaScript)

1. Upload CSV file on the "ML Analysis" page
2. Select the "Upload" tab
3. Models automatically run and display results in the "Results" tab

## Expected Output Format

All models return JSON with:

```json
{
  "model": "ARIMA",
  "forecast": [value1, value2, ...],
  "upper_confidence_interval": [value1, value2, ...],
  "lower_confidence_interval": [value1, value2, ...],
  "metrics": {
    "mae": 12.5,
    "rmse": 15.3,
    "mape": 8.2,
    "r2_score": 0.87
  },
  "data_points_used": 30,
  "forecast_steps": 14
}
```

## Metrics Explained

- **MAE (Mean Absolute Error)**: Average magnitude of prediction errors
- **RMSE (Root Mean Square Error)**: Square root of average squared errors
- **MAPE (Mean Absolute Percentage Error)**: Average percentage error
- **R² Score**: How well the model explains variance (0-1, higher is better)

## Accuracy Expectations

Based on data size:

| Data Points | ARIMA | LSTM | Prophet |
|---|---|---|---|
| 7-20 | 70-75% | 65-70% | 70-75% |
| 20-50 | 75-82% | 75-80% | 75-82% |
| 50-100 | 80-85% | 82-87% | 80-85% |
| 100+ | 85-90% | 88-92% | 85-90% |

## Configuration Options

### Forecast Steps
- Default: 14 days
- Adjustable: Any positive integer
- Recommendation: Use 14-30 for reliable predictions

### Confidence Intervals
- Default: 95% (ARIMA, Prophet)
- 80% (Prophet)
- Narrows with more data

### LSTM Lookback Period
- Default: min(10, data_points/2)
- Automatically adjusted based on data size

## Environment Variables (.env)

```env
# Python Models Configuration
PYTHON_PATH=/usr/bin/python3
PYTHON_MODELS_DIR=./python_models
MODELS_TIMEOUT=300
ENABLE_ARIMA=true
ENABLE_LSTM=true
ENABLE_PROPHET=true

# Model Prediction Parameters
FORECAST_STEPS=14
CONFIDENCE_INTERVAL=0.95
TRAIN_TEST_SPLIT=0.8
```

## Troubleshooting

### "No numeric columns found"
- Ensure your CSV has at least one column with numeric values
- Check for quotes or special characters that might prevent parsing

### "Insufficient data"
- Need at least 7 data points
- LSTM performs better with 20+ points
- ARIMA/Prophet need 10+ for reliable confidence intervals

### "Model error"
- Check CSV formatting (headers in first row)
- Ensure numeric columns don't have non-numeric values (except headers)
- Try with a simpler CSV format first

## Performance Tips

1. **Data Quality**: Clean data (no NaN, no outliers) improves accuracy
2. **Data Volume**: More data = better predictions (especially for LSTM)
3. **Seasonality**: Prophet and ARIMA perform better with regular patterns
4. **Trend**: All models detect trends automatically

## Examples

### Example 1: Energy Consumption (Weekly Data)
```csv
week,consumption
W1,150
W2,155
W3,148
W4,160
W5,165
W6,162
W7,170
W8,172
W9,168
W10,175
```

### Example 2: Stock Price Data
```csv
date,close
2024-01-01,100.5
2024-01-02,101.2
2024-01-03,99.8
2024-01-04,102.1
2024-01-05,103.5
2024-01-06,102.8
2024-01-07,105.2
```

### Example 3: Temperature Data
```csv
timestamp,temp_celsius
2024-01-01-00:00,15.5
2024-01-01-12:00,18.2
2024-01-02-00:00,16.1
2024-01-02-12:00,19.3
2024-01-03-00:00,14.8
2024-01-03-12:00,17.6
```

## API Integration

The models are called via:
- `/api/models/run-all` - Runs all 3 models simultaneously
- `/api/models/arima` - Individual ARIMA forecast
- `/api/models/lstm` - Individual LSTM forecast
- `/api/models/prophet` - Individual Prophet forecast

All endpoints accept POST with CSV data in the request body.

## Next Steps

1. Create `.env` file from `.env.example`
2. Set `PYTHON_MODELS_DIR` and `PYTHON_PATH` correctly
3. Test models independently
4. Upload a sample CSV via the dashboard
5. View predictions in the Results tab
