'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [selectedSector, setSelectedSector] = useState('residential');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedSector]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics?sector=${selectedSector}`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return <Card className="p-6 bg-card"><p className="text-muted-foreground">Loading analytics...</p></Card>;
  }

  const sectorData = analytics[selectedSector] || analytics;

  // Model comparison data
  const modelComparison = [
    { name: 'ARIMA', accuracy: sectorData.accuracy?.arima || 85 },
    { name: 'LSTM', accuracy: sectorData.accuracy?.lstm || 88 },
    { name: 'Prophet', accuracy: sectorData.accuracy?.prophet || 86 }
  ];

  const sectors = Object.keys(analytics).filter(k => k !== 'timeRange' && k !== 'summary');

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Analytics & Performance Metrics</h2>
          
          <div className="flex gap-2 flex-wrap">
            {sectors.map(sector => (
              <button
                key={sector}
                onClick={() => setSelectedSector(sector)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedSector === sector
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {sector.charAt(0).toUpperCase() + sector.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-secondary/30 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target size={16} className="text-blue-600" />
              <p className="text-sm text-muted-foreground">Avg Consumption</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{Math.round(sectorData.averageConsumption)} MWh</p>
          </div>

          <div className="bg-secondary/30 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-orange-600" />
              <p className="text-sm text-muted-foreground">Peak Consumption</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{Math.round(sectorData.peakConsumption)} MWh</p>
          </div>

          <div className="bg-secondary/30 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown size={16} className="text-green-600" />
              <p className="text-sm text-muted-foreground">Min Consumption</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{Math.round(sectorData.minConsumption)} MWh</p>
          </div>

          <div className="bg-secondary/30 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target size={16} className="text-purple-600" />
              <p className="text-sm text-muted-foreground">Efficiency</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{sectorData.efficiency?.toFixed(1)}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Consumption Trends (30 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={sectorData.data?.slice(-30) || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 5%, 92%)" />
                <XAxis dataKey="date" stroke="hsl(210, 5%, 45%)" style={{ fontSize: '12px' }} />
                <YAxis stroke="hsl(210, 5%, 45%)" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(0, 0%, 98%)',
                    border: '1px solid hsl(210, 5%, 92%)'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="actual" stroke="hsl(210, 80%, 50%)" strokeWidth={2} name="Actual" />
                <Line type="monotone" dataKey="forecast" stroke="hsl(180, 60%, 50%)" strokeWidth={2} strokeDasharray="5 5" name="Forecast" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Model Accuracy Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={modelComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 5%, 92%)" />
                <XAxis dataKey="name" stroke="hsl(210, 5%, 45%)" />
                <YAxis stroke="hsl(210, 5%, 45%)" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(0, 0%, 98%)',
                    border: '1px solid hsl(210, 5%, 92%)'
                  }}
                />
                <Bar dataKey="accuracy" fill="hsl(210, 80%, 50%)" name="Accuracy (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-foreground mb-3">Model Accuracy</h4>
            <div className="space-y-2">
              {Object.entries(sectorData.accuracy || {}).map(([model, accuracy]) => (
                <div key={model} className="flex items-center justify-between">
                  <span className="text-muted-foreground capitalize">{model}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${accuracy}%` }}
                      />
                    </div>
                    <span className="text-foreground font-medium min-w-fit">{accuracy?.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-3">Sector Statistics</h4>
            <ul className="space-y-2">
              <li className="flex justify-between text-muted-foreground">
                <span>Trend</span>
                <span className={`font-medium ${sectorData.trend === 'increasing' ? 'text-red-600' : 'text-green-600'}`}>
                  {sectorData.trend === 'increasing' ? '↑' : '↓'} {Math.abs(sectorData.trendPercentage || 0).toFixed(1)}%
                </span>
              </li>
              <li className="flex justify-between text-muted-foreground">
                <span>Efficiency</span>
                <span className="font-medium text-foreground">{sectorData.efficiency?.toFixed(1)}%</span>
              </li>
              <li className="flex justify-between text-muted-foreground">
                <span>Potential Savings</span>
                <span className="font-medium text-green-600">{Math.round(sectorData.savings)} MWh</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
