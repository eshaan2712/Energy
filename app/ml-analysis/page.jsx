'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DatasetUpload from '@/components/DatasetUpload';
import ModelResults from '@/components/ModelResults';
import EnergyOptimization from '@/components/EnergyOptimization';
import LSTMPrediction from '@/components/LSTMPrediction';
import ARIMAPrediction from '@/components/ARIMAPrediction';
import ProphetPrediction from '@/components/ProphetPrediction';
import { Database, Brain, TrendingUp, BarChart3, ArrowLeft, Zap } from 'lucide-react';
import { useDataset } from '@/contexts/DatasetContext';

export default function MLAnalysis() {
  const [activeTab, setActiveTab] = useState('upload');
  const { dataset, isDataLoaded } = useDataset();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-secondary transition-colors">
                <ArrowLeft size={20} className="text-muted-foreground hover:text-foreground" />
              </Link>
              <div className="bg-primary p-2 rounded-lg">
                <BarChart3 className="text-primary-foreground" size={24} />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-foreground truncate">ML Analysis Studio</h1>
              </div>
            </div>
            {isDataLoaded && (
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  ✓ Dataset Loaded: {dataset?.fileName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {dataset?.stats?.count} records
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-lg p-4">
            <div className="flex gap-3">
              <Brain className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={20} />
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-300">LSTM Neural Networks</p>
                <p className="text-sm text-blue-800 dark:text-blue-400 mt-1">
                  Deep learning model that captures complex temporal dependencies in energy consumption data
                </p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 rounded-lg p-4">
            <div className="flex gap-3">
              <TrendingUp className="text-green-600 dark:text-green-400 flex-shrink-0" size={20} />
              <div>
                <p className="font-semibold text-green-900 dark:text-green-300">ARIMA Forecasting</p>
                <p className="text-sm text-green-800 dark:text-green-400 mt-1">
                  Statistical time-series model with confidence intervals for reliable forecasts
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 lg:w-fit overflow-x-auto">
            <TabsTrigger value="upload" className="flex items-center gap-2 text-xs sm:text-sm">
              <Database size={16} />
              <span className="hidden sm:inline">Upload</span>
            </TabsTrigger>
            <TabsTrigger value="optimize" className="flex items-center gap-2 text-xs sm:text-sm">
              <Zap size={16} />
              <span className="hidden sm:inline">Optimize</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2 text-xs sm:text-sm">
              <BarChart3 size={16} />
              <span className="hidden sm:inline">Results</span>
            </TabsTrigger>
            <TabsTrigger value="prophet" className="flex items-center gap-2 text-xs sm:text-sm">
              <TrendingUp size={16} />
              <span className="hidden sm:inline">Prophet</span>
            </TabsTrigger>
            <TabsTrigger value="lstm" className="flex items-center gap-2 text-xs sm:text-sm">
              <Brain size={16} />
              <span className="hidden sm:inline">LSTM</span>
            </TabsTrigger>
            <TabsTrigger value="arima" className="flex items-center gap-2 text-xs sm:text-sm">
              <TrendingUp size={16} />
              <span className="hidden sm:inline">ARIMA</span>
            </TabsTrigger>
          </TabsList>

          {/* Optimization Tab */}
          <TabsContent value="optimize" className="space-y-6">
            <EnergyOptimization />
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            <ModelResults />
          </TabsContent>

          {/* Prophet Tab */}
          <TabsContent value="prophet" className="space-y-6">
            <ProphetPrediction />
          </TabsContent>

          {/* LSTM Tab */}
          <TabsContent value="lstm" className="space-y-6">
            <LSTMPrediction />
          </TabsContent>

          {/* ARIMA Tab */}
          <TabsContent value="arima" className="space-y-6">
            <ARIMAPrediction />
          </TabsContent>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DatasetUpload />
              </div>
              <div className="space-y-4">
                {/* Instructions */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-semibold text-foreground mb-4">Getting Started</h3>
                  <ol className="text-sm text-muted-foreground space-y-3 list-decimal list-inside">
                    <li>
                      <span className="font-medium">Prepare CSV</span>
                      <p className="text-xs ml-5 mt-1">Include date, consumption, and optional columns</p>
                    </li>
                    <li>
                      <span className="font-medium">Upload File</span>
                      <p className="text-xs ml-5 mt-1">Drag and drop or click to select</p>
                    </li>
                    <li>
                      <span className="font-medium">Run Models</span>
                      <p className="text-xs ml-5 mt-1">Switch to LSTM or ARIMA tabs</p>
                    </li>
                    <li>
                      <span className="font-medium">Analyze Results</span>
                      <p className="text-xs ml-5 mt-1">Compare predictions and metrics</p>
                    </li>
                  </ol>
                </div>

                {/* Sample Data */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-semibold text-foreground mb-3">Sample CSV Format</h3>
                  <div className="bg-background rounded p-3 text-xs font-mono text-muted-foreground overflow-x-auto">
                    <pre>{`date,consumption,temp
2024-01-01,450.5,15
2024-01-02,480.2,16
2024-01-03,520.1,14
...`}</pre>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-3">LSTM Benefits</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Captures temporal patterns</li>
                <li>• Handles non-linearity</li>
                <li>• Long-term dependencies</li>
                <li>• Superior accuracy on complex data</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">ARIMA Benefits</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Statistical foundation</li>
                <li>• Confidence intervals</li>
                <li>• Interpretable parameters</li>
                <li>• Stable on stationary data</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">When to Use Each</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• LSTM: Complex, non-linear patterns</li>
                <li>• ARIMA: Stationary, trending data</li>
                <li>• Ensemble: Best of both worlds</li>
                <li>• Always validate on test data</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              ML Analysis Studio • Advanced Time Series Forecasting
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              © 2026 Energy Analytics. For research and educational purposes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
