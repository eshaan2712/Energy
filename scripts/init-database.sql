-- Energy Consumption Data Table
CREATE TABLE IF NOT EXISTS energy_consumption (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sector VARCHAR(50) NOT NULL,
  consumption FLOAT NOT NULL,
  temperature FLOAT,
  humidity FLOAT,
  day_of_week INT,
  is_holiday BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Forecasting Results Table
CREATE TABLE IF NOT EXISTS forecasts (
  id SERIAL PRIMARY KEY,
  forecast_date TIMESTAMP NOT NULL,
  sector VARCHAR(50) NOT NULL,
  model_type VARCHAR(50) NOT NULL,
  predicted_consumption FLOAT NOT NULL,
  confidence_interval_lower FLOAT,
  confidence_interval_upper FLOAT,
  actual_consumption FLOAT,
  mape FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optimization Recommendations Table
CREATE TABLE IF NOT EXISTS optimization_results (
  id SERIAL PRIMARY KEY,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sector VARCHAR(50) NOT NULL,
  current_consumption FLOAT NOT NULL,
  recommended_consumption FLOAT NOT NULL,
  potential_savings FLOAT NOT NULL,
  savings_percentage FLOAT NOT NULL,
  recommendation_text TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Model Performance Metrics Table
CREATE TABLE IF NOT EXISTS model_metrics (
  id SERIAL PRIMARY KEY,
  model_name VARCHAR(50) NOT NULL,
  sector VARCHAR(50),
  mae FLOAT,
  rmse FLOAT,
  mape FLOAT,
  r2_score FLOAT,
  training_date TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
  id SERIAL PRIMARY KEY,
  user_id UUID,
  sector_of_interest VARCHAR(50),
  alert_threshold FLOAT,
  notification_enabled BOOLEAN DEFAULT TRUE,
  preferred_model VARCHAR(50) DEFAULT 'prophet',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes
CREATE INDEX idx_consumption_timestamp ON energy_consumption(timestamp);
CREATE INDEX idx_consumption_sector ON energy_consumption(sector);
CREATE INDEX idx_forecasts_date ON forecasts(forecast_date);
CREATE INDEX idx_forecasts_sector ON forecasts(sector);
CREATE INDEX idx_forecasts_model ON forecasts(model_type);
CREATE INDEX idx_optimization_date ON optimization_results(date);
CREATE INDEX idx_optimization_sector ON optimization_results(sector);

-- Insert sample data for demo
INSERT INTO energy_consumption (sector, consumption, temperature, humidity, day_of_week, is_holiday)
VALUES 
  ('Residential', 4500, 22, 65, 1, FALSE),
  ('Commercial', 3200, 22, 65, 1, FALSE),
  ('Industrial', 5800, 22, 65, 1, FALSE),
  ('Residential', 4200, 18, 70, 2, FALSE),
  ('Commercial', 3500, 18, 70, 2, FALSE),
  ('Industrial', 6100, 18, 70, 2, FALSE);

INSERT INTO model_metrics (model_name, sector, mae, rmse, mape, r2_score, training_date)
VALUES
  ('ARIMA', 'Residential', 245.5, 312.3, 5.2, 0.92, CURRENT_TIMESTAMP),
  ('LSTM', 'Residential', 198.2, 278.5, 4.1, 0.94, CURRENT_TIMESTAMP),
  ('Prophet', 'Residential', 215.7, 295.2, 4.8, 0.93, CURRENT_TIMESTAMP),
  ('ARIMA', 'Commercial', 180.3, 245.8, 5.5, 0.90, CURRENT_TIMESTAMP),
  ('LSTM', 'Commercial', 165.4, 225.3, 4.3, 0.92, CURRENT_TIMESTAMP),
  ('Prophet', 'Commercial', 172.9, 238.1, 4.9, 0.91, CURRENT_TIMESTAMP);
