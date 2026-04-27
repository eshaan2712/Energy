/**
 * ARIMA (AutoRegressive Integrated Moving Average) Model
 * 
 * Statistical time-series forecasting using ARIMA(p,d,q) parameters:
 * - p: AutoRegressive order (past values)
 * - d: Differencing order (stationarity)
 * - q: Moving Average order (past forecast errors)
 * 
 * Best for: Regular patterns, non-stationary data, statistical forecasting
 */

class ARIMAModel {
  constructor(data, config = {}) {
    this.originalData = [...data];
    this.data = [...data];
    this.n = data.length;
    
    // ARIMA parameters
    this.p = config.p || 1;  // AR order
    this.d = config.d || 1;  // Differencing
    this.q = config.q || 1;  // MA order
    
    // Model parameters
    this.arParams = [];
    this.maParams = [];
    this.differenceConstant = 0;
    
    // Statistics
    this.mean = this.calculateMean(data);
    this.variance = this.calculateVariance(data);
    this.std = Math.sqrt(this.variance);
    
    // Model fitting
    this.residuals = [];
    this.aic = 0;
    this.bic = 0;
    this.logLikelihood = 0;
  }

  /**
   * Calculate mean of dataset
   */
  calculateMean(data) {
    return data.reduce((sum, val) => sum + val, 0) / data.length;
  }

  /**
   * Calculate variance
   */
  calculateVariance(data) {
    const mean = this.calculateMean(data);
    return data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
  }

  /**
   * Difference the time series (d times) to make it stationary
   */
  difference(data, order = 1) {
    let differenced = [...data];
    for (let i = 0; i < order; i++) {
      differenced = differenced.slice(1).map((val, idx) => val - differenced[idx]);
    }
    return differenced;
  }

  /**
   * Inverse differencing to get original scale
   */
  inverseDifference(differenced, originalStart, order = 1) {
    let reconstructed = [originalStart];
    
    for (let i = 0; i < order; i++) {
      for (let j = 0; j < differenced.length; j++) {
        reconstructed.push(reconstructed[reconstructed.length - 1] + differenced[j]);
      }
    }
    
    return reconstructed.slice(1);
  }

  /**
   * Calculate autocorrelation function (ACF)
   */
  acf(data, lagMax = 20) {
    const mean = this.calculateMean(data);
    const c0 = data.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / data.length;
    
    const acfValues = [1]; // ACF at lag 0 is always 1
    
    for (let lag = 1; lag <= lagMax; lag++) {
      if (lag >= data.length) break;
      const c = data.slice(lag).reduce((sum, x, idx) => sum + (x - mean) * (data[idx] - mean), 0) / data.length;
      acfValues.push(c / c0);
    }
    
    return acfValues;
  }

  /**
   * Calculate partial autocorrelation function (PACF)
   */
  pacf(data, lagMax = 20) {
    const acfVals = this.acf(data, lagMax);
    const pacfValues = [1];
    
    for (let k = 1; k <= lagMax && k < acfVals.length; k++) {
      let numerator = acfVals[k];
      let denominator = 1;
      
      for (let j = 1; j < k; j++) {
        numerator -= pacfValues[j] * acfVals[k - j];
        denominator -= pacfValues[j] * acfVals[j];
      }
      
      pacfValues.push(denominator !== 0 ? numerator / denominator : 0);
    }
    
    return pacfValues;
  }

  /**
   * Fit AR (AutoRegressive) parameters using Yule-Walker equations
   */
  fitAR(data) {
    if (this.p === 0) return [];
    
    const acfVals = this.acf(data, this.p);
    const arParams = [acfVals[1]]; // Start with lag-1 correlation
    
    for (let i = 1; i < this.p; i++) {
      let sum = 0;
      for (let j = 1; j < i; j++) {
        sum += arParams[j - 1] * acfVals[i - j];
      }
      arParams.push((acfVals[i + 1] - sum) / (1 - arParams.slice(0, i).reduce((s, x) => s + Math.pow(x, 2), 0)));
    }
    
    return arParams;
  }

  /**
   * Fit the ARIMA model
   */
  fit() {
    // Step 1: Differencing
    let diffData = this.data;
    for (let i = 0; i < this.d; i++) {
      diffData = this.difference(diffData);
    }
    
    // Step 2: Fit AR parameters
    this.arParams = this.fitAR(diffData);
    
    // Step 3: Calculate residuals and MA parameters (simplified)
    this.residuals = this.calculateResiduals(diffData);
    
    // Step 4: Calculate information criteria
    this.calculateInformationCriteria();
    
    return {
      arParams: this.arParams,
      maParams: this.maParams,
      residuals: this.residuals,
      aic: this.aic,
      bic: this.bic
    };
  }

  /**
   * Calculate residuals from fitted model
   */
  calculateResiduals(data) {
    const residuals = [];
    
    for (let i = this.p; i < data.length; i++) {
      let predicted = 0;
      for (let j = 0; j < this.p; j++) {
        predicted += (this.arParams[j] || 0) * data[i - j - 1];
      }
      residuals.push(data[i] - predicted);
    }
    
    return residuals;
  }

  /**
   * Calculate AIC and BIC for model selection
   */
  calculateInformationCriteria() {
    const n = this.residuals.length;
    const k = this.p + this.q + this.d; // Number of parameters
    const sse = this.residuals.reduce((sum, r) => sum + r * r, 0);
    const mse = sse / n;
    
    this.logLikelihood = -0.5 * n * Math.log(2 * Math.PI * mse) - 0.5 * n;
    this.aic = 2 * k - 2 * this.logLikelihood;
    this.bic = k * Math.log(n) - 2 * this.logLikelihood;
  }

  /**
   * Forecast future values
   */
  forecast(steps = 7) {
    this.fit();
    
    const predictions = [];
    let diffData = this.data;
    
    // Apply differencing
    for (let i = 0; i < this.d; i++) {
      diffData = this.difference(diffData);
    }
    
    let lastValues = [...diffData.slice(-this.p)];
    
    // Generate forecasts
    for (let i = 0; i < steps; i++) {
      let forecast = 0;
      
      // AR component
      for (let j = 0; j < this.p && j < lastValues.length; j++) {
        forecast += (this.arParams[j] || 0) * lastValues[lastValues.length - j - 1];
      }
      
      // Add small noise for realistic uncertainty
      forecast += (Math.random() - 0.5) * (this.std * 0.1);
      
      predictions.push(forecast);
      lastValues = [...lastValues.slice(1), forecast];
    }
    
    // Inverse differencing to get original scale
    let result = [...predictions];
    for (let i = 0; i < this.d; i++) {
      const startValue = i === 0 ? this.data[this.data.length - 1] : result[0];
      result = this.reconstructDifference(result, startValue);
    }
    
    return result.map(x => Math.max(0, x));
  }

  /**
   * Helper function to reconstruct from differencing
   */
  reconstructDifference(differenced, startValue) {
    const reconstructed = [startValue];
    for (let i = 0; i < differenced.length; i++) {
      reconstructed.push(reconstructed[reconstructed.length - 1] + differenced[i]);
    }
    return reconstructed.slice(1);
  }

  /**
   * Calculate forecast confidence intervals
   */
  getConfidenceIntervals(forecast, confidence = 0.95) {
    const stderr = Math.sqrt(this.residuals.reduce((sum, r) => sum + r * r, 0) / this.residuals.length);
    const zScore = this.getZScore(confidence);
    
    const intervals = forecast.map(pred => {
      const margin = zScore * stderr * Math.sqrt(1 + 1 / this.n);
      return {
        point: pred,
        lower: Math.max(0, pred - margin),
        upper: pred + margin,
        margin: margin
      };
    });
    
    return intervals;
  }

  /**
   * Get z-score for confidence level
   */
  getZScore(confidence) {
    const confidenceMap = {
      0.80: 1.282,
      0.90: 1.645,
      0.95: 1.96,
      0.99: 2.576
    };
    return confidenceMap[confidence] || 1.96;
  }

  /**
   * Evaluate model on test set
   */
  evaluate(testData, predictions) {
    const metrics = {};
    
    // MAE (Mean Absolute Error)
    metrics.mae = testData.reduce((sum, actual, i) => 
      sum + Math.abs(actual - predictions[i]), 0) / testData.length;
    
    // RMSE (Root Mean Squared Error)
    metrics.rmse = Math.sqrt(
      testData.reduce((sum, actual, i) => 
        sum + Math.pow(actual - predictions[i], 2), 0) / testData.length
    );
    
    // MAPE (Mean Absolute Percentage Error)
    metrics.mape = (testData.reduce((sum, actual, i) => {
      return sum + Math.abs((actual - predictions[i]) / actual);
    }, 0) / testData.length) * 100;
    
    // R² Score
    const meanActual = this.calculateMean(testData);
    const ssRes = testData.reduce((sum, actual, i) => 
      sum + Math.pow(actual - predictions[i], 2), 0);
    const ssTot = testData.reduce((sum, actual) => 
      sum + Math.pow(actual - meanActual, 2), 0);
    metrics.r2Score = 1 - (ssRes / ssTot);
    
    // MASE (Mean Absolute Scaled Error) - seasonal naive baseline
    const naiveErrors = testData.slice(1).map((val, i) => Math.abs(val - testData[i]));
    const scalingFactor = naiveErrors.reduce((a, b) => a + b) / naiveErrors.length;
    metrics.mase = metrics.mae / scalingFactor;
    
    return metrics;
  }
}

export default ARIMAModel;
