/**
 * Model Evaluation Utilities
 * 
 * Comprehensive metrics and evaluation functions for time-series models
 */

class ModelEvaluator {
  constructor(actual, predicted) {
    this.actual = actual;
    this.predicted = predicted;
    this.n = Math.min(actual.length, predicted.length);
    
    if (this.n === 0) {
      throw new Error('No data to evaluate');
    }
  }

  /**
   * Mean Absolute Error (MAE)
   * Average absolute difference between actual and predicted
   * Units: same as original data
   * Better for: All errors weighted equally
   */
  calculateMAE() {
    let sum = 0;
    for (let i = 0; i < this.n; i++) {
      sum += Math.abs(this.actual[i] - this.predicted[i]);
    }
    return sum / this.n;
  }

  /**
   * Root Mean Squared Error (RMSE)
   * Penalizes larger errors more heavily
   * Units: same as original data
   * Better for: Large errors are important
   */
  calculateRMSE() {
    let sum = 0;
    for (let i = 0; i < this.n; i++) {
      const error = this.actual[i] - this.predicted[i];
      sum += error * error;
    }
    return Math.sqrt(sum / this.n);
  }

  /**
   * Mean Absolute Percentage Error (MAPE)
   * Percentage error, independent of scale
   * Range: 0 to 100+
   * Better for: Scale-independent comparison
   */
  calculateMAPE() {
    let sum = 0;
    for (let i = 0; i < this.n; i++) {
      const actual = Math.abs(this.actual[i]);
      if (actual > 0) {
        sum += Math.abs((this.actual[i] - this.predicted[i]) / actual);
      }
    }
    return (sum / this.n) * 100;
  }

  /**
   * Mean Squared Error (MSE)
   * Average squared differences
   * Range: 0 to ∞
   * Better for: Mathematical properties, optimization
   */
  calculateMSE() {
    let sum = 0;
    for (let i = 0; i < this.n; i++) {
      const error = this.actual[i] - this.predicted[i];
      sum += error * error;
    }
    return sum / this.n;
  }

  /**
   * R² Score (Coefficient of Determination)
   * Proportion of variance explained
   * Range: -∞ to 1 (1 is perfect)
   * Better for: Overall model fit
   */
  calculateR2Score() {
    const meanActual = this.actual.reduce((a, b) => a + b, 0) / this.n;
    
    let ssRes = 0;
    let ssTot = 0;
    
    for (let i = 0; i < this.n; i++) {
      const residual = this.actual[i] - this.predicted[i];
      const diff = this.actual[i] - meanActual;
      ssRes += residual * residual;
      ssTot += diff * diff;
    }
    
    if (ssTot === 0) return 0;
    return 1 - (ssRes / ssTot);
  }

  /**
   * Mean Absolute Scaled Error (MASE)
   * Scaled by naive forecast error
   * Range: 0 to ∞
   * Better for: Comparison with naive baseline
   */
  calculateMASE() {
    const mae = this.calculateMAE();
    
    // Naive forecast baseline (seasonal naive with s=1)
    let naiveErrors = 0;
    let count = 0;
    
    for (let i = 1; i < this.n; i++) {
      naiveErrors += Math.abs(this.actual[i] - this.actual[i - 1]);
      count++;
    }
    
    const baselineError = naiveErrors / count;
    
    if (baselineError === 0) return 0;
    return mae / baselineError;
  }

  /**
   * Theil's U Statistic
   * Compares to naive forecast
   * Range: 0 to ∞ (< 1 means better than naive)
   * Better for: Benchmark comparison
   */
  calculateTheilU() {
    let mseModel = 0;
    let mseNaive = 0;
    let count = 0;
    
    for (let i = 1; i < this.n; i++) {
      const modelError = this.actual[i] - this.predicted[i];
      const naiveError = this.actual[i] - this.actual[i - 1];
      
      mseModel += modelError * modelError;
      mseNaive += naiveError * naiveError;
      count++;
    }
    
    mseModel /= count;
    mseNaive /= count;
    
    if (mseNaive === 0) return 0;
    return Math.sqrt(mseModel) / Math.sqrt(mseNaive);
  }

  /**
   * Directional Accuracy
   * Percentage of correctly predicted direction (up/down)
   * Range: 0 to 100
   * Better for: Trend prediction
   */
  calculateDirectionalAccuracy() {
    let correct = 0;
    let count = 0;
    
    for (let i = 1; i < this.n; i++) {
      const actualDir = this.actual[i] >= this.actual[i - 1] ? 1 : 0;
      const predDir = this.predicted[i] >= this.actual[i - 1] ? 1 : 0;
      
      if (actualDir === predDir) {
        correct++;
      }
      count++;
    }
    
    return (correct / count) * 100;
  }

  /**
   * Akaike Information Criterion (AIC)
   * For model comparison
   * Lower is better
   */
  calculateAIC(numParams) {
    const mse = this.calculateMSE();
    return 2 * numParams + this.n * Math.log(mse);
  }

  /**
   * Bayesian Information Criterion (BIC)
   * For model comparison with penalty for complexity
   * Lower is better
   */
  calculateBIC(numParams) {
    const mse = this.calculateMSE();
    return numParams * Math.log(this.n) + this.n * Math.log(mse);
  }

  /**
   * Residual analysis
   */
  getResiduals() {
    const residuals = [];
    for (let i = 0; i < this.n; i++) {
      residuals.push(this.actual[i] - this.predicted[i]);
    }
    return residuals;
  }

  /**
   * Autocorrelation of residuals (Ljung-Box test statistic)
   */
  calculateLjungBoxStat(lags = 10) {
    const residuals = this.getResiduals();
    const mean = residuals.reduce((a, b) => a + b, 0) / residuals.length;
    const centered = residuals.map(r => r - mean);
    
    const c0 = centered.reduce((sum, x) => sum + x * x, 0) / residuals.length;
    
    let stat = 0;
    for (let k = 1; k <= Math.min(lags, residuals.length - 1); k++) {
      let ck = 0;
      for (let i = k; i < centered.length; i++) {
        ck += centered[i] * centered[i - k];
      }
      ck /= residuals.length;
      
      if (c0 !== 0) {
        const rk = ck / c0;
        stat += (rk * rk) / (residuals.length - k);
      }
    }
    
    stat = residuals.length * (residuals.length + 2) * stat;
    return stat;
  }

  /**
   * Comprehensive evaluation report
   */
  getFullReport(modelName = 'Model', numParams = 0) {
    return {
      model: modelName,
      dataPoints: this.n,
      metrics: {
        mae: {
          value: this.calculateMAE(),
          description: 'Mean Absolute Error (lower is better)',
          interpretation: 'Average absolute prediction error'
        },
        rmse: {
          value: this.calculateRMSE(),
          description: 'Root Mean Squared Error (lower is better)',
          interpretation: 'Penalizes large errors'
        },
        mape: {
          value: this.calculateMAPE(),
          description: 'Mean Absolute Percentage Error (lower is better)',
          interpretation: 'Percentage error, scale-independent'
        },
        r2Score: {
          value: this.calculateR2Score(),
          description: 'R² Score (higher is better)',
          interpretation: 'Proportion of variance explained (0-1 scale)'
        },
        mase: {
          value: this.calculateMASE(),
          description: 'Mean Absolute Scaled Error',
          interpretation: '< 1 means better than naive forecast'
        },
        theilU: {
          value: this.calculateTheilU(),
          description: "Theil's U Statistic",
          interpretation: '< 1 means better than naive forecast'
        },
        directionAccuracy: {
          value: this.calculateDirectionalAccuracy(),
          description: 'Directional Accuracy (%)',
          interpretation: 'Percentage of correctly predicted trends'
        }
      },
      informationCriteria: {
        aic: this.calculateAIC(numParams),
        bic: this.calculateBIC(numParams)
      },
      residualAnalysis: {
        ljungBoxStat: this.calculateLjungBoxStat(10),
        meanResidual: this.getResiduals().reduce((a, b) => a + b, 0) / this.n,
        stdResidual: Math.sqrt(
          this.getResiduals().reduce((sum, r) => sum + r * r, 0) / this.n
        )
      }
    };
  }

  /**
   * Get accuracy score (0-100)
   * Composite metric for quick assessment
   */
  getAccuracyScore() {
    const r2 = Math.max(0, this.calculateR2Score());
    const mape = Math.max(0, 100 - Math.min(this.calculateMAPE(), 100));
    const dirAccuracy = this.calculateDirectionalAccuracy();
    
    // Weighted average
    return (r2 * 100 * 0.4) + (mape * 0.35) + (dirAccuracy * 0.25);
  }
}

/**
 * Cross-validation utility
 */
class CrossValidator {
  /**
   * Time series cross-validation (walk-forward)
   */
  static walkForwardValidation(data, trainSize, testSize, modelTrainer) {
    const results = [];
    
    for (let i = trainSize; i < data.length - testSize; i += testSize) {
      const trainData = data.slice(0, i);
      const testData = data.slice(i, i + testSize);
      
      const model = modelTrainer(trainData);
      const predictions = model.forecast ? model.forecast(testSize) : [];
      
      const evaluator = new ModelEvaluator(testData, predictions);
      results.push({
        fold: Math.floor(i / testSize),
        trainSize: trainData.length,
        testSize: testData.length,
        metrics: {
          mae: evaluator.calculateMAE(),
          rmse: evaluator.calculateRMSE(),
          mape: evaluator.calculateMAPE(),
          r2: evaluator.calculateR2Score()
        }
      });
    }
    
    return results;
  }

  /**
   * K-fold cross-validation for time series
   */
  static kFoldValidation(data, k, modelTrainer) {
    const foldSize = Math.floor(data.length / k);
    const results = [];
    
    for (let i = 0; i < k; i++) {
      const testStart = i * foldSize;
      const testEnd = i === k - 1 ? data.length : (i + 1) * foldSize;
      
      const trainData = [...data.slice(0, testStart), ...data.slice(testEnd)];
      const testData = data.slice(testStart, testEnd);
      
      const model = modelTrainer(trainData);
      const predictions = model.forecast ? model.forecast(testData.length) : [];
      
      const evaluator = new ModelEvaluator(testData, predictions);
      results.push({
        fold: i + 1,
        metrics: {
          mae: evaluator.calculateMAE(),
          rmse: evaluator.calculateRMSE(),
          mape: evaluator.calculateMAPE(),
          r2: evaluator.calculateR2Score()
        }
      });
    }
    
    return results;
  }
}

export { ModelEvaluator, CrossValidator };
