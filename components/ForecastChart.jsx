'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ForecastChart() {
  const [forecastData, setForecastData] = useState(null);
  const [selectedSector, setSelectedSector] = useState('residential');
  const [selectedModel, setSelectedModel] = useState('ensemble');
  const [loading, setLoading] = useState(false);

  const sectors = ['residential', 'commercial', 'industrial'];
  const models = ['arima', 'lstm', 'prophet', 'ensemble'];

  useEffect(() => {
    fetchForecast();
  }, [selectedSector, selectedModel]);

  const fetchForecast = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/forecast?sector=${selectedSector}&model=${selectedModel}&steps=14`);
      const data = await response.json();
      
      // Prepare chart data
      const chartData = [];
      const historicalLength = data.historical.length;
      
      // Add historical data
      data.historical.forEach((val, idx) => {
        chartData.push({
          date: `Day ${idx - historicalLength}`,
          actual: Math.round(val),
          type: 'historical'
        });
      });
      
      // Add forecast data
      const forecastArray = Array.isArray(data.forecast) ? data.forecast : data.forecast.ensemble;
      forecastArray.forEach((val, idx) => {
        chartData.push({
          date: `Day +${idx + 1}`,
          forecast: Math.round(val),
          lower: data.confidenceIntervals?.lower[idx] ? Math.round(data.confidenceIntervals.lower[idx]) : undefined,
          upper: data.confidenceIntervals?.upper[idx] ? Math.round(data.confidenceIntervals.upper[idx]) : undefined,
          type: 'forecast'
        });
      });

      setForecastData({ ...data, chartData });
    } catch (error) {
      console.error('Error fetching forecast:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!forecastData) {
    return (
      <Card className="p-6 bg-card">
        <p className="text-muted-foreground">Loading forecast data...</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Energy Consumption Forecast</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4 md:grid-cols-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Sector</label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
            >
              {sectors.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Model</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
            >
              {models.map(m => <option key={m} value={m} className="capitalize">{m}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-4">
          <div className="bg-secondary/30 p-2 rounded">
            <p className="text-muted-foreground">MAE</p>
            <p className="font-semibold text-foreground">{Math.round(forecastData.metrics.mae)} MWh</p>
          </div>
          <div className="bg-secondary/30 p-2 rounded">
            <p className="text-muted-foreground">RMSE</p>
            <p className="font-semibold text-foreground">{Math.round(forecastData.metrics.rmse)} MWh</p>
          </div>
          <div className="bg-secondary/30 p-2 rounded">
            <p className="text-muted-foreground">MAPE</p>
            <p className="font-semibold text-foreground">{forecastData.metrics.mape.toFixed(2)}</p>
          </div>
          <div className="bg-secondary/30 p-2 rounded">
            <p className="text-muted-foreground">R² Score</p>
            <p className="font-semibold text-foreground">{forecastData.metrics.r2Score.toFixed(3)}</p>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={forecastData.chartData}>
          <defs>
            <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(210, 80%, 50%)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(210, 80%, 50%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 5%, 92%)" />
          <XAxis dataKey="date" stroke="hsl(210, 5%, 45%)" style={{ fontSize: '12px' }} />
          <YAxis stroke="hsl(210, 5%, 45%)" style={{ fontSize: '12px' }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(0, 0%, 98%)',
              border: '1px solid hsl(210, 5%, 92%)',
              borderRadius: '8px'
            }}
            labelStyle={{ color: 'hsl(210, 5%, 15%)' }}
          />
          <Legend />
          {forecastData.chartData.some(d => d.actual) && (
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="hsl(180, 60%, 50%)" 
              strokeWidth={2}
              dot={false}
              name="Historical"
            />
          )}
          {forecastData.chartData.some(d => d.forecast) && (
            <Area
              type="monotone"
              dataKey="forecast"
              stroke="hsl(210, 80%, 50%)"
              fillOpacity={1}
              fill="url(#colorForecast)"
              name="Forecast"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
