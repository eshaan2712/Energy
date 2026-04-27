'use client';

import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import ForecastChart from '@/components/ForecastChart';
import OptimizationPanel from '@/components/OptimizationPanel';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Zap, Settings, Brain, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    setLastUpdated(new Date().toLocaleString());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
                <Zap className="text-primary-foreground" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Energy Dashboard</h1>
                <p className="text-sm text-muted-foreground">Forecasting & Optimization Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-foreground/80 hover:text-foreground rounded-lg hover:bg-card/50 transition-colors text-sm font-medium"
              >
                <BookOpen size={16} />
                <span className="hidden sm:inline">Docs</span>
              </Link>
              <Link
                href="/ml-analysis"
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                <Brain size={16} />
                <span className="hidden sm:inline">ML Analysis</span>
              </Link>
              <div className="text-right hidden sm:block">
                <p className="text-sm text-muted-foreground">Last Updated: {lastUpdated || 'Loading...'}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <DashboardHeader />

        {/* Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 size={16} />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="forecast" className="flex items-center gap-2">
              <TrendingUp size={16} />
              <span className="hidden sm:inline">Forecast</span>
            </TabsTrigger>
            <TabsTrigger value="optimization" className="flex items-center gap-2">
              <Zap size={16} />
              <span className="hidden sm:inline">Optimize</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Settings size={16} />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ForecastChart />
              </div>
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-semibold text-foreground mb-4">System Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Models Training</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 text-xs rounded font-medium">Active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Data Collection</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 text-xs rounded font-medium">Online</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">API Status</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200 text-xs rounded font-medium">Operational</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Grid Stability</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 text-xs rounded font-medium">Caution</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800/30 rounded-lg p-6">
                  <h3 className="font-semibold text-foreground mb-2">Quick Insights</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Peak demand expected at 6 PM today</li>
                    <li>• Weather impact: +3% consumption forecast</li>
                    <li>• Renewable energy: 35% capacity available</li>
                    <li>• System efficiency: 89.2%</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Forecast Tab */}
          <TabsContent value="forecast">
            <ForecastChart />
          </TabsContent>

          {/* Optimization Tab */}
          <TabsContent value="optimization">
            <OptimizationPanel />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Technology Stack</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• ARIMA Time Series Forecasting</li>
                <li>• LSTM Neural Networks</li>
                <li>• Prophet Seasonal Models</li>
                <li>• Linear Programming Optimization</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Capabilities</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 14-day Energy Forecasting</li>
                <li>• Peak Demand Prediction</li>
                <li>• Sector-wise Optimization</li>
                <li>• Renewable Integration</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Key Metrics</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Forecast Accuracy: 92%+</li>
                <li>• 15% Energy Savings Potential</li>
                <li>• Real-time Data Processing</li>
                <li>• Multi-model Ensemble</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Energy Consumption Forecasting & Optimization Dashboard
            </p>
            <p className="text-sm text-muted-foreground mt-4 md:mt-0">
              © 2026 KMIT CSE Department. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
