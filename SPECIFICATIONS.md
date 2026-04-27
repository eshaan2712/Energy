# Energy Dashboard - Technical Specifications

## Project Information

**Project Name**: Energy Consumption Forecasting and Optimization Dashboard

**Institution**: Keshav Memorial Institute of Technology (KMIT)
Department: Computer Science and Engineering (CSE)

**Academic Year**: 2025-26
**Project Stage**: Stage-I (Design & Implementation)

**Team Members**:
- K. Shiva Sai (22BD1A054T)
- Eshaan Katla (22BD1A054G)
- Monish Balani (22BD1A055A)
- Sagarla Sri Sai (22BD1A055K)

**Faculty Supervisor**: Mr. Shailesh Bhosekar
**Department Head**: Mr. Para Upendar

---

## 1. System Specifications

### 1.1 Functional Requirements

#### FR1: Energy Consumption Forecasting
- **FR1.1**: System shall support ARIMA forecasting model
- **FR1.2**: System shall support LSTM neural network forecasting
- **FR1.3**: System shall support Prophet seasonal forecasting
- **FR1.4**: System shall provide ensemble forecast combining all three models
- **FR1.5**: System shall generate 7-30 day ahead forecasts
- **FR1.6**: System shall calculate confidence intervals (95%)
- **FR1.7**: System shall support sector filtering (Residential, Commercial, Industrial)
- **FR1.8**: System shall display forecast accuracy metrics (MAE, RMSE, MAPE, R²)

#### FR2: Energy Optimization
- **FR2.1**: System shall implement linear programming for demand optimization
- **FR2.2**: System shall provide peak demand reduction strategies
- **FR2.3**: System shall calculate sector-wise energy allocation
- **FR2.4**: System shall recommend load shifting opportunities
- **FR2.5**: System shall assess renewable energy integration potential
- **FR2.6**: System shall quantify annual savings potential
- **FR2.7**: System shall generate actionable optimization steps
- **FR2.8**: System shall provide strategic recommendations with timelines

#### FR3: Analytics & Reporting
- **FR3.1**: System shall track 30-day consumption trends
- **FR3.2**: System shall compare model accuracy across sectors
- **FR3.3**: System shall calculate efficiency metrics
- **FR3.4**: System shall identify consumption trends (increasing/decreasing)
- **FR3.5**: System shall provide sector-wise statistics
- **FR3.6**: System shall support multiple time ranges (7d, 30d, 90d)
- **FR3.7**: System shall export analytics data in JSON format
- **FR3.8**: System shall visualize trends with interactive charts

#### FR4: User Interface
- **FR4.1**: System shall provide responsive dashboard layout
- **FR4.2**: System shall support mobile, tablet, and desktop views
- **FR4.3**: System shall have tabbed navigation (Overview, Forecast, Optimization, Analytics)
- **FR4.4**: System shall provide dark/light theme support
- **FR4.5**: System shall display real-time KPI metrics
- **FR4.6**: System shall allow model and sector selection
- **FR4.7**: System shall provide interactive data visualization
- **FR4.8**: System shall include system status indicators

#### FR5: API Endpoints
- **FR5.1**: System shall provide `/api/forecast` endpoint for forecasting
- **FR5.2**: System shall provide `/api/optimize` endpoint for optimization
- **FR5.3**: System shall provide `/api/analytics` endpoint for analytics
- **FR5.4**: System shall support GET and POST methods appropriately
- **FR5.5**: System shall return JSON responses
- **FR5.6**: System shall validate input parameters
- **FR5.7**: System shall handle errors gracefully

### 1.2 Non-Functional Requirements

#### NFR1: Performance
- **NFR1.1**: Page load time shall be < 2 seconds
- **NFR1.2**: API response time shall be < 500 milliseconds
- **NFR1.3**: Forecast generation shall complete in < 1 second
- **NFR1.4**: Chart rendering shall complete in < 500 milliseconds
- **NFR1.5**: Bundle size shall be < 3 MB
- **NFR1.6**: Dashboard shall support simultaneous view by 100+ users
- **NFR1.7**: System shall process data updates without blocking UI

#### NFR2: Reliability
- **NFR2.1**: System uptime shall be 99% (production)
- **NFR2.2**: All API endpoints shall return consistent responses
- **NFR2.3**: Data shall be validated before processing
- **NFR2.4**: System shall handle network timeouts gracefully
- **NFR2.5**: Model calculations shall have error bounds
- **NFR2.6**: Database queries shall have transaction support

#### NFR3: Security
- **NFR3.1**: System shall use HTTPS for all communications
- **NFR3.2**: Input validation shall prevent SQL injection
- **NFR3.3**: Error messages shall not expose sensitive information
- **NFR3.4**: API endpoints shall have rate limiting (optional)
- **NFR3.5**: Database credentials shall not be in source code
- **NFR3.6**: Environment variables shall be used for configuration

#### NFR4: Usability
- **NFR4.1**: Dashboard shall be intuitive without documentation
- **NFR4.2**: Navigation shall be clear with visual indicators
- **NFR4.3**: Charts shall be interactive with tooltips
- **NFR4.4**: Color scheme shall be professional and accessible
- **NFR4.5**: Typography shall be clear and readable
- **NFR4.6**: All controls shall be keyboard accessible

#### NFR5: Maintainability
- **NFR5.1**: Code shall follow naming conventions
- **NFR5.2**: Functions shall have clear documentation
- **NFR5.3**: Components shall be modular and reusable
- **NFR5.4**: Database schema shall be normalized
- **NFR5.5**: Configuration shall be centralized
- **NFR5.6**: Logging shall track all significant events

#### NFR6: Scalability
- **NFR6.1**: System shall support horizontal scaling
- **NFR6.2**: Database queries shall use appropriate indexes
- **NFR6.3**: API design shall be stateless
- **NFR6.4**: Frontend shall lazy-load components
- **NFR6.5**: Data processing shall be parallelizable
- **NFR6.6**: Cache implementation shall reduce database load

---

## 2. Technical Specifications

### 2.1 Technology Stack

#### Frontend
| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Next.js | 16.x |
| Language | JavaScript/JSX | ES2020+ |
| UI Library | shadcn/ui | Latest |
| Charts | Recharts | 2.x |
| Icons | Lucide React | Latest |
| Styling | Tailwind CSS | 3.x |
| State | React Hooks | 19.x |
| HTTP Client | Fetch API | Native |

#### Backend
| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js | 18.x+ |
| Framework | Next.js Routes | 16.x |
| Language | JavaScript | ES2020+ |
| Database | PostgreSQL | 12.x+ |

#### Machine Learning
| Component | Implementation | Type |
|-----------|-----------------|------|
| ARIMA | Custom JavaScript | Forecasting |
| LSTM | Simplified JS | Deep Learning |
| Prophet | Custom JS | Seasonal |
| Optimization | Linear Programming | Optimization |

### 2.2 Code Structure

#### File Organization
```
energy-dashboard/
├── app/
│   ├── api/              # Backend API routes
│   ├── layout.tsx        # Root layout with metadata
│   ├── page.jsx          # Main dashboard
│   └── globals.css       # Global styles and theme
├── components/
│   ├── DashboardHeader.jsx     # KPI metrics
│   ├── ForecastChart.jsx       # Forecast visualization
│   ├── OptimizationPanel.jsx   # Optimization view
│   ├── AnalyticsDashboard.jsx  # Analytics view
│   └── ui/                      # Reusable UI components
├── lib/
│   ├── forecasting.js    # ML models (ARIMA, LSTM, Prophet)
│   ├── optimization.js   # Optimization algorithms
│   └── utils.ts          # Utility functions
├── scripts/
│   └── init-database.sql # Database schema
├── public/               # Static assets
├── .env.local           # Environment variables
├── next.config.mjs      # Next.js configuration
├── tailwind.config.ts   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Project dependencies
├── README.md            # Project documentation
├── ARCHITECTURE.md      # Technical architecture
├── SETUP.md             # Setup guide
└── SPECIFICATIONS.md    # This file
```

#### Component Hierarchy
```
App (page.jsx)
├── DashboardHeader
│   └── Card (x4 KPI metrics)
├── Tabs
│   ├── Overview Tab
│   │   ├── ForecastChart
│   │   └── Status Sidebar
│   ├── Forecast Tab
│   │   └── ForecastChart
│   ├── Optimization Tab
│   │   └── OptimizationPanel
│   │       ├── Metrics Display
│   │       ├── Bar Chart
│   │       └── Recommendations
│   └── Analytics Tab
│       └── AnalyticsDashboard
│           ├── Sector Selector
│           ├── Line Chart
│           ├── Bar Chart
│           └── Statistics
└── Footer
```

### 2.3 API Specifications

#### Forecast Endpoint
```
Endpoint: POST/GET /api/forecast

Request Parameters:
{
  "sector": "residential" | "commercial" | "industrial",
  "model": "arima" | "lstm" | "prophet" | "ensemble",
  "steps": 7 // 1-30 days
}

Response Format:
{
  "sector": string,
  "model": string,
  "timestamp": ISO8601,
  "historical": number[],
  "forecast": number[],
  "forecastDetails": {
    "ensemble": number[],
    "arima": number[],
    "lstm": number[],
    "prophet": number[]
  },
  "confidenceIntervals": {
    "lower": number[],
    "upper": number[]
  },
  "metrics": {
    "mae": number,
    "rmse": number,
    "mape": number,
    "r2Score": number
  },
  "chartData": Array
}

Status Codes:
- 200: Success
- 400: Invalid parameters
- 500: Server error
```

#### Optimization Endpoint
```
Endpoint: POST/GET /api/optimize

Request Parameters:
{
  "data": {
    "residential": { "consumption": number },
    "commercial": { "consumption": number },
    "industrial": { "consumption": number }
  },
  "optimizationType": "multi-objective"
}

Response Format:
{
  "timestamp": ISO8601,
  "optimizationType": string,
  "currentData": object,
  "results": {
    "demandOptimization": {
      "recommendations": {
        "sector": {
          "current": number,
          "recommended": number,
          "savings": number,
          "savingsPercentage": number,
          "actions": string[]
        }
      },
      "totalSavings": number,
      "totalSavingsPercentage": number
    },
    "renewableIntegration": {
      "solar": {
        "potential": number,
        "maxCapacity": number,
        "recommended": number
      },
      "wind": {
        "potential": number,
        "maxCapacity": number,
        "recommended": number
      }
    },
    "recommendations": Array
  },
  "summary": {
    "totalCurrentConsumption": number,
    "totalOptimizedConsumption": number,
    "totalSavingsPotential": number,
    "savingsPercentage": number,
    "renewableEnergyPotential": number,
    "optimizationScore": number
  }
}

Status Codes:
- 200: Success
- 400: Invalid data
- 500: Server error
```

#### Analytics Endpoint
```
Endpoint: GET /api/analytics

Query Parameters:
- sector: "residential" | "commercial" | "industrial" (optional)
- range: "7d" | "30d" | "90d" (default: "30d")

Response Format:
{
  "timeRange": string,
  "sectors": {
    "sector_name": {
      "sector": string,
      "averageConsumption": number,
      "peakConsumption": number,
      "minConsumption": number,
      "trend": "increasing" | "decreasing",
      "trendPercentage": number,
      "data": Array,
      "accuracy": {
        "arima": number,
        "lstm": number,
        "prophet": number
      },
      "efficiency": number,
      "savings": number
    }
  },
  "summary": {
    "totalConsumption": number,
    "averageAccuracy": number,
    "totalSavingsPotential": number
  }
}

Status Codes:
- 200: Success
- 404: Sector not found
- 500: Server error
```

### 2.4 Data Specifications

#### Input Data Format
```javascript
{
  "timestamp": "2026-02-06T10:30:00Z",
  "sector": "residential",
  "consumption": 4200.5,  // MWh
  "temperature": 22,      // °C
  "humidity": 65,         // %
  "day_of_week": 1,      // 0-6
  "is_holiday": false
}
```

#### Output Data Format
```javascript
{
  "date": "2026-02-06",
  "actual": 4200.5,
  "forecast": 4250.3,
  "lower_bound": 3850.2,
  "upper_bound": 4650.4,
  "model": "ensemble"
}
```

#### Aggregate Data Format
```javascript
{
  "sector": "residential",
  "period": "2026-02",
  "average_consumption": 4150.2,
  "peak_consumption": 5200.8,
  "min_consumption": 3100.4,
  "total_consumption": 128560,
  "efficiency_score": 87.5,
  "trend": "increasing",
  "savings_potential": 1200.5
}
```

### 2.5 Performance Targets

#### Response Times
| Operation | Target | Method |
|-----------|--------|--------|
| Forecast | < 1s | Async, Parallel Models |
| Optimization | < 500ms | Linear Programming |
| Analytics | < 500ms | Pre-aggregated Data |
| Chart Render | < 500ms | Virtual Scrolling |
| Page Load | < 2s | Code Splitting |

#### Resource Limits
| Resource | Limit | Notes |
|----------|-------|-------|
| Max Forecast Horizon | 30 days | Accuracy decreases |
| Max Historical Data | 2 years | For ARIMA/Prophet |
| Max Sectors | 10 | Current: 3 |
| Max Concurrent Users | 100+ | Stateless design |
| Database Connections | 20 | Connection pooling |

#### Memory Usage
| Component | Limit | Notes |
|-----------|-------|-------|
| Frontend Bundle | < 3 MB | Code splitting enabled |
| API Response | < 5 MB | Pagination available |
| Chart Data Points | < 1000 | Resampling for large periods |
| Model Weights | < 10 MB | In-memory computation |

### 2.6 Quality Metrics

#### Code Quality
- **Linting**: ESLint with strict rules
- **Formatting**: Prettier with consistent style
- **Type Safety**: TypeScript strict mode (layout.tsx)
- **Documentation**: JSDoc comments for functions
- **Test Coverage**: Minimum 70% (planned)

#### Accuracy Benchmarks
| Model | Expected Accuracy | MAE | RMSE |
|-------|-------------------|-----|------|
| ARIMA | 85-87% | < 300 | < 400 |
| LSTM | 88-90% | < 250 | < 350 |
| Prophet | 86-88% | < 280 | < 380 |
| Ensemble | 90%+ | < 200 | < 300 |

#### Optimization Quality
| Metric | Target | Status |
|--------|--------|--------|
| Peak Reduction | 15%+ | Achieved |
| Savings Potential | > 10% | Achieved |
| Constraint Satisfaction | 100% | Achieved |
| Solution Feasibility | 100% | Achieved |

---

## 3. Requirements Mapping

### Academic Requirements Mapping

| PO | Requirement | Implementation |
|----|-------------|-----------------|
| PO1 | Engineering Knowledge | ARIMA, LSTM, Prophet models |
| PO2 | Problem Analysis | Energy consumption analysis |
| PO3 | Design/Development | Dashboard UI, API design |
| PO4 | Research Methods | Time-series analysis, optimization |
| PO5 | Modern Tool Usage | Next.js, React, ML algorithms |
| PO6 | Engineer and Society | Sustainability, smart grids |
| PO7 | Environment | Renewable integration |
| PO8 | Ethics | Transparent, fair algorithms |
| PO9 | Team Work | Collaborative project |
| PO10 | Communication | Documentation, code clarity |
| PO11 | Project Management | Milestone-based delivery |
| PO12 | Life-Long Learning | Advanced ML, optimization |

### PSO Requirements

| PSO | Requirement | Implementation |
|-----|-------------|-----------------|
| PSO1 | IT Solutions | Energy management system |
| PSO2 | Evolving Tech | Python ML → JS Implementation, IoT preparation |

### PEO Requirements

| PEO | Requirement | Implementation |
|-----|-------------|-----------------|
| PEO1 | Problem Solving | Energy forecasting & optimization |
| PEO2 | Practical Skills | Full-stack development |
| PEO3 | Industry Skills | Cloud deployment, databases |
| PEO4 | Professionalism | Code quality, documentation |

---

## 4. Deployment Specifications

### Development Environment
- **OS**: Linux, macOS, Windows
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Port**: 3000 (default)

### Production Environment
- **Hosting**: Vercel, AWS, Azure, or Docker
- **Database**: PostgreSQL 12+
- **CDN**: Optional for static assets
- **SSL**: Required (HTTPS)

### Deployment Checklist
- [ ] Environment variables configured
- [ ] Database initialized and migrated
- [ ] Build optimization enabled
- [ ] Monitoring and logging setup
- [ ] Security headers configured
- [ ] Error tracking enabled
- [ ] Backup strategy implemented
- [ ] Performance monitoring active

---

## 5. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-06 | Initial release |
| 0.9.0 | 2026-01-20 | Beta version |
| 0.5.0 | 2025-12-15 | Architecture defined |

---

## 6. References

### Documentation
- [README.md](./README.md) - Project overview
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture
- [SETUP.md](./SETUP.md) - Setup and installation

### Technologies
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)

### Standards
- [JSON:API](https://jsonapi.org/)
- [RESTful API Design](https://restfulapi.net/)
- [W3C Accessibility](https://www.w3.org/WAI/)

---

**Document Version**: 1.0.0
**Last Updated**: February 6, 2026
**Author**: KMIT CSE Team
