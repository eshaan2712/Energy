"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
} from "recharts";
import { useDataset } from "@/contexts/DatasetContext";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function ModelResults() {
  const { dataset } = useDataset();

  // ✅ Handle JSON string safely
  const modelResults =
    typeof dataset?.modelResults === "string"
      ? JSON.parse(dataset.modelResults)
      : dataset?.modelResults;

  const models = modelResults?.models || {};

  // ✅ Handle naming mismatches
  const arimaModel = models?.arima || models?.ARIMA;
  const lstmModel = models?.lstm || models?.LSTM;
  const prophetModel = models?.prophet || models?.Prophet;

  // ✅ Safe number formatter
  const safeFixed = (val, digits = 2) =>
    typeof val === "number" ? val.toFixed(digits) : "N/A";

  // ✅ Universal metric getter
  const getMetric = (metrics, upperKey, lowerKey) =>
    metrics?.[upperKey] ?? metrics?.[lowerKey];

  if (!modelResults) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No Results Available
      </div>
    );
  }

  const renderModelCard = (name, model) => {
    if (!model) return null;

    if (model.error) {
      return (
        <div className="p-4 border rounded">
          <AlertCircle className="text-red-500" />
          <p>
            {name} Error: {model.error}
          </p>
        </div>
      );
    }

    // ================= NORMALIZE DATA =================
    let forecast = [];
    let upper = [];
    let lower = [];

    if (name === "Prophet") {
      forecast = model.yhat || model.forecast || [];
      upper = model.yhat_upper || [];
      lower = model.yhat_lower || [];
    } else {
      forecast = model.forecast || [];
      upper = model.upper_bound || [];
      lower = model.lower_bound || [];
    }

    // Historical fallback
    const historical =
      model.historical_data || model.historical || dataset?.data || [];

    const metrics = model.metrics || {};

    // ================= FIXED CHART DATA LOGIC =================
    const chartData = [];

    // Historical
    historical.slice(-7).forEach((val, i) => {
      const actualValue = typeof val === "object" ? val.value : val;

      if (actualValue !== undefined && actualValue !== null) {
        chartData.push({
          time: val?.date || `Day-${7 - i}`,
          actual: Number(actualValue),
        });
      }
    });

    // Forecast
    forecast.forEach((val, i) => {
      const forecastValue = typeof val === "object" ? val.value : val;

      const upperValue =
        typeof upper?.[i] === "object" ? upper?.[i]?.value : upper?.[i];

      const lowerValue =
        typeof lower?.[i] === "object" ? lower?.[i]?.value : lower?.[i];

      if (forecastValue !== undefined && forecastValue !== null) {
        chartData.push({
          time: val?.date || `Day+${i + 1}`,
          forecast: Number(forecastValue),
          upper: upperValue !== undefined ? Number(upperValue) : undefined,
          lower: lowerValue !== undefined ? Number(lowerValue) : undefined,
        });
      }
    });

    // ================= UI (UNCHANGED) =================
    return (
      <div key={name} className="bg-card border rounded-lg p-5 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">{name}</h3>
          <CheckCircle className="text-green-500" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">MAE</p>
            <p>{safeFixed(getMetric(metrics, "MAE", "mae"))}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">RMSE</p>
            <p>{safeFixed(getMetric(metrics, "RMSE", "rmse"))}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">MAPE</p>
            <p>{safeFixed(getMetric(metrics, "MAPE", "mape"))}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">R² Score</p>
            <p>
              {safeFixed(
                metrics?.R2 ??
                  metrics?.r2 ??
                  metrics?.R2_Score ??
                  metrics?.r2_score,
                4,
              )}
            </p>
          </div>
        </div>

        {chartData.length > 0 && (
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#3b82f6"
                  name="Actual"
                  strokeWidth={2}
                />

                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#22c55e"
                  strokeDasharray="5 5"
                  name="Forecast"
                  strokeWidth={2}
                />

                <Area
                  type="monotone"
                  dataKey="upper"
                  stroke="#999"
                  fill="none"
                  strokeDasharray="3 3"
                  name="Upper Bound"
                />

                <Area
                  type="monotone"
                  dataKey="lower"
                  stroke="#999"
                  fill="none"
                  strokeDasharray="3 3"
                  name="Lower Bound"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 p-4">
      {renderModelCard("ARIMA", arimaModel)}
      {renderModelCard("LSTM", lstmModel)}
      {renderModelCard("Prophet", prophetModel)}
    </div>
  );
}
