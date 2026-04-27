'use client';

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useDataset } from '@/contexts/DatasetContext';

export default function ARIMAPrediction({ dataLoaded, consumptionData }) {
  const { dataset, isDataLoaded } = useDataset();

  const data = consumptionData || dataset?.data;
  const actualDataLoaded =
    dataLoaded !== undefined ? dataLoaded : isDataLoaded;

  const modelResults = dataset?.modelResults;
  const arimaModel = modelResults?.models?.arima;
  const predictions = arimaModel?.forecast || [];
  const metrics = arimaModel?.metrics || null;

  // ✅ Safe formatter
  const safeFormat = (value, decimals = 2) => {
    if (value === null || value === undefined || isNaN(value)) {
      return '-';
    }
    return Number(value).toFixed(decimals);
  };

  // ✅ Prepare chart data (FIXED LIKE LSTM)
  const chartData = [];

  if (data?.length > 0) {
    const lastValues = data.slice(-7);

    // ✅ Actual: Day -7 → Day -1
    lastValues.forEach((val, idx) => {
      chartData.push({
        time: `Day -${7 - idx}`,
        actual: val,
        forecast: null,
      });
    });

    // ✅ Forecast: Day +1 → Day +N
    predictions.forEach((val, idx) => {
      chartData.push({
        time: `Day +${idx + 1}`,
        actual: null,
        forecast: val,
      });
    });
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
          <TrendingUp
            className="text-green-600 dark:text-green-400"
            size={24}
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            ARIMA Forecasting
          </h3>
          <p className="text-sm text-muted-foreground">
            Statistical time-series forecasting
          </p>
        </div>
      </div>

      {/* No Data */}
      {!actualDataLoaded && (
        <div className="p-6 bg-secondary/20 border border-border rounded-lg text-center">
          <p className="text-muted-foreground">
            Upload a dataset to enable ARIMA forecasting
          </p>
        </div>
      )}

      {/* Processing */}
      {actualDataLoaded && !arimaModel && (
        <div className="p-6 bg-secondary/20 border border-border rounded-lg text-center">
          <p className="text-muted-foreground">
            Models are processing your data...
          </p>
        </div>
      )}

      {/* Model Ready */}
      {actualDataLoaded && arimaModel && (
        <>
          {/* Description */}
          {arimaModel.model_description && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <p className="text-sm text-green-700 dark:text-green-400">
                  {arimaModel.model_description}
                </p>
                {arimaModel.order && (
                  <span className="text-xs bg-green-200 dark:bg-green-900 px-2 py-1 rounded">
                    Order: ({arimaModel.order.join(',')})
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Chart */}
          {predictions?.length > 0 && (
            <div className="bg-background border border-border rounded-lg p-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />

                  {/* Actual Line */}
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    connectNulls={false}
                  />

                  {/* Forecast Line */}
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke="#22c55e"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    connectNulls={false} // 🔥 important
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Metrics */}
          {metrics && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <MetricBox label="MAE" value={safeFormat(metrics?.MAE)} />
              <MetricBox label="RMSE" value={safeFormat(metrics?.RMSE)} />
              <MetricBox label="MAPE" value={safeFormat(metrics?.MAPE)} />
              <MetricBox
                label="R² Score"
                value={
                  metrics?.R2_Score !== undefined
                    ? safeFormat(metrics.R2_Score, 4)
                    : "0.0000"
                }
              />
            </div>
          )}

          {/* Forecast Table */}
          {predictions?.length > 0 && (
            <div className="bg-background border border-border rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold">Forecast Results</p>
              </div>
              <div className="divide-y divide-border max-h-48 overflow-y-auto">
                {predictions.map((pred, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-3 flex justify-between items-center"
                  >
                    <span className="text-sm text-muted-foreground">
                      Day +{idx + 1}
                    </span>
                    <span className="font-semibold">
                      {safeFormat(pred)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function MetricBox({ label, value }) {
  return (
    <div className="bg-background border border-border rounded-lg p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}