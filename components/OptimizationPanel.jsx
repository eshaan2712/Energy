"use client";

import { useEffect, useState } from "react";
import { useDataset } from "@/contexts/DatasetContext";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function OptimizationPanel() {
  const { dataset } = useDataset();

  const [optimization, setOptimization] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOptimization();
  }, [dataset]);

  const loadOptimization = () => {
    setLoading(true);

    try {
      const opt = dataset?.modelResults?.optimization;
      const forecast = dataset?.modelResults?.final_forecast;
      const rawData = dataset?.fullData;

      if (!opt || !forecast || !rawData || rawData.length === 0) {
        setOptimization(null);
        return;
      }

      // 🔥 TOTAL
      const totalCurrent = forecast.reduce((a, b) => a + b, 0);
      const totalOptimized =
        totalCurrent * (1 - (opt.reduction_percent || 0) / 100);

      const totalSavingsUnits = totalCurrent - totalOptimized;

      // 🔥 REAL SECTOR GROUPING FROM DATASET
      const sectorMap = {};

      rawData.forEach((row) => {
        const sector = (row.sector || "unknown").toLowerCase();
        const value = Number(row.value || 0);

        if (!sectorMap[sector]) {
          sectorMap[sector] = 0;
        }

        if (!isNaN(value)) {
          sectorMap[sector] += value;
        }
      });

      const totalDatasetValue = Object.values(sectorMap).reduce((a, b) => a + b, 0);

      const recommendations = {};

      Object.entries(sectorMap).forEach(([sector, sectorValue]) => {
        const ratio =
          totalDatasetValue > 0 ? sectorValue / totalDatasetValue : 0;

        const current = totalCurrent * ratio;
        const recommended = totalOptimized * ratio;
        const savings = current - recommended;

        recommendations[sector] = {
          current,
          recommended,
          savings,
          actions: [
            "Optimize load distribution",
            "Use energy-efficient systems",
            "Monitor peak usage"
          ]
        };
      });

      setOptimization({
        summary: {
          totalCurrentConsumption: totalCurrent,
          totalOptimizedConsumption: totalOptimized,
          totalSavingsPotential: totalSavingsUnits,
          savingsPercentage: opt.reduction_percent || 0,
          annualSavings: opt.annual_savings || 0
        },
        recommendations
      });

    } catch (error) {
      console.error("Optimization error:", error);
      setOptimization(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Card className="p-6">Loading optimization...</Card>;
  }

  if (!optimization) {
    return <Card className="p-6">No optimization data</Card>;
  }

  // 🔥 UI FORMAT (UNCHANGED)
  const sectorRecommendations = Object.fromEntries(
    Object.entries(optimization.recommendations).map(([sector, rec]) => [
      sector,
      {
        current: rec.current || 0,
        recommended: rec.recommended || 0,
        savings: rec.savings || 0,
        savingsPercentage:
          rec.current > 0
            ? ((rec.current - rec.recommended) / rec.current) * 100
            : 0,
        actions: rec.actions || []
      }
    ])
  );

  const strategicRecommendations = [
    {
      title: "Peak Demand Reduction",
      description: "Reduce peak load usage",
      impact: `Save ₹${Math.round(optimization.summary.annualSavings)} annually`,
      timeline: "Q1–Q2 2026",
      priority: "HIGH"
    },
    {
      title: "Renewable Energy Integration",
      description: "Increase renewable usage",
      impact: "Reduce carbon emissions",
      timeline: "Q2–Q4 2026",
      priority: "HIGH"
    },
    {
      title: "Smart Grid Implementation",
      description: "Enable real-time optimization",
      impact: "Improve efficiency",
      timeline: "Q3–Q4 2026",
      priority: "MEDIUM"
    }
  ];

  // 🔥 CHART DATA
  const chartData = Object.entries(sectorRecommendations).map(
    ([sector, rec]) => ({
      name: sector.charAt(0).toUpperCase() + sector.slice(1),
      current: Math.round(rec.current),
      recommended: Math.round(rec.recommended)
    })
  );

  return (
    <div className="space-y-6">

      {/* MAIN CARD */}
      <Card className="p-6 bg-card">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Energy Optimization Recommendations
            </h2>
            <p className="text-muted-foreground">
              Optimization based on ML forecast (ARIMA, LSTM, Prophet)
            </p>
          </div>

          <div className="text-right">
            <p className="text-3xl font-bold text-green-600">
              {optimization.summary.savingsPercentage.toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground">Potential Savings</p>
          </div>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Current Consumption (kWh)</p>
            <p className="text-2xl font-bold">
              {Math.round(optimization.summary.totalCurrentConsumption)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Optimized Target (kWh)</p>
            <p className="text-2xl font-bold">
              {Math.round(optimization.summary.totalOptimizedConsumption)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Annual Savings (₹)</p>
            <p className="text-2xl font-bold text-green-600">
              ₹{Math.round(optimization.summary.annualSavings)}
            </p>
          </div>

        </div>

        {/* CHART */}
        <h3 className="text-lg font-semibold mb-4">
          Sector-wise Optimization
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: "Energy (kWh)", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="current" fill="#3b82f6" name="Before Optimization" />
            <Bar dataKey="recommended" fill="#22c55e" name="After Optimization" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* ACTIONABLE STEPS */}
      <Card className="p-6 bg-card">
        <h3 className="text-lg font-semibold mb-4">
          Actionable Steps by Sector
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(sectorRecommendations).map(([sector, rec]) => (
            <div key={sector} className="border border-border rounded-lg p-4">
              <p className="font-semibold capitalize">{sector}</p>

              <p className="text-xs text-muted-foreground mb-3">
                Save {rec.savingsPercentage.toFixed(1)}% ({Math.round(rec.savings)} kWh)
              </p>

              <ul className="space-y-2">
                {rec.actions.map((action, idx) => (
                  <li key={idx} className="text-xs flex gap-2">
                    <CheckCircle size={14} className="text-green-600 mt-0.5" />
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
}