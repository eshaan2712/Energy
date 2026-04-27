# Complete Folder Structure - Energy Dashboard & ML Analysis

## Project Root Directory

```
/vercel/share/v0-project/
├── app/                           # Next.js App Router
│   ├── api/                       # API Routes
│   │   ├── analytics/
│   │   │   └── route.js          # Analytics data endpoint
│   │   ├── forecast/
│   │   │   └── route.js          # Forecast generation (LSTM, ARIMA, Prophet)
│   │   ├── models/
│   │   │   ├── arima/
│   │   │   │   └── route.js      # ARIMA model endpoint
│   │   │   ├── lstm/
│   │   │   │   └── route.js      # LSTM model endpoint
│   │   │   ├── prophet/
│   │   │   │   └── route.js      # Prophet model endpoint
│   │   │   └── run-all/
│   │   │       └── route.js      # Main API: Runs all models (ARIMA, LSTM, Prophet)
│   │   ├── optimize/
│   │   │   └── route.js          # Energy optimization recommendations
│   │   ├── predict/
│   │   │   ├── arima/
│   │   │   │   └── route.js      # ARIMA predictions
│   │   │   └── lstm/
│   │   │       └── route.js      # LSTM predictions
│   ├── docs/
│   │   └── page.jsx              # Documentation page
│   ├── ml-analysis/
│   │   └── page.jsx              # ML Analysis Dashboard (5 tabs)
│   │                              # - Upload (CSV upload & data validation)
│   │                              # - Optimize (Energy optimization strategies)
│   │                              # - Results (All models comparison)
│   │                              # - Prophet (Facebook Prophet forecasts)
│   │                              # - LSTM (Deep learning predictions)
│   │                              # - ARIMA (Statistical forecasts)
│   ├── page.jsx                   # Home/Overview page (Dashboard)
│   ├── layout.tsx                 # Root layout with theme
│   ├── globals.css                # Global styles
│
├── components/                    # React Components
│   ├── ui/                        # shadcn/ui Components
│   │   ├── accordion.tsx
│   │   ├── alert.tsx
│   │   ├── badge.tsx
│   │   ├── button.jsx & .tsx
│   │   ├── card.jsx & .tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx
│   │   └── [20+ more UI components]
│   ├── ARIMAPrediction.jsx        # ARIMA forecast display (ML Analysis tab)
│   ├── LSTMPrediction.jsx         # LSTM forecast display (ML Analysis tab)
│   ├── ProphetPrediction.jsx      # Prophet forecast display (ML Analysis tab)
│   ├── AnalyticsDashboard.jsx     # Analytics overview component
│   ├── DatasetUpload.jsx          # CSV upload & data validation
│   ├── DashboardHeader.jsx        # Header with key metrics
│   ├── EnergyOptimization.jsx     # Energy saving strategies tab
│   ├── ForecastChart.jsx          # Chart display for home page
│   ├── ModelResults.jsx           # Results tab showing all models comparison
│   ├── OptimizationPanel.jsx      # Optimization recommendations
│   ├── theme-provider.tsx         # Theme provider
│
├── contexts/                      # React Context
│   └── DatasetContext.jsx         # Global state for dataset & model results
│
├── hooks/                         # Custom React Hooks
│   ├── use-mobile.tsx
│   ├── use-toast.ts
│
├── lib/                           # Utility Functions & Logic
│   ├── forecasting.js             # Forecasting utilities (deprecated, uses models-engine)
│   ├── models-engine.js           # Main ML models (ARIMA, LSTM, Prophet classes)
│   ├── models/
│   │   ├── arima.js              # ARIMA model class
│   │   ├── evaluation.js         # Model evaluation metrics
│   │   └── lstm.js               # LSTM model class
│   ├── optimization.js            # Energy optimization calculations
│   ├── preprocessing.js           # Data preprocessing & normalization
│   └── utils.ts                  # Utility functions (cn helper, etc.)
│
├── public/                        # Static Files
│   └── sample_energy_data_formatted.csv  # Sample dataset for testing
│
├── python_models/                 # Python Model Reference Code
│   ├── arima_model.py            # Python ARIMA implementation
│   ├── lstm_model.py             # Python LSTM implementation
│   ├── prophet_model.py          # Python Prophet implementation
│
├── scripts/                       # Executable Scripts
│   └── [Optional: Training scripts]
│
├── tailwind.config.ts             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies & scripts
├── .env.example                   # Environment variables template
└── README.md                      # Project documentation

```

## Key Files Explained

### API Routes (`/app/api/`)

| File | Purpose | Models Used |
|------|---------|------------|
| `/models/run-all/route.js` | **MAIN**: Runs ARIMA, LSTM, Prophet on CSV data | All 3 |
| `/optimize/route.js` | Generates energy optimization recommendations | - |
| `/forecast/route.js` | Generates forecasts for home page | LSTM (default) |
| `/models/arima/route.js` | ARIMA-specific endpoint | ARIMA |
| `/models/lstm/route.js` | LSTM-specific endpoint | LSTM |
| `/models/prophet/route.js` | Prophet-specific endpoint | Prophet |

### Components (`/components/`)

| Component | Location | Purpose |
|-----------|----------|---------|
| `DatasetUpload.jsx` | ML Analysis → Upload Tab | CSV upload, validation (min 2 points) |
| `ModelResults.jsx` | ML Analysis → Results Tab | Compare all 3 models |
| `LSTMPrediction.jsx` | ML Analysis → LSTM Tab | LSTM forecast display |
| `ARIMAPrediction.jsx` | ML Analysis → ARIMA Tab | ARIMA forecast display |
| `ProphetPrediction.jsx` | ML Analysis → Prophet Tab | Prophet forecast display |
| `EnergyOptimization.jsx` | ML Analysis → Optimize Tab | Energy saving strategies |
| `ForecastChart.jsx` | Home page | Quick forecast preview |
| `OptimizationPanel.jsx` | Home page | Optimization overview |

### Libraries & Models (`/lib/`)

| File | Contains |
|------|----------|
| `models-engine.js` | **ArimaModel**, **LstmModel**, **ProphetModel** classes |
| `optimization.js` | Calculates energy savings & recommendations |
| `preprocessing.js` | Data normalization & preparation |
| `models/evaluation.js` | Metrics: MAE, RMSE, MAPE, R² Score, Accuracy |

### Context (`/contexts/`)

**DatasetContext.jsx** stores:
- `dataset.data` - Raw consumption values
- `dataset.modelResults` - ARIMA, LSTM, Prophet outputs
- `dataset.modelResults.models.arima.forecast` - ARIMA predictions
- `dataset.modelResults.models.lstm.forecast` - LSTM predictions
- `dataset.modelResults.models.prophet.forecast` - Prophet predictions

## Data Flow

```
1. User uploads CSV
   ↓
2. DatasetUpload.jsx validates format (dataset_id, date, value, sector, location)
   ↓
3. API POST to /models/run-all/route.js
   ↓
4. Runs all 3 models (ARIMA, LSTM, Prophet) from models-engine.js
   ↓
5. Calculates metrics (MAE, RMSE, MAPE, R², Accuracy)
   ↓
6. Stores in DatasetContext.dataset.modelResults
   ↓
7. Components (LSTM, ARIMA, Prophet tabs) retrieve & display results
```

## CSV Format Required

```
dataset_id, date, value, sector, location
1, 2024-01-01, 430.5, residential, Illinois
1, 2024-01-02, 409.88, residential, Illinois
...
```

## Models Summary

| Model | Type | Best For | Parameters |
|-------|------|----------|-----------|
| **ARIMA** | Statistical | Linear trends | Order (1,1,1) |
| **LSTM** | Neural Network | Non-linear patterns | Lookback: 10, units: 32-64 |
| **Prophet** | Trend+Seasonality | Trend & seasonal | Auto-detected |

## Removed Features

- ❌ Ensemble model (removed from everywhere)
- ❌ Database (no persistence, in-memory only)
- ❌ 7-point minimum requirement (now 2 minimum)

## Notes

- All models run automatically on CSV upload
- Results cached in DatasetContext until new CSV uploaded
- No backend storage - data in memory only
- Python models in `/python_models/` are reference implementations
