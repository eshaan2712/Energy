'use client';

import { useState, useRef } from 'react';
import { Upload, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useDataset } from '@/contexts/DatasetContext';

export default function DatasetUpload({ onDataLoaded }) {
  const { loadDataset } = useDataset();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [dataStats, setDataStats] = useState(null);
  const [modelResults, setModelResults] = useState(null);
  const [runningModels, setRunningModels] = useState(false);
  const fileInputRef = useRef(null);

  const parseCSV = (text) => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row = {};
      headers.forEach((header, idx) => {
        row[header] = isNaN(values[idx]) ? values[idx] : parseFloat(values[idx]);
      });
      data.push(row);
    }

    return { headers, data };
  };

  const runPythonModels = async (csvContent, dataPayload) => {
    try {
      setRunningModels(true);
      console.log('[v0] Running models with CSV data');

      const response = await fetch('/api/models/run-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          csv_data: csvContent
        })
      });

      if (!response.ok) {
        const errorText = await response.text();

        console.error("❌ FULL BACKEND ERROR:", errorText);

        throw new Error(
        `Model API error:\n${errorText}`
        );
      }

      const result = await response.json();
      console.log('[v0] Models completed:', result);
      
      setModelResults(result);

      // Update context with model results
      const updatedPayload = {
        ...dataPayload,
        modelResults: result
      };
      loadDataset(updatedPayload);
    } catch (err) {
      console.error('[v0] Models error:', err);
      setError(`Models error: ${err.message}`);
    } finally {
      setRunningModels(false);
    }
  };

  const handleFileSelect = async (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const text = await selectedFile.text();
      const { headers, data } = parseCSV(text);

      if (data.length === 0) {
        throw new Error('CSV file is empty');
      }

      // Validate required columns (dataset_id, date, value, sector, location)
      const requiredCols = ['dataset_id', 'date', 'value', 'sector', 'location'];
      const missingCols = requiredCols.filter(col => 
        !headers.some(h => h.toLowerCase() === col.toLowerCase())
      );

      if (missingCols.length > 0) {
        throw new Error(`Missing required columns: ${missingCols.join(', ')}\n\nExpected: dataset_id, date, value, sector, location`);
      }

      // Extract energy consumption values (from 'value' column)
      const valueCol = headers.find(h => h.toLowerCase() === 'value');
      const sectorCol = headers.find(h => h.toLowerCase() === 'sector');
      const locationCol = headers.find(h => h.toLowerCase() === 'location');
      const dateCol = headers.find(h => h.toLowerCase() === 'date');

      const consumptionData = data
        .map(row => parseFloat(row[valueCol]))
        .filter(val => !isNaN(val));

      if (consumptionData.length < 2) {
        throw new Error(`Insufficient data. Need at least 2 data points, got ${consumptionData.length}`);
      }

      // Calculate statistics
      const stats = {
        count: consumptionData.length,
        mean: Number((consumptionData.reduce((a, b) => a + b, 0) / consumptionData.length).toFixed(2)),
        min: Number(Math.min(...consumptionData).toFixed(2)),
        max: Number(Math.max(...consumptionData).toFixed(2)),
        std: Number(Math.sqrt(
          consumptionData.reduce((sum, val) => sum + Math.pow(val - (consumptionData.reduce((a, b) => a + b, 0) / consumptionData.length), 2), 0) / consumptionData.length
        ).toFixed(2)),
      };

      // Get unique places and sectors from the required columns
      const places = locationCol ? [...new Set(data.map(row => row[locationCol]))].filter(Boolean) : [];
      const sectors = sectorCol ? [...new Set(data.map(row => row[sectorCol]))].filter(Boolean) : [];

      setFile(selectedFile);
      setDataStats(stats);
      setSuccess(true);

      // Save to global context
      const dataPayload = {
        data: consumptionData,
        headers,
        fullData: data,
        fileName: selectedFile.name,
        csvContent: text,
        places,
        sectors,
        primaryColumn: valueCol,
        stats,
      };
      loadDataset(dataPayload);

      // Automatically run models
      await runPythonModels(text, dataPayload);

      // Call parent handler with parsed data
      if (onDataLoaded) {
        onDataLoaded(dataPayload);
      }
    } catch (err) {
      setError(err.message || 'Error parsing CSV file');
      setFile(null);
      setDataStats(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      fileInputRef.current.files = e.dataTransfer.files;
      handleFileSelect({ target: { files: e.dataTransfer.files } });
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Upload Dataset</h3>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto mb-4 text-muted-foreground" size={32} />
        <p className="text-foreground font-medium mb-2">Drag and drop your CSV file</p>
        <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          Select File
        </button>
      </div>

      {/* File Format Instructions */}
      <div className="mt-6 bg-secondary/20 border border-border rounded-lg p-4">
        <p className="text-sm font-medium text-foreground mb-2">Required CSV Format:</p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Columns: dataset_id, date, value, sector, location</li>
          <li>• Value = energy consumption (numeric)</li>
          <li>• Sector = residential/commercial/industrial</li>
          <li>• Location = city/region name</li>
          <li>• Minimum 2 data points (more data = better accuracy)</li>
          <li>• Example: 1,2024-01-01,430.5,residential,Illinois</li>
        </ul>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg flex gap-3">
          <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0" size={20} />
          <div>
            <p className="text-sm font-medium text-red-800 dark:text-red-400">Upload Error</p>
            <p className="text-xs text-red-700 dark:text-red-300 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Success Message with Statistics */}
      {success && dataStats && (
        <div className="mt-4 space-y-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-lg flex gap-3">
            <CheckCircle className="text-green-600 dark:text-green-400 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-400">Dataset Loaded Successfully</p>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">{file?.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-background border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Records</p>
              <p className="text-lg font-semibold text-foreground">{dataStats.count}</p>
            </div>
            <div className="bg-background border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Mean</p>
              <p className="text-lg font-semibold text-foreground">{dataStats.mean.toFixed(2)}</p>
            </div>
            <div className="bg-background border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Std Dev</p>
              <p className="text-lg font-semibold text-foreground">{dataStats.std.toFixed(2)}</p>
            </div>
            <div className="bg-background border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Min</p>
              <p className="text-lg font-semibold text-foreground">{dataStats.min.toFixed(2)}</p>
            </div>
            <div className="bg-background border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Max</p>
              <p className="text-lg font-semibold text-foreground">{dataStats.max.toFixed(2)}</p>
            </div>
            <div className="bg-background border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Range</p>
              <p className="text-lg font-semibold text-foreground">{(dataStats.max - dataStats.min).toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg flex gap-3">
          <Loader className="text-blue-600 dark:text-blue-400 flex-shrink-0 animate-spin" size={20} />
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-400">Processing CSV file...</p>
          </div>
        </div>
      )}
    </div>
  );
}
