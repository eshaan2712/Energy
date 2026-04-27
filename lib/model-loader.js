/**
 * Model Loader - Loads and manages trained model parameters
 * Integrates with the training pipeline output
 */

import fs from 'fs';
import path from 'path';

class ModelLoader {
  constructor() {
    this.trainedModels = null;
    this.loadedAt = null;
  }

  /**
   * Load trained models from JSON file
   * @param {string} filePath - Path to trained_models.json
   * @returns {Object} Loaded models configuration
   */
  loadModels(filePath) {
    try {
      const fullPath = path.resolve(filePath);
      if (!fs.existsSync(fullPath)) {
        console.log('[v0] No trained models found at', fullPath);
        return null;
      }

      const data = fs.readFileSync(fullPath, 'utf-8');
      this.trainedModels = JSON.parse(data);
      this.loadedAt = new Date();
      console.log('[v0] Trained models loaded successfully');
      return this.trainedModels;
    } catch (error) {
      console.error('[v0] Error loading models:', error.message);
      return null;
    }
  }

  /**
   * Get ARIMA configuration
   * @returns {Object} ARIMA order and parameters
   */
  getArimaConfig() {
    if (!this.trainedModels?.arima) {
      return { order: [1, 1, 1], description: 'Default ARIMA(1,1,1)' };
    }
    return this.trainedModels.arima;
  }

  /**
   * Get LSTM configuration
   * @returns {Object} LSTM weights and hyperparameters
   */
  getLstmConfig() {
    if (!this.trainedModels?.lstm) {
      return { lookback: 10, weights: {} };
    }
    return this.trainedModels.lstm;
  }

  /**
   * Get Prophet configuration
   * @returns {Object} Prophet seasonality settings
   */
  getProphetConfig() {
    if (!this.trainedModels?.prophet) {
      return {
        yearly_seasonality: true,
        weekly_seasonality: true,
        daily_seasonality: false,
        seasonality_mode: 'additive'
      };
    }
    return this.trainedModels.prophet.config;
  }

  /**
   * Check if models are trained (vs using defaults)
   * @returns {boolean} True if trained models loaded
   */
  hasTrainedModels() {
    return this.trainedModels !== null;
  }

  /**
   * Get loading timestamp
   * @returns {Date|null} When models were loaded
   */
  getLoadedAt() {
    return this.loadedAt;
  }
}

// Singleton instance
let modelLoaderInstance = null;

export function getModelLoader() {
  if (!modelLoaderInstance) {
    modelLoaderInstance = new ModelLoader();
  }
  return modelLoaderInstance;
}

export default ModelLoader;
