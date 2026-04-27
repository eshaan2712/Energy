# Model API Integration Guide

## Server-Side Implementation

### Using Models in API Routes

```javascript
// app/api/predict/lstm/route.js
import LSTMModel from '@/lib/models/lstm';
import { ModelEvaluator } from '@/lib/models/evaluation';

export async function POST(request) {
  try {
    const { data, steps = 7, testSize = 0.2 } = await request.json();

    // Validate input
    if (!data || data.length < 50) {
      return Response.json(
        { error: 'Minimum 50 data points required' },
        { status: 400 }
      );
    }

    // Split data
    const splitIdx = Math.floor(data.length * (1 - testSize));
    const trainData = data.slice(0, splitIdx);
    const testData = data.slice(splitIdx);

    // Train model
    const model = new LSTMModel(trainData, {
      lookback: 7,
      lstmUnits: 50,
      epochs: 100
    });

    const history = model.train(0.2);

    // Generate forecast
    const forecast = model.forecast(steps);

    // Evaluate if test data available
    let metrics = null;
    if (testData.length > 0) {
      const testPred = model.forecast(testData.length);
      const evaluator = new ModelEvaluator(testData, testPred);
      metrics = {
        mae: evaluator.calculateMAE(),
        rmse: evaluator.calculateRMSE(),
        mape: evaluator.calculateMAPE(),
        r2Score: evaluator.calculateR2Score(),
        accuracy: evaluator.getAccuracyScore()
      };
    }

    return Response.json({
      model: 'LSTM',
      forecast: forecast,
      steps: steps,
      metrics: metrics,
      trainingHistory: history,
      dataPoints: data.length,
      trainSize: trainData.length,
      testSize: testData.length
    });
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### ARIMA API Route

```javascript
// app/api/predict/arima/route.js
import ARIMAModel from '@/lib/models/arima';
import { ModelEvaluator } from '@/lib/models/evaluation';

export async function POST(request) {
  try {
    const { data, steps = 7, p = 1, d = 1, q = 1 } = await request.json();

    if (!data || data.length < 30) {
      return Response.json(
        { error: 'Minimum 30 data points required' },
        { status: 400 }
      );
    }

    // Train model
    const model = new ARIMAModel(data, { p, d, q });
    model.fit();

    // Forecast with confidence intervals
    const forecast = model.forecast(steps);
    const intervals = model.getConfidenceIntervals(forecast, 0.95);

    // Evaluate on portion of data
    const testData = data.slice(-14);
    const testPred = model.forecast(14);
    const evaluator = new ModelEvaluator(testData, testPred);

    return Response.json({
      model: 'ARIMA',
      parameters: { p, d, q },
      forecast: forecast,
      confidenceIntervals: intervals,
      metrics: {
        mae: evaluator.calculateMAE(),
        rmse: evaluator.calculateRMSE(),
        mape: evaluator.calculateMAPE(),
        r2Score: evaluator.calculateR2Score(),
        aic: model.aic,
        bic: model.bic
      },
      dataPoints: data.length
    });
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

## Client-Side Usage

### React Component Example

```javascript
'use client';

import { useState } from 'react';
import { ModelEvaluator } from '@/lib/models/evaluation';

export default function ModelPredictor() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const csv = event.target.result;
      const rows = csv.split('\n');
      const values = rows
        .slice(1)
        .map(row => parseFloat(row.split(',')[1]))
        .filter(v => !isNaN(v));

      setData(values);
      setError(null);
    };

    reader.readAsText(file);
  };

  const runLSTM = async () => {
    if (data.length < 50) {
      setError('Need at least 50 data points');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/predict/lstm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: data,
          steps: 7,
          testSize: 0.2
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      setResults({
        model: 'LSTM',
        ...result
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const runARIMA = async () => {
    if (data.length < 30) {
      setError('Need at least 30 data points');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/predict/arima', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: data,
          steps: 7
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      setResults({
        model: 'ARIMA',
        ...result
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="block"
        />
        {data.length > 0 && (
          <p className="text-sm text-gray-600">
            Loaded {data.length} data points
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={runLSTM}
          disabled={loading || data.length < 50}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Run LSTM
        </button>
        <button
          onClick={runARIMA}
          disabled={loading || data.length < 30}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          Run ARIMA
        </button>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      {results && (
        <div className="border rounded p-4">
          <h3 className="font-bold">{results.model} Results</h3>

          <div className="mt-4">
            <h4 className="font-semibold">Forecast</h4>
            <pre className="bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(results.forecast, null, 2)}
            </pre>
          </div>

          {results.metrics && (
            <div className="mt-4">
              <h4 className="font-semibold">Metrics</h4>
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(results.metrics).map(([key, value]) => (
                    <tr key={key} className="border-b">
                      <td className="font-mono">{key}:</td>
                      <td>
                        {typeof value === 'number'
                          ? value.toFixed(4)
                          : value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {results.confidenceIntervals && (
            <div className="mt-4">
              <h4 className="font-semibold">95% Confidence Intervals</h4>
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th>Point</th>
                    <th>Lower</th>
                    <th>Upper</th>
                  </tr>
                </thead>
                <tbody>
                  {results.confidenceIntervals.map((interval, i) => (
                    <tr key={i} className="border-b">
                      <td>{interval.point.toFixed(2)}</td>
                      <td>{interval.lower.toFixed(2)}</td>
                      <td>{interval.upper.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

## Data Format

### CSV Format
```csv
date,consumption,temperature,humidity
2024-01-01,1250,15,65
2024-01-02,1280,14,68
2024-01-03,1200,16,62
...
```

### JSON Format
```javascript
{
  "data": [1250, 1280, 1200, 1300, 1150, ...],
  "steps": 7,
  "testSize": 0.2
}
```

## Response Format

### LSTM Response
```javascript
{
  "model": "LSTM",
  "forecast": [1250.5, 1260.2, 1245.8, ...],
  "steps": 7,
  "metrics": {
    "mae": 45.3,
    "rmse": 60.2,
    "mape": 3.8,
    "r2Score": 0.89,
    "accuracy": 87.5
  },
  "trainingHistory": {
    "loss": [...],
    "valLoss": [...],
    "epoch": 100
  },
  "dataPoints": 365,
  "trainSize": 292,
  "testSize": 73
}
```

### ARIMA Response
```javascript
{
  "model": "ARIMA",
  "parameters": { "p": 1, "d": 1, "q": 1 },
  "forecast": [1250.5, 1260.2, 1245.8, ...],
  "confidenceIntervals": [
    { "point": 1250.5, "lower": 1200.2, "upper": 1300.8, "margin": 50.3 },
    ...
  ],
  "metrics": {
    "mae": 48.5,
    "rmse": 62.1,
    "mape": 4.2,
    "r2Score": 0.87,
    "aic": 2548.3,
    "bic": 2561.2
  },
  "dataPoints": 365
}
```

## Error Handling

```javascript
const response = await fetch('/api/predict/lstm', {
  method: 'POST',
  body: JSON.stringify({ data: data, steps: 7 })
});

if (!response.ok) {
  const error = await response.json();
  console.error('Error:', error.error);
  // Handle: "Minimum 50 data points required"
}

const result = await response.json();
console.log('Forecast:', result.forecast);
console.log('Accuracy:', result.metrics.accuracy);
```

## Performance Considerations

- **LSTM Training**: 100-200ms for 100-500 data points
- **ARIMA Fitting**: 10-50ms for any dataset size
- **Forecasting**: 1-5ms per step
- **Memory**: ~1-2MB for typical datasets

## Best Practices

1. **Data Validation**
   - Check minimum data points
   - Validate numeric values
   - Handle missing values

2. **Error Handling**
   - Return meaningful error messages
   - Log failures for debugging
   - Timeout long-running predictions

3. **Performance**
   - Cache trained models if possible
   - Use background jobs for long training
   - Implement request throttling

4. **Results**
   - Always include metrics
   - Provide confidence intervals
   - Document limitations
