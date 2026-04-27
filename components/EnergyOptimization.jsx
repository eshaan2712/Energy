'use client';

import { TrendingDown, Zap, Clock, CheckCircle } from 'lucide-react';
import { useDataset } from '@/contexts/DatasetContext';

export default function EnergyOptimization() {
  const { dataset } = useDataset();

  const opt = dataset?.modelResults?.optimization;

  if (!opt) {
    return (
      <div className="p-8 bg-secondary/20 border border-border rounded-lg text-center">
        <p className="text-muted-foreground">
          Run models to see optimization
        </p>
      </div>
    );
  }

  // ✅ Python values
  const monthlySavings = opt.monthly_savings || 0;
  const yearlySavings = opt.annual_savings || 0;
  const reductionPercent = opt.reduction_percent || 0;

  // 🔥 ENHANCED STRATEGIES
  const strategies = [
    ...opt.strategies.map((s) => {
      let icon = Clock;
      let actions = [
        "Automatically optimized using ML forecast",
        "Adjust system load dynamically",
        "Monitor usage trends in real-time"
      ];

      if (s.name.includes("Reduction")) {
        icon = TrendingDown;
        actions = [
          "Reduce peak consumption during high-demand hours",
          "Implement demand response programs",
          "Use smart scheduling for heavy loads",
          "Limit non-essential operations during peak hours"
        ];
      }

      return {
        title: s.name,
        description: `${s.units} units optimized`,
        savings: s.savings,
        icon,
        actions
      };
    }),

    // 🔥 NEW STRATEGY 1
    {
      title: "Energy Efficiency Improvement",
      description: "Improve system-wide efficiency",
      savings: (monthlySavings * 0.2).toFixed(2),
      icon: Zap,
      actions: [
        "Upgrade old HVAC systems",
        "Install energy-efficient lighting (LED)",
        "Use high-efficiency motors and equipment",
        "Perform regular maintenance checks"
      ]
    },

    // 🔥 NEW STRATEGY 2
    {
      title: "Renewable Energy Integration",
      description: "Reduce dependency on grid energy",
      savings: (monthlySavings * 0.15).toFixed(2),
      icon: Zap,
      actions: [
        "Install solar panels for daytime load",
        "Use hybrid renewable energy systems",
        "Store excess energy using battery systems",
        "Reduce reliance on non-renewable sources"
      ]
    },

    // 🔥 NEW STRATEGY 3
    {
      title: "Smart Load Scheduling",
      description: "Distribute energy usage efficiently",
      savings: (monthlySavings * 0.1).toFixed(2),
      icon: Clock,
      actions: [
        "Shift heavy operations to off-peak hours",
        "Automate load scheduling systems",
        "Balance load across different time slots",
        "Avoid simultaneous high-load operations"
      ]
    }
  ];

  return (
    <div className="space-y-6 pb-10">

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
          <p className="text-sm text-muted-foreground">Monthly Savings (₹)</p>
          <p className="text-3xl font-bold text-green-500">
            ₹{monthlySavings.toFixed(2)}
          </p>
        </div>

        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
          <p className="text-sm text-muted-foreground">Annual Savings (₹)</p>
          <p className="text-3xl font-bold text-blue-500">
            ₹{yearlySavings.toFixed(2)}
          </p>
        </div>

        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6">
          <p className="text-sm text-muted-foreground">Reduction (%)</p>
          <p className="text-3xl font-bold text-purple-500">
            {reductionPercent.toFixed(2)}%
          </p>
        </div>

      </div>

      {/* STRATEGIES */}
      <div className="space-y-4">
        <h3 className="font-semibold">Optimization Strategies</h3>

        {strategies.map((optItem, idx) => {
          const Icon = optItem.icon;

          return (
            <div key={idx} className="bg-card border border-border rounded-lg p-6 space-y-4">

              <div className="flex justify-between">
                <div className="flex gap-3">

                  <div className="p-3 rounded-lg bg-secondary/30">
                    <Icon className="text-primary" />
                  </div>

                  <div>
                    <h4 className="font-semibold">{optItem.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {optItem.description}
                    </p>
                  </div>

                </div>

                <p className="text-green-500 font-bold">
                  ₹{Number(optItem.savings).toFixed(2)}/mo
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Action Items:
                </p>

                {optItem.actions.map((a, i) => (
                  <div key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <CheckCircle size={14} className="text-green-500 mt-0.5" />
                    {a}
                  </div>
                ))}
              </div>

            </div>
          );
        })}
      </div>

      {/* TIMELINE (UNCHANGED) */}
      <div className="bg-card border border-border rounded-lg p-6 mt-6">
        <h3 className="font-semibold mb-4">Implementation Timeline</h3>

        <div className="space-y-4">

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-500 text-black text-xs font-bold">1</div>
            <div>
              <p className="font-medium">Week 1-2: Assessment</p>
              <p className="text-sm text-muted-foreground">
                Identify quick wins and low-cost improvements
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-500 text-black text-xs font-bold">2</div>
            <div>
              <p className="font-medium">Week 3-8: Implementation</p>
              <p className="text-sm text-muted-foreground">
                Deploy optimizations and automation
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-500 text-black text-xs font-bold">3</div>
            <div>
              <p className="font-medium">Month 3-6: Upgrades</p>
              <p className="text-sm text-muted-foreground">
                Complete equipment upgrades
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}