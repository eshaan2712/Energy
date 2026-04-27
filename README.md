# Energy Consumption Forecasting & Optimization Dashboard

A sophisticated, enterprise-grade platform for intelligent energy management, combining advanced machine learning forecasting models with optimization algorithms and real-time analytics.

## 📋 Project Overview

This project addresses the critical challenge of energy management in modern smart cities by integrating:

- **Predictive Analytics**: ARIMA, LSTM, and Prophet models for accurate energy forecasting
- **Optimization Engine**: Linear programming and heuristic algorithms for peak demand reduction
- **Real-time Dashboard**: Interactive visualizations of energy consumption patterns and trends
- **Multi-sector Support**: Residential, Commercial, and Industrial energy analysis

## 🎯 Key Features

### 1. **Energy Forecasting**
- **Multi-Model Ensemble**: Combines ARIMA, LSTM, and Prophet for robust predictions
- **14-Day Forecasts**: Short-term predictions with confidence intervals
- **Model Selection**: Choose individual models or ensemble approach
- **Performance Metrics**: MAE, RMSE, MAPE, R² Score tracking
- **Confidence Intervals**: Statistical bounds for forecast reliability

### 2. **Optimization Module**
- **Peak Demand Shaving**: Intelligent strategies to reduce consumption spikes
- **Sector-wise Optimization**: Customized recommendations for each sector
- **Linear Programming**: Optimized energy distribution across sectors
- **Savings Potential**: Quantified cost and emissions reduction opportunities
- **Renewable Integration**: Assessment of solar and wind energy potential

### 3. **Analytics Dashboard**
- **Consumption Trends**: 30-day historical analysis with visualizations
- **Model Accuracy Comparison**: Performance metrics for all forecasting models
- **Efficiency Tracking**: Real-time efficiency scores and improvements
- **Sector Statistics**: Deep dive into residential, commercial, and industrial patterns
- **Custom Date Ranges**: Flexible analysis periods

### 4. **System Intelligence**
- **Real-time Data Processing**: Live energy consumption updates
- **Automated Recommendations**: AI-driven actionable insights
- **Strategic Planning**: Long-term optimization recommendations
- **Grid Stability Monitoring**: System health and performance tracking

## 🏗️ Architecture

### Frontend Stack
- **Next.js 16**: Modern React framework with App Router
- **Recharts**: Advanced data visualization library
- **Tailwind CSS**: Responsive design system
- **shadcn/ui**: High-quality React components
- **Lucide React**: Professional icon library

### Backend
- **Node.js API Routes**: Serverless backend functions
- **Custom Forecasting Engine**: JavaScript implementations of ARIMA, LSTM, Prophet
- **Optimization Algorithms**: Linear programming and heuristic solvers
- **RESTful APIs**: Clean, scalable API endpoints

### Data Processing
```
Historical Data → Preprocessing → Feature Engineering → Models → Forecasts
                                                      ↓
                                                  Optimization
                                                      ↓
                                                   Analytics
```

## 📁 Project Structure

```
energy-dashboard/
├── app/
│   ├── api/
│   │   ├── forecast/route.js          # Forecasting API
│   │   ├── optimize/route.js          # Optimization API
│   │   └── analytics/route.js         # Analytics API
│   ├── layout.tsx                     # Root layout
│   ├── page.jsx                       # Main dashboard
│   └── globals.css                    # Global styles
├── components/
│   ├── DashboardHeader.jsx            # Key metrics display
│   ├── ForecastChart.jsx              # Forecast visualization
│   ├── OptimizationPanel.jsx          # Optimization recommendations
│   ├── AnalyticsDashboard.jsx         # Analytics view
│   └── ui/
│       ├── card.jsx                   # Card component
│       ├── button.jsx                 # Button component
│       └── tabs.jsx                   # Tab navigation
├── lib/
│   ├── forecasting.js                 # ARIMA, LSTM, Prophet models
│   ├── optimization.js                # Optimization algorithms
│   └── utils.ts                       # Utility functions
├── scripts/
│   └── init-database.sql              # Database initialization
└── README.md                          # This file
```

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd energy-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   Navigate to `http://localhost:3000`

### Database Setup (Optional)

For production with persistent data storage:

```bash
# Execute database initialization
psql -U user -d database -f scripts/init-database.sql
```

## 🔌 API Endpoints

### Forecast API
```
POST /api/forecast
GET /api/forecast?sector=residential&model=ensemble&steps=7

Request:
{
  "sector": "residential|commercial|industrial",
  "model": "arima|lstm|prophet|ensemble",
  "steps": 7
}

Response:
{
  "sector": "residential",
  "forecast": [4200, 4300, ...],
  "confidenceIntervals": {
    "lower": [3800, 3900, ...],
    "upper": [4600, 4700, ...]
  },
  "metrics": {
    "mae": 245.5,
    "rmse": 312.3,
    "mape": 5.2,
    "r2Score": 0.92
  }
}
```

### Optimization API
```
POST /api/optimize
GET /api/optimize?type=multi-objective

Response:
{
  "demandOptimization": {
    "recommendations": {...},
    "totalSavings": 2070,
    "totalSavingsPercentage": 15.0
  },
  "renewableIntegration": {
    "solar": {...},
    "wind": {...}
  },
  "recommendations": [...]
}
```

### Analytics API
```
GET /api/analytics?sector=residential&range=30d
POST /api/analytics

Response:
{
  "sectors": {
    "residential": {
      "averageConsumption": 4000,
      "peakConsumption": 5200,
      "efficiency": 87.5,
      "accuracy": {
        "arima": 85.2,
        "lstm": 88.4,
        "prophet": 86.8
      },
      "data": [...]
    }
  }
}
```

## 📊 Dashboard Sections

### 1. Overview Tab
- Real-time key metrics (consumption, peak load, accuracy, savings)
- 30-day forecast visualization
- System status indicators
- Quick insights panel

### 2. Forecast Tab
- Interactive forecast charts with historical comparison
- Sector and model selection
- Confidence interval bands
- Model performance metrics

### 3. Optimization Tab
- Sector-wise optimization recommendations
- Peak demand reduction strategies
- Cost-benefit analysis
- Renewable energy integration planning

### 4. Analytics Tab
- 30-day consumption trends by sector
- Model accuracy comparison
- Efficiency tracking
- Performance statistics

## 🧠 Forecasting Models

### ARIMA (AutoRegressive Integrated Moving Average)
- Best for: Linear trends with seasonal patterns
- Accuracy: 85-87%
- Strengths: Captures temporal dependencies
- Limitations: Assumes linearity

### LSTM (Long Short-Term Memory)
- Best for: Complex non-linear patterns
- Accuracy: 88-90%
- Strengths: Learns long-term dependencies
- Limitations: Requires more training data

### Prophet
- Best for: Multiple seasonalities and special events
- Accuracy: 86-88%
- Strengths: Handles seasonality well
- Limitations: Less flexible for custom patterns

### Ensemble
- Combines all three models with weighted averaging
- Optimal accuracy: 90%+
- Robust to individual model failures

## ⚙️ Optimization Algorithms

### Linear Programming
- Minimizes peak demand across sectors
- Respects operational constraints
- Optimizes energy distribution
- Resource-efficient

### Heuristic Search
- Peak shaving strategies
- Load shifting recommendations
- Renewable integration planning
- Real-time optimization

## 📈 Key Metrics Explained

| Metric | Description | Benchmark |
|--------|-------------|-----------|
| **MAE** | Mean Absolute Error in MWh | < 300 MWh |
| **RMSE** | Root Mean Square Error | < 400 MWh |
| **MAPE** | Mean Absolute Percentage Error | < 6% |
| **R² Score** | Coefficient of Determination | > 0.90 |
| **Efficiency** | System efficiency percentage | > 85% |
| **Savings** | Annual savings potential | > 10% |

## 🎨 Design Features

- **Dark Mode Support**: Full dark/light theme switching
- **Responsive Layout**: Mobile, tablet, and desktop optimized
- **Real-time Updates**: Live data refresh capabilities
- **Interactive Charts**: Drill-down and exploration features
- **Professional UI**: Enterprise-grade component library

## 🔐 Security Considerations

- Server-side forecasting algorithms
- Protected API endpoints
- Input validation and sanitization
- Rate limiting ready
- No sensitive data in frontend

## 🌐 Scalability

- Stateless API design
- Horizontal scaling capability
- Database-agnostic backend
- Real-time processing ready
- Load balancing compatible

## 📚 Technology Highlights

### Machine Learning
- Statistical time-series models (ARIMA)
- Deep learning (LSTM/RNN)
- Ensemble methods
- Confidence interval estimation

### Optimization
- Linear programming formulation
- Constraint modeling
- Heuristic search algorithms
- Multi-objective optimization

### Visualization
- Interactive charts and graphs
- Real-time data updates
- Customizable dashboards
- Export capabilities

## 🔄 Data Flow

```
Raw Energy Data
        ↓
Preprocessing & Feature Engineering
        ↓
├── ARIMA Model ──┐
├── LSTM Model  ──┼──→ Ensemble Forecaster
└── Prophet Model ┘
        ↓
Optimization Engine
        ↓
├── Peak Shaving
├── Load Shifting
└── Renewable Integration
        ↓
Analytics & Reporting
        ↓
Interactive Dashboard
```

## 🎯 Use Cases

1. **Utility Companies**: Demand forecasting and grid management
2. **City Planners**: Infrastructure planning and sustainability
3. **Energy Traders**: Market analysis and risk management
4. **Industrial Facilities**: Cost optimization and efficiency
5. **Renewable Operators**: Capacity planning and storage

## 📊 Sample Data

The application includes pre-seeded data for demonstration:
- 30 days of historical consumption data per sector
- Trained model performance metrics
- Realistic consumption patterns with seasonality
- Weather and operational factors

## 🚀 Deployment

### Vercel Deployment
```bash
npm run build
vercel deploy
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

## 📝 Future Enhancements

- [ ] Real-time data integration with IoT sensors
- [ ] Advanced ML models (XGBoost, Random Forest)
- [ ] Multi-user authentication and roles
- [ ] Custom alert thresholds
- [ ] Export reports (PDF, CSV)
- [ ] Mobile app (React Native)
- [ ] Cloud data warehouse integration
- [ ] Blockchain for energy trading

## 📞 Support

For issues, questions, or suggestions:
1. Check the documentation
2. Review API responses for error details
3. Inspect browser console for client-side errors
4. Check server logs for backend issues

## 📄 License

This project is part of the KMIT CSE Department B.Tech curriculum (2025-26).

## 👥 Team

- K. SHIVA SAI (22BD1A054T)
- ESHAAN KATLA (22BD1A054G)
- MONISH BALANI (22BD1A055A)
- SAGARLA SRI SAI (22BD1A055K)

**Faculty Supervisor**: Mr. Shailesh Bhosekar
**Institution**: Keshav Memorial Institute of Technology

---

**Last Updated**: February 2026
**Version**: 1.0.0
