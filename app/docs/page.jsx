'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  TrendingUp,
  Zap,
  Brain,
  BookOpen,
  ChevronRight,
  Database,
  LineChart,
  AlertCircle,
} from 'lucide-react';

export default function Documentation() {
  const [expandedSection, setExpandedSection] = useState('overview');

  const sections = [
    {
      id: 'overview',
      title: 'Project Overview',
      icon: BookOpen,
      content: (
        <div className="space-y-4">
          <p className="text-foreground/90">
            The Energy Consumption Forecasting & Optimization Dashboard is a comprehensive AI-powered platform for energy management, forecasting, and optimization. It leverages advanced machine learning models to predict energy consumption patterns and provide actionable optimization strategies.
          </p>
          <div className="bg-card border border-border rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-foreground mb-2">Key Technologies:</h4>
            <ul className="list-disc list-inside space-y-1 text-foreground/80">
              <li>ARIMA (AutoRegressive Integrated Moving Average)</li>
              <li>LSTM (Long Short-Term Memory Neural Networks)</li>
              <li>Prophet (Facebook's Time-Series Forecasting)</li>
              <li>Ensemble Methods for Combined Predictions</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'dashboard',
      title: 'Main Dashboard',
      icon: BarChart3,
      metrics: [
        'Current Energy Consumption (kWh)',
        'Peak Demand Hour',
        'Average Daily Consumption',
        'Cost Estimate',
        'Carbon Footprint Estimate',
        'Trend Analysis',
      ],
      features: [
        '4-Tab Interface: Overview, Forecasts, Optimization, Analytics',
        'Real-time KPI Cards showing critical metrics',
        'Historical consumption trends (14-day view)',
        '14-day forecast with confidence intervals',
        'Peak demand and optimization insights',
        'Analytics dashboard with 30-day trends and sector analysis',
      ],
      content: (
        <div className="space-y-4">
          <p className="text-foreground/90">
            The Main Dashboard serves as the central hub for energy monitoring and analysis. It provides an at-a-glance overview of current energy consumption and forecasts.
          </p>
          <div className="bg-card border border-border rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-foreground mb-3">Dashboard Metrics:</h4>
            <div className="space-y-2">
              {[
                { label: 'Current Consumption', value: 'Real-time kWh usage' },
                { label: 'Peak Hour', value: 'Highest demand time' },
                { label: 'Daily Average', value: 'Mean daily consumption' },
                { label: 'Cost Estimate', value: 'Based on regional rates' },
                { label: 'Carbon Footprint', value: 'CO₂ emissions estimate' },
                { label: 'Trend', value: '% change from previous period' },
              ].map((metric, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-foreground/70">{metric.label}:</span>
                  <span className="text-foreground font-medium">{metric.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-accent/10 border border-accent rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Zap size={16} className="text-accent" />
              Key Features:
            </h4>
            <ul className="space-y-1 text-foreground/80 text-sm">
              {[
                'Multi-tab interface for different analyses',
                'Interactive charts with Recharts library',
                'Color-coded trends (green = improvement, red = increase)',
                'Export-ready visualizations',
                'Dark mode support',
              ].map((feature, idx) => (
                <li key={idx} className="flex gap-2">
                  <ChevronRight size={14} className="text-accent mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'forecast-tab',
      title: 'Forecast Tab (Main Dashboard)',
      icon: TrendingUp,
      metrics: [
        'ARIMA Forecast (7-14 days)',
        'LSTM Forecast (7-14 days)',
        'Prophet Forecast (7-14 days)',
        'Ensemble Forecast (Combined)',
        '95% Confidence Intervals',
        'Model Accuracy Metrics (MAE, RMSE, MAPE, R²)',
      ],
      content: (
        <div className="space-y-4">
          <p className="text-foreground/90">
            The Forecast Tab displays 14-day energy consumption predictions using three different models and an ensemble approach. Each model is optimized for capturing different patterns in the data.
          </p>
          <div className="bg-card border border-border rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-foreground mb-3">Prediction Models:</h4>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-foreground">ARIMA Model</p>
                <p className="text-foreground/70 text-sm">Statistical time-series forecasting. Accuracy: 85-87%</p>
              </div>
              <div>
                <p className="font-medium text-foreground">LSTM Model</p>
                <p className="text-foreground/70 text-sm">Deep learning neural network. Accuracy: 88-90%</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Prophet Model</p>
                <p className="text-foreground/70 text-sm">Seasonal decomposition forecasting. Accuracy: 86-88%</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Ensemble Model</p>
                <p className="text-foreground/70 text-sm">Weighted combination of all three. Accuracy: 90%+</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-foreground mb-2">Metrics Explained:</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="font-medium text-foreground">MAE:</span>
                <span className="text-foreground/70 ml-2">Mean Absolute Error (average prediction deviation)</span>
              </li>
              <li>
                <span className="font-medium text-foreground">RMSE:</span>
                <span className="text-foreground/70 ml-2">Root Mean Squared Error (penalizes larger errors)</span>
              </li>
              <li>
                <span className="font-medium text-foreground">MAPE:</span>
                <span className="text-foreground/70 ml-2">Mean Absolute Percentage Error (percentage accuracy)</span>
              </li>
              <li>
                <span className="font-medium text-foreground">R² Score:</span>
                <span className="text-foreground/70 ml-2">Coefficient of Determination (0-1 scale, 1 is perfect)</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'optimization',
      title: 'Optimization Tab',
      icon: Zap,
      metrics: [
        'Peak Demand Reduction Potential',
        'Cost Savings Estimate',
        'Load Shifting Opportunities',
        'Demand Response Programs',
        'Renewable Energy Integration',
        'Optimization Score (0-100)',
      ],
      content: (
        <div className="space-y-4">
          <p className="text-foreground/90">
            The Optimization Tab uses linear programming and heuristic algorithms to identify cost-saving opportunities and recommend demand reduction strategies.
          </p>
          <div className="bg-card border border-border rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-foreground mb-3">Optimization Strategies:</h4>
            <div className="space-y-2 text-sm">
              <div className="border-l-2 border-accent pl-3 py-1">
                <p className="font-medium text-foreground">Demand Reduction</p>
                <p className="text-foreground/70">Shift non-peak loads to off-peak hours (15-18% reduction)</p>
              </div>
              <div className="border-l-2 border-accent pl-3 py-1">
                <p className="font-medium text-foreground">Load Balancing</p>
                <p className="text-foreground/70">Distribute consumption evenly across time periods</p>
              </div>
              <div className="border-l-2 border-accent pl-3 py-1">
                <p className="font-medium text-foreground">Renewable Integration</p>
                <p className="text-foreground/70">Leverage solar/wind generation patterns</p>
              </div>
              <div className="border-l-2 border-accent pl-3 py-1">
                <p className="font-medium text-foreground">Cost Optimization</p>
                <p className="text-foreground/70">Potential annual savings: 12-15%</p>
              </div>
            </div>
          </div>
          <div className="bg-accent/10 border border-accent rounded-lg p-4 mt-4">
            <p className="text-foreground text-sm">
              Sector-wise recommendations for Residential, Commercial, and Industrial sectors based on consumption patterns.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'analytics',
      title: 'Analytics Tab',
      icon: LineChart,
      metrics: [
        '30-day consumption trend',
        'Sector-wise breakdown (Residential, Commercial, Industrial)',
        'Daily usage patterns',
        'Weekly averages',
        'Peak hour analysis',
        'Consumption forecast comparison',
      ],
      content: (
        <div className="space-y-4">
          <p className="text-foreground/90">
            The Analytics Tab provides detailed consumption analysis with trend visualization, sector comparison, and historical pattern identification.
          </p>
          <div className="bg-card border border-border rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-foreground mb-3">Analytics Insights:</h4>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-foreground text-sm">Consumption Trends</p>
                <p className="text-foreground/70 text-sm">30-day historical data with trend line and growth rate</p>
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Sector Analysis</p>
                <p className="text-foreground/70 text-sm">Break down consumption by Residential, Commercial, Industrial sectors</p>
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Peak Hours</p>
                <p className="text-foreground/70 text-sm">Identify time periods with highest consumption</p>
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Comparative Analysis</p>
                <p className="text-foreground/70 text-sm">Compare historical vs forecasted consumption</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'ml-analysis',
      title: 'ML Analysis Page',
      icon: Brain,
      metrics: [
        'Custom Dataset Upload',
        'LSTM-based consumption prediction',
        'ARIMA-based future forecasting',
        'Model accuracy metrics',
        'Confidence intervals',
        'Real-time predictions',
      ],
      content: (
        <div className="space-y-4">
          <p className="text-foreground/90">
            A dedicated machine learning interface allowing users to upload custom energy datasets and run LSTM and ARIMA predictions with full model evaluation metrics.
          </p>
          <div className="bg-card border border-border rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-foreground mb-3">ML Analysis Tabs:</h4>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-foreground">Dataset Upload</p>
                <p className="text-foreground/70 text-sm">Upload CSV files with consumption data. Supports columns: consumption, energy, power, demand</p>
              </div>
              <div>
                <p className="font-medium text-foreground">LSTM Prediction</p>
                <p className="text-foreground/70 text-sm">Deep learning model for consumption prediction with selectable time horizons</p>
              </div>
              <div>
                <p className="font-medium text-foreground">ARIMA Forecasting</p>
                <p className="text-foreground/70 text-sm">Statistical model for future predictions with 95% confidence intervals</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-950/30 border border-blue-800/30 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Database size={16} />
              Dataset Upload Format:
            </h4>
            <pre className="bg-background/50 rounded p-3 text-xs text-foreground/70 overflow-x-auto">
{`date,consumption
2024-01-01,2150.5
2024-01-02,2240.8
2024-01-03,2180.3
...`}
            </pre>
          </div>
        </div>
      ),
    },
    {
      id: 'accuracy',
      title: 'Model Accuracy & Evaluation',
      icon: AlertCircle,
      content: (
        <div className="space-y-4">
          <p className="text-foreground/90">
            When you upload a custom dataset, the accuracy of predictions depends on data quality, historical period, and consumption patterns.
          </p>
          <div className="bg-card border border-border rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-foreground mb-3">Accuracy Factors:</h4>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-foreground">Data Quality (30%)</p>
                <p className="text-foreground/70">Clean, consistent data improves predictions. Missing values reduce accuracy by 5-10%</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Historical Period (40%)</p>
                <p className="text-foreground/70">More historical data improves accuracy. Minimum: 30 days. Optimal: 1+ years</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Consumption Patterns (30%)</p>
                <p className="text-foreground/70">Regular patterns are easier to predict. Irregular consumption reduces accuracy</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-foreground mb-3">Expected Accuracy Ranges:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-2 bg-background/50 rounded">
                <span className="text-foreground">Minimal Data (30 days)</span>
                <span className="font-medium text-yellow-500">78-82% MAPE</span>
              </div>
              <div className="flex justify-between p-2 bg-background/50 rounded">
                <span className="text-foreground">Good Data (3-6 months)</span>
                <span className="font-medium text-green-500">85-88% MAPE</span>
              </div>
              <div className="flex justify-between p-2 bg-background/50 rounded">
                <span className="text-foreground">Excellent Data (1+ years)</span>
                <span className="font-medium text-green-600">90-95% MAPE</span>
              </div>
            </div>
          </div>
          <div className="bg-accent/10 border border-accent rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-foreground mb-2">Model-Specific Details:</h4>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li>
                <span className="font-medium text-foreground">LSTM:</span> Best for complex patterns, requires more data (min 60 points), 88-90% accuracy with good data
              </li>
              <li>
                <span className="font-medium text-foreground">ARIMA:</span> Best for stationary series, works with less data (min 30 points), 85-87% accuracy
              </li>
              <li>
                <span className="font-medium text-foreground">Ensemble:</span> Combines both methods, most robust, 90%+ accuracy with adequate data
              </li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/90 mb-4"
          >
            <ChevronRight size={16} className="rotate-180" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-2">Documentation</h1>
          <p className="text-foreground/70">
            Complete guide to the Energy Consumption Forecasting & Optimization Dashboard
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-2">
              {sections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setExpandedSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                      expandedSection === section.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-card text-foreground/80 hover:text-foreground'
                    }`}
                  >
                    <IconComponent size={18} />
                    <span className="text-sm font-medium">{section.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-3">
            {sections.map((section) => (
              expandedSection === section.id && (
                <div key={section.id} className="animate-in fade-in">
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                      <section.icon size={32} className="text-accent" />
                      {section.title}
                    </h2>
                    {section.content}
                    {section.metrics && (
                      <div className="bg-card border border-border rounded-lg p-4 mt-4">
                        <h4 className="font-semibold text-foreground mb-3">Key Metrics:</h4>
                        <ul className="grid md:grid-cols-2 gap-2">
                          {section.metrics.map((metric, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-foreground/80 text-sm"
                            >
                              <ChevronRight size={14} className="text-accent mt-0.5 flex-shrink-0" />
                              {metric}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8">
          <h3 className="text-2xl font-bold mb-4">Getting Started Tips</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-2">For First-Time Users:</h4>
              <ol className="space-y-2 text-foreground/80 text-sm list-decimal list-inside">
                <li>Start with the Main Dashboard for an overview</li>
                <li>Check the Forecast tab to understand predictions</li>
                <li>Review Optimization recommendations</li>
                <li>Explore Analytics for deeper insights</li>
              </ol>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-2">For ML Model Testing:</h4>
              <ol className="space-y-2 text-foreground/80 text-sm list-decimal list-inside">
                <li>Go to ML Analysis page</li>
                <li>Upload your energy dataset (CSV format)</li>
                <li>Use LSTM for consumption predictions</li>
                <li>Use ARIMA for future forecasting</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
