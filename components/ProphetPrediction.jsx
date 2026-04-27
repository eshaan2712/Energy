"use client";

import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useDataset } from "@/contexts/DatasetContext";
import { TrendingUp } from "lucide-react";

export default function ProphetPrediction() {
  const { dataset } = useDataset();

  const prophetData = dataset?.modelResults?.models?.prophet;

  if (!prophetData || prophetData.status === "error") {
    return (
      <div className="p-8 bg-secondary/20 border border-border rounded-lg text-center">
        <p className="text-muted-foreground">
          Prophet model failed or no data available
        </p>
      </div>
    );
  }

  const forecast = prophetData.forecast || [];
  const historical = prophetData.historical || [];

  // ✅ FIXED CHART DATA (date aligned)
  const chartData = [];

  // Historical
  historical.forEach((point) => {
    chartData.push({
      period: point.date,
      actual: Number(point.value),
      forecast: null,
    });
  });

  // Forecast
  forecast.forEach((point) => {
    chartData.push({
      period: point.date,
      actual: null,
      forecast: Number(point.value),
    });
  });

  const metrics = prophetData.metrics || {};

  return (
    <div className="space-y-6">
      {/* Chart */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-purple-500" size={20} />
          <h3 className="font-semibold text-foreground">Prophet Forecast</h3>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />

            <XAxis dataKey="period" stroke="var(--muted-foreground)" />

            <YAxis stroke="var(--muted-foreground)" />

            <Tooltip
              contentStyle={{
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
              }}
            />

            <Legend />

            {/* Historical */}
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={false}
              name="Historical"
              connectNulls={false}
            />

            {/* Forecast */}
            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#ec4899"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Forecast"
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Metrics */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">
          Performance Metrics
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-background/50 p-3 rounded">
            <p className="text-xs text-muted-foreground">MAE</p>
            <p className="font-semibold">
              {metrics.MAE ? metrics.MAE.toFixed(2) : "N/A"}
            </p>
          </div>

          <div className="bg-background/50 p-3 rounded">
            <p className="text-xs text-muted-foreground">RMSE</p>
            <p className="font-semibold">
              {metrics.RMSE ? metrics.RMSE.toFixed(2) : "N/A"}
            </p>
          </div>

          <div className="bg-background/50 p-3 rounded">
            <p className="text-xs text-muted-foreground">MAPE</p>
            <p className="font-semibold">
              {metrics.MAPE ? metrics.MAPE.toFixed(2) + "%" : "N/A"}
            </p>
          </div>
          <div className="bg-background/50 p-3 rounded">
            <p className="text-xs text-muted-foreground">R² Score</p>
            <p className="font-semibold">
              {metrics.R2 ? metrics.R2.toFixed(4) : "N/A"}
            </p>
          </div>
        </div>
      </Card>

      {/* Model Info */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-2">
          About Prophet Model
        </h3>

        <p className="text-sm text-muted-foreground">
          This implementation captures trend and weekly seasonality patterns to
          generate stable and interpretable forecasts.
        </p>

        <div className="mt-4 space-y-2 text-sm">
          <div>
            <span className="font-medium text-foreground">Data Points: </span>
            <span className="text-muted-foreground">
              {prophetData.data_points}
            </span>
          </div>

          <div>
            <span className="font-medium text-foreground">
              Forecast Steps:{" "}
            </span>
            <span className="text-muted-foreground">
              {forecast.length} days
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
