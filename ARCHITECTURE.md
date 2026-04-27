# Energy Dashboard - Technical Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Layer (Next.js)                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ React Components (JSX)                                   │  │
│  │ - DashboardHeader (Key Metrics)                          │  │
│  │ - ForecastChart (Visualization)                          │  │
│  │ - OptimizationPanel (Recommendations)                    │  │
│  │ - AnalyticsDashboard (Statistics)                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────┬───────────────────────────────────────────────┘
                   │
                   ▼ (REST API)
┌─────────────────────────────────────────────────────────────────┐
│                   API Layer (Route Handlers)                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ /api/forecast     - ARIMA, LSTM, Prophet ensemble       │  │
│  │ /api/optimize     - Linear programming & heuristics     │  │
│  │ /api/analytics    - Historical analysis & metrics       │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────┬───────────────────────────────────────────────┘
                   │
        ┌──────────┴────────────┬─────────────┐
        ▼                       ▼             ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  Forecasting     │  │  Optimization    │  │   Analytics      │
│   Engine         │  │     Module       │  │    Engine        │
├──────────────────┤  ├──────────────────┤  ├──────────────────┤
│ - ARIMA          │  │ - LP Solver      │  │ - Trend Analysis │
│ - LSTM           │  │ - Heuristics     │  │ - Accuracy Calc  │
│ - Prophet        │  │ - Constraints    │  │ - Statistics     │
│ - Ensemble       │  │ - Recommendations│  │ - Visualization  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Data Processing  │
                    │  & Utilities      │
                    └───────────────────┘
```

## Detailed Component Architecture

### 1. Frontend Architecture

#### Dashboard Structure
```
app/
├── page.jsx (Main Dashboard)
│   ├── DashboardHeader (4 KPI Cards)
│   ├── Tabs Container
│   │   ├── Overview Tab
│   │   │   ├── ForecastChart
│   │   │   └── Status Sidebar
│   │   ├── Forecast Tab
│   │   │   └── ForecastChart (Full)
│   │   ├── Optimization Tab
│   │   │   └── OptimizationPanel
│   │   └── Analytics Tab
│   │       └── AnalyticsDashboard
│   └── Footer (Tech Info)
```

#### Component Responsibilities

**DashboardHeader.jsx**
- Displays 4 KPI cards with metrics
- Real-time data updates
- Responsive grid layout
- Icons and status indicators

**ForecastChart.jsx**
- Interactive forecast visualization
- Model selection dropdown
- Sector filtering
- Confidence interval display
- Performance metrics display
- Area/line chart combination

**OptimizationPanel.jsx**
- Sector-wise recommendations
- Peak demand reduction strategies
- Bar chart comparison
- Actionable steps per sector
- Strategic recommendations

**AnalyticsDashboard.jsx**
- 30-day consumption trends
- Model accuracy comparison
- Efficiency tracking
- Sector statistics
- Performance summaries

### 2. API Layer Architecture

#### REST Endpoints Design

```
/api/forecast
├── Request
│   ├── sector: 'residential' | 'commercial' | 'industrial'
│   ├── model: 'arima' | 'lstm' | 'prophet' | 'ensemble'
│   └── steps: 7-30 (days ahead)
└── Response
    ├── forecast: number[]
    ├── confidenceIntervals: {lower[], upper[]}
    ├── metrics: {mae, rmse, mape, r2Score}
    └── chartData: {date, actual, forecast, ...}

/api/optimize
├── Request
│   ├── data: {sector -> {consumption}}
│   └── optimizationType: string
└── Response
    ├── demandOptimization: {recommendations, totalSavings}
    ├── renewableIntegration: {solar, wind}
    ├── recommendations: [{priority, title, impact, timeline}]
    └── summary: {currentConsumption, optimizedConsumption, ...}

/api/analytics
├── Request
│   ├── sector: string
│   ├── range: '7d' | '30d' | '90d'
│   └── POST: {sector, startDate, endDate}
└── Response
    ├── sectors: {sector -> sectorAnalytics}
    ├── data: [{date, actual, forecast, optimized}]
    └── summary: {statistics, accuracy, efficiency}
```

### 3. Forecasting Engine Architecture

#### ARIMA Model
```javascript
class ARIMAForecaster {
  // Parameters: p (AR), d (Integration), q (MA)
  // Process:
  // 1. Difference data d times
  // 2. Calculate autocorrelation
  // 3. Apply AR(1) model with trend
  // 4. Fit AR coefficients
  // 5. Generate forecast with noise
  
  Methods:
  - calculateMean()
  - differenceData()
  - autoCorrelation()
  - forecast()
  - calculateMAPE()
}
```

#### LSTM Model
```javascript
class LSTMForecaster {
  // Parameters: lookback window (7 days)
  // Process:
  // 1. Normalize data (z-score)
  // 2. Create sequences of lookback length
  // 3. Apply weighted sequence averaging
  // 4. Denormalize predictions
  // 5. Add controlled noise
  
  Methods:
  - normalize() / denormalize()
  - calculateMean() / calculateStd()
  - forecast()
}
```

#### Prophet Model
```javascript
class ProphetForecaster {
  // Parameters: seasonality period (7 days)
  // Process:
  // 1. Extract trend (linear regression)
  // 2. Extract seasonal components
  // 3. Decompose time series
  // 4. Forecast trend + seasonal + noise
  // 5. Confidence intervals
  
  Methods:
  - calculateTrend()
  - calculateSeasonal()
  - forecast()
}
```

#### Ensemble Strategy
```
Predictions:
├─ ARIMA: 30% weight
├─ LSTM: 40% weight (most accurate)
└─ Prophet: 30% weight

Combination: weighted average
Confidence: combined intervals
```

### 4. Optimization Engine Architecture

#### Linear Programming Formulation

```
Objective: Minimize peak demand
          Min Z = max(residential, commercial, industrial)

Subject to:
  - residential ≥ min_residential (1000 MWh)
  - residential ≤ max_residential (8000 MWh)
  - commercial ≥ min_commercial (800 MWh)
  - commercial ≤ max_commercial (6000 MWh)
  - industrial ≥ min_industrial (2000 MWh)
  - industrial ≤ max_industrial (12000 MWh)
  - residential + commercial + industrial = total_demand
```

#### Heuristic Optimization Steps

```
Peak Shaving Algorithm:
1. Identify peak periods (> 90% of max capacity)
2. Calculate excess demand
3. Reduce by 30% through:
   - Load shifting
   - Demand response
   - Efficiency improvements
4. Generate sector-specific actions
5. Provide timing and impact estimates
```

#### Renewable Integration

```
Solar Potential:
├─ Time-based: sin((hour-6) * π/12) for 6 AM - 6 PM
├─ Peak: noon
├─ Max capacity: 40% of consumption
└─ Recommended: Solar * potential%

Wind Potential:
├─ Variable: baseWind + timeVariation
├─ Range: 20-60%
├─ Max capacity: 30% of consumption
└─ Recommended: Wind * potential%
```

### 5. Data Flow Architecture

#### Request-Response Cycle

```
User Action
    ↓
Component State Update
    ↓
API Request
    ↓
Backend Processing
    ↓
Model Calculations
    ↓
JSON Response
    ↓
Component Render
    ↓
Chart Visualization
```

#### Real-time Update Flow

```
Scheduled Task / Manual Trigger
    ↓
Fetch Current Data
    ↓
Run All Models in Parallel
    ├─ ARIMA
    ├─ LSTM
    └─ Prophet
    ↓
Ensemble Calculation
    ↓
Store Results
    ↓
Update Cache
    ↓
WebSocket/SSE to Client
    ↓
Auto-refresh UI
```

### 6. State Management

#### Frontend State (React Hooks)

```jsx
// ForecastChart.jsx
const [forecastData, setForecastData] = useState(null)
const [selectedSector, setSelectedSector] = useState('residential')
const [selectedModel, setSelectedModel] = useState('ensemble')
const [loading, setLoading] = useState(false)

// OptimizationPanel.jsx
const [optimization, setOptimization] = useState(null)
const [loading, setLoading] = useState(true)

// AnalyticsDashboard.jsx
const [analytics, setAnalytics] = useState(null)
const [selectedSector, setSelectedSector] = useState('residential')
```

#### Data Caching Strategy

```
Frontend Cache (Session):
├─ Recent forecasts (10 min TTL)
├─ Analytics data (30 min TTL)
└─ Optimization results (1 hour TTL)

Backend Cache (Optional):
├─ Model performance metrics
├─ Historical aggregates
└─ Trend calculations
```

## Performance Considerations

### Algorithm Complexity

| Operation | Time Complexity | Space Complexity |
|-----------|-----------------|------------------|
| ARIMA Forecast | O(n) | O(n) |
| LSTM Forecast | O(lookback) | O(lookback) |
| Prophet Forecast | O(n) | O(seasonality) |
| Ensemble | O(3n) | O(n) |
| Linear Programming | O(n³) | O(n²) |
| Peak Shaving | O(n) | O(n) |

### Optimization Techniques

1. **Parallel Processing**: Run all forecasting models in parallel
2. **Memoization**: Cache model results
3. **Data Downsampling**: Use aggregated data for long periods
4. **Lazy Loading**: Load components on demand
5. **Chart Optimization**: Resample chart data points

## Security Architecture

### Data Protection

```
Frontend:
├─ No sensitive data stored
├─ HTTPS only communication
└─ Input validation on all forms

Backend:
├─ Input sanitization
├─ Rate limiting ready
├─ CORS configuration
└─ Error message masking
```

### API Security

```
POST /api/forecast
├─ Validate sector enum
├─ Validate model enum
├─ Validate steps (1-30)
└─ Return aggregated data only

POST /api/optimize
├─ Validate consumption values
├─ Check data ranges
└─ Aggregate sector results
```

## Scalability Architecture

### Horizontal Scaling

```
Load Balancer
    ↓
┌───┴────┬────┬────┐
↓        ↓    ↓    ↓
App 1  App 2 App 3 ...
├─ Stateless
├─ Shared cache
└─ Database queries
```

### Database Scaling

```
Write: Single Master
  ├─ Insert forecasts
  ├─ Update optimizations
  └─ Log analytics

Read: Read Replicas
  ├─ Query analytics
  ├─ Historical data
  └─ Model metrics
```

## Deployment Architecture

### Docker Configuration

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s \
  CMD node healthcheck.js
CMD ["npm", "run", "start"]
```

### Environment Configuration

```
Development:
├─ Local API: http://localhost:3000
├─ Mock data: enabled
└─ Debug logging: enabled

Production:
├─ CDN for static assets
├─ Real database connection
├─ Environment variables
└─ Error tracking
```

## Monitoring & Logging

### Key Metrics

```
Frontend:
├─ Page load time
├─ API response time
├─ Chart render time
└─ User interactions

Backend:
├─ API endpoint latency
├─ Database query time
├─ Model computation time
└─ Error rates
```

### Logging Strategy

```
Level: INFO | WARN | ERROR | DEBUG

Frontend:
├─ console.log("[v0] ...")
└─ Error boundaries

Backend:
├─ Request logging
├─ Model performance
├─ Database operations
└─ Error stack traces
```

## Testing Strategy

### Unit Tests
- Forecasting model calculations
- Optimization algorithms
- Data processing functions

### Integration Tests
- API endpoint responses
- Data flow between components
- Model ensemble averaging

### E2E Tests
- Dashboard load and interaction
- Forecast generation workflow
- Optimization recommendations

## Future Enhancements

### ML Improvements
- [ ] XGBoost/Random Forest models
- [ ] Neural network optimization
- [ ] Transfer learning for new sectors
- [ ] Anomaly detection

### Infrastructure
- [ ] Real-time WebSocket updates
- [ ] Message queue (Redis)
- [ ] Distributed caching
- [ ] Multi-region deployment

### Features
- [ ] Custom forecasting parameters
- [ ] User authentication
- [ ] Alert system
- [ ] Export reports
- [ ] Mobile app

---

**Version**: 1.0.0
**Last Updated**: February 2026
