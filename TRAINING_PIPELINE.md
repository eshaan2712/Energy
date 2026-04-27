# Training Pipeline Documentation

## Overview

The training pipeline automatically tunes and trains ARIMA, LSTM, and Prophet models based on your uploaded dataset. It performs:

- **ARIMA Parameter Tuning**: Grid search over (p,d,q) space with AIC optimization
- **LSTM Hyperparameter Optimization**: Automatic lookback window and weight calculation
- **Prophet Auto-Configuration**: Detects seasonality and configures accordingly
- **Cross-Validation**: Time-series aware validation for robust performance estimates

## File Structure

```
/scripts/
  └── train_models.py          # Main training pipeline (Python)

/lib/
  └── model-loader.js          # Node.js model loader utility

/app/api/
  └── train/route.js           # API endpoint for triggering training
```

## Quick Start

### 1. Local Training (Development)

```bash
# Install dependencies
pip install numpy pandas scikit-learn

# Run training on CSV file
python scripts/train_models.py /path/to/your/data.csv trained_models.json

# Output: trained_models.json with optimized parameters
```

### 2. API Training (Production)

```bash
# Trigger training via API
curl -X POST http://localhost:3000/api/train \
  -H "Content-Type: application/json" \
  -d '{
    "csvPath": "./public/data.csv",
    "outputPath": "trained_models.json"
  }'
```

### 3. Check Training Status

```bash
curl http://localhost:3000/api/train?path=trained_models.json
```

## Model Training Details

### ARIMA Auto-Tuning

- **Search Space**: p ∈ [0,5], d ∈ [0,2], q ∈ [0,5]
- **Optimization Metric**: AIC (Akaike Information Criterion)
- **Output**: Best (p,d,q) triplet
- **Best For**: Linear, stationary patterns

Example output:
```json
{
  "arima": {
    "order": [1, 1, 1],
    "description": "ARIMA(1,1,1)"
  }
}
```

### LSTM Training

- **Architecture**: Automatic lookback window (10 by default)
- **Normalization**: MinMax scaling (0,1)
- **Training Method**: Sequential learning with trend capture
- **Output**: Weights for future predictions
- **Best For**: Non-linear, complex patterns

Example output:
```json
{
  "lstm": {
    "lookback": 10,
    "weights": {
      "mean": 651.19,
      "std": 208.5,
      "trend": 2.3
    }
  }
}
```

### Prophet Configuration

- **Seasonality Detection**: Automatic yearly/weekly detection
- **Trend Modeling**: Linear growth curve
- **Intervals**: 95% confidence intervals
- **Output**: Configuration parameters
- **Best For**: Strong seasonal patterns

Example output:
```json
{
  "prophet": {
    "config": {
      "yearly_seasonality": true,
      "weekly_seasonality": true,
      "daily_seasonality": false,
      "seasonality_mode": "additive"
    }
  }
}
```

## Integration with Your App

### Using Trained Models in Components

```javascript
import { getModelLoader } from '@/lib/model-loader';

const loader = getModelLoader();
loader.loadModels('trained_models.json');

// Get ARIMA configuration
const arimaConfig = loader.getArimaConfig();
// Returns: { order: [1, 1, 1], description: '...' }

// Get LSTM configuration
const lstmConfig = loader.getLstmConfig();
// Returns: { lookback: 10, weights: {...} }

// Get Prophet configuration
const prophetConfig = loader.getProphetConfig();
// Returns: { yearly_seasonality: true, ... }

// Check if trained models are loaded
if (loader.hasTrainedModels()) {
  console.log('Using trained models');
} else {
  console.log('Using default parameters');
}
```

### Updating Models API

The models-engine.js can be updated to use trained parameters:

```javascript
export class ArimaModel {
  constructor(data, order = null) {
    // Use trained order if available
    const loader = getModelLoader();
    this.order = order || loader.getArimaConfig().order;
    this.data = data;
  }
  // ... rest of implementation
}
```

## Dataset Requirements

- **Format**: CSV with columns: dataset_id, date, value, sector, location
- **Minimum Points**: 2 (but 50+ recommended for better training)
- **Value Column**: Numeric energy consumption data
- **Missing Data**: Automatically handled via dropna()

Example CSV:
```
dataset_id,date,value,sector,location
1,2024-01-01,430.5,residential,Illinois
1,2024-01-02,409.88,residential,Illinois
1,2024-01-03,207.34,residential,Illinois
...
```

## Performance Metrics

Each model reports:

- **MAE** (Mean Absolute Error): Average prediction error in same units as data
- **RMSE** (Root Mean Squared Error): Penalizes larger errors more heavily
- **MAPE** (Mean Absolute Percentage Error): Error as percentage of actual values
- **R² Score**: Proportion of variance explained (1.0 = perfect)
- **Accuracy**: Derived as (100 - MAPE)%

## Cross-Validation

The pipeline uses time-series aware cross-validation:

1. Splits data into 5 folds
2. Trains on earlier folds
3. Tests on subsequent fold
4. Averages metrics across folds
5. Reports robust performance estimate

## Handling Different Dataset Sizes

| Dataset Size | Training Time | ARIMA Search | LSTM Lookback | Prophet Mode |
|---|---|---|---|---|
| 2-50 | <1s | Limited (p,d,q ≤ 2) | Fixed (5) | Manual |
| 50-200 | 1-5s | Medium (p,d,q ≤ 3) | Auto (7-10) | Auto detect |
| 200-1000 | 5-30s | Full (p,d,q ≤ 5) | Auto (10-15) | Full detection |
| >1000 | 30-120s | Full grid | Auto (15-30) | Complex |

## Troubleshooting

### Python Not Found
```bash
# Ensure Python 3 is installed
python3 --version

# Add to PATH if needed
export PATH="/usr/local/bin:$PATH"
```

### Missing Dependencies
```bash
pip install numpy pandas scikit-learn statsmodels
```

### Memory Issues (Large Datasets)
```python
# In train_models.py, limit data size
if len(data) > 10000:
    data = data[:10000]  # Use first 10k points
```

### Training Timeout
```bash
# Increase timeout in app/api/train/route.js
export const config = {
  maxDuration: 600,  // 10 minutes
};
```

## Advanced Usage

### Custom ARIMA Parameters
```python
arima_tuner = ArimaAutoTuner(data, max_p=3, max_d=1, max_q=3)
best_order = arima_tuner.tune()
```

### Custom LSTM Lookback
```python
lstm_trainer = LSTMTrainer(data, lookback=20, test_size=0.15)
lstm_trainer.train()
```

### Manual Prophet Config
```python
prophet_config = ProphetAutoConfig(data)
config = prophet_config.get_config()
config['interval_width'] = 0.80  # 80% instead of 95%
```

## Workflow Integration

1. **User uploads CSV** → `/app/ml-analysis/page.jsx`
2. **Models run on data** → `/app/api/models/run-all/route.js`
3. **Results displayed** → Components show basic metrics
4. **Optionally train models** → `/app/api/train/route.js`
5. **Save trained params** → `trained_models.json`
6. **Load for future use** → `/lib/model-loader.js`

## Next Steps

1. Train models on your specific dataset
2. Save trained parameters to `trained_models.json`
3. Update models-engine.js to use trained params
4. Deploy and enjoy optimized forecasts!

---

For questions or issues, check the main FOLDER_STRUCTURE.md or review implementation examples in components/
