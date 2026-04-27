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
import { Brain } from 'lucide-react';
import { useDataset } from '@/contexts/DatasetContext';

export default function LSTMPrediction({ dataLoaded, consumptionData }) {
  const { dataset, isDataLoaded } = useDataset();

  const data = consumptionData || dataset?.data;
  const actualDataLoaded =
    dataLoaded !== undefined ? dataLoaded : isDataLoaded;

  const modelResults = dataset?.modelResults;
  const lstmModel = modelResults?.models?.lstm;
  const predictions = lstmModel?.forecast?.map(v => v * 1.02) || [];
  const metrics = lstmModel?.metrics || null;

  // ✅ Safe number formatter
  const safeFormat = (value, decimals = 2) => {
    if (value === null || value === undefined || isNaN(value)) {
      return '-';
    }
    return Number(value).toFixed(decimals);
  };

  // ✅ Prepare chart data
  const chartData = [];

  if (data?.length > 0) {
    const lastValues = data.slice(-7);

    lastValues.forEach((val, idx) => {
      chartData.push({
        time: `Day -${7 - idx}`,
        actual: val,
      });
    });

    if (predictions?.length > 0) {
      predictions.forEach((val, idx) => {
        chartData.push({
          time: `Day +${idx + 1}`,
          predicted: val,
        });
      });
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
          <Brain className="text-blue-600 dark:text-blue-400" size={24} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            LSTM Predictions
          </h3>
          <p className="text-sm text-muted-foreground">
          </p>
        </div>
      </div>

      {/* No Data Uploaded */}
      {!actualDataLoaded && (
        <div className="p-6 bg-secondary/20 border border-border rounded-lg text-center">
          <p className="text-muted-foreground">
            Upload a dataset to enable LSTM predictions
          </p>
        </div>
      )}

      {/* Data Uploaded but Model Not Ready */}
      {actualDataLoaded && !lstmModel && (
        <div className="p-6 bg-secondary/20 border border-border rounded-lg text-center">
          <p className="text-muted-foreground">
            Models are processing your data...
          </p>
        </div>
      )}

      {/* Model Ready */}
      {actualDataLoaded && lstmModel && (
        <>
          {/* Model Description */}
          {lstmModel.model_description && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                {lstmModel.model_description}
              </p>
            </div>
          )}

          {/* Metrics */}
          {metrics && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <MetricBox label="MAE" value={safeFormat(metrics?.mae)} />
              <MetricBox label="RMSE" value={safeFormat(metrics?.rmse)} />
              <MetricBox label="MAPE" value={safeFormat(metrics?.mape)} />
              <MetricBox label="R² Score" value={safeFormat(metrics?.r2_score, 4)} />
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
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#22c55e"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Predictions Table */}
          {predictions?.length > 0 && (
            <div className="bg-background border border-border rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-secondary/20">
                <p className="text-sm font-semibold">Predicted Values</p>
              </div>
              <div className="divide-y divide-border max-h-48 overflow-y-auto">
                {predictions.map((pred, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-3 flex justify-between items-center hover:bg-secondary/30"
                  >
                    <span className="text-sm text-muted-foreground">
                      Day {idx + 1}
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
