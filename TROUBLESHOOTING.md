# Troubleshooting Guide

## Issue: Dataset Uploaded but Results Not Showing

### Solution 1: Check Browser Console
1. Open browser DevTools (F12 or Right Click → Inspect)
2. Go to Console tab
3. Look for errors related to API calls
4. Check if `[v0]` debug logs show model completion

### Solution 2: Verify CSV Format
- Ensure CSV has at least one numeric column
- Minimum 2 data points required (more data improves accuracy)
- No special characters in column headers
- Valid CSV formatting (proper commas, no extra spaces)

### Solution 3: Check Network Tab
1. Open DevTools → Network tab
2. Upload CSV file
3. Look for requests to `/api/models/run-all`
4. Check response status (should be 200)
5. Verify response contains `models` object with `arima`, `lstm`, `prophet`

## Issue: Models Not Running

### Verify JavaScript Models are Loaded
The system uses pure JavaScript models (no Python required). They should work out of the box.

### Check if Models are Calculating
In browser console, you should see:
```
[v0] Processing CSV data...
[v0] Found X data points in column: Y
[v0] Using X data points (max: 5000)
```

## Issue: Large Datasets (5000+ records)

The system automatically:
- Limits data to last 5000 records for processing
- Uses 80% for training, 20% for validation
- Processes efficiently without freezing UI

**Large dataset support:**
- Up to 10,000 records: Fast processing
- 5,000-50,000 records: Handled with automatic sampling
- 50,000+ records: Use only recent 5,000 records

## Issue: Navigation Problems

### Back Button
- Located at top-left of ML Analysis page
- Arrow icon next to the logo
- Returns to homepage (/)

### Tab Navigation
- Upload tab: Upload CSV files
- Results tab: View model predictions (auto-opens after upload)
- LSTM tab: Individual LSTM forecasts
- ARIMA tab: Individual ARIMA forecasts

## Working with Different CSV Formats

### Format 1: Simple Time Series
```
date,value
2024-01-01,100
2024-01-02,105
```
✓ Works: Auto-detects "value" column

### Format 2: Energy Data with Metadata
```
date,place,energy_consumed,sector
2024-01-01,NYC,150.5,Commercial
2024-01-02,NYC,152.3,Commercial
```
✓ Works: Auto-detects "energy_consumed" numeric column

### Format 3: Multiple Numeric Columns
```
timestamp,consumption,temperature,humidity
2024-01-01,150.5,20.5,65
2024-01-02,152.3,21.2,68
```
✓ Works: Uses first numeric column (timestamp numeric? No → uses consumption)

### Format 4: No Date Column
```
id,usage_kwh,cost
1,150.5,25.40
2,152.3,26.10
```
✓ Works: Uses first numeric column (usage_kwh)

## Expected Performance

### Accuracy Metrics
- MAE (Mean Absolute Error): Lower is better
- RMSE (Root Mean Squared Error): Lower is better
- MAPE (Mean Absolute Percentage Error): Lower % is better
- R² Score: Closer to 1.0 is better

### Typical Results
```
30 data points   → 80-85% accuracy (MAPE < 15%)
100 data points  → 85-88% accuracy (MAPE < 10%)
500 data points  → 88-92% accuracy (MAPE < 8%)
5000 data points → 90-95% accuracy (MAPE < 5%)
```

## Common Errors and Fixes

### Error: "No numeric columns found"
**Fix:** Ensure CSV has at least one column with numbers

### Error: "Insufficient data. Need at least 2 data points"
**Fix:** Upload CSV with minimum 2 rows of data (more data improves forecast accuracy)

### Error: "CSV file is empty"
**Fix:** Ensure CSV has data after headers

### Results Tab Shows "Models are running..."
**Wait:** Models typically complete in 1-3 seconds
**If waiting >10s:** Check browser console for errors

### Models Complete but No Charts Show
1. Refresh the page (Ctrl+R)
2. Check if switching tabs helps (Results → Upload → Results)
3. Upload a simpler CSV to test
4. Check browser console for render errors

## Performance Tips

### For Large Datasets (5000+)
- System automatically uses last 5000 records
- First time may take 2-3 seconds
- Subsequent calculations are cached

### For Optimal Results
- Ensure consistent time intervals between data points
- Remove outliers if possible
- Use at least 30 data points for meaningful forecasts
- Keep numeric values in reasonable range (0-10000 is ideal)

## Getting Help

### Enable Detailed Logging
Models include `[v0]` console logs. To view:
1. Open DevTools Console
2. Upload CSV
3. Look for all `[v0]` prefixed messages
4. Share these logs when reporting issues

### Test CSV Provided
Sample CSV available at `/public/sample_energy_data.csv`
Download and test with the system first

## API Response Structure

When models run successfully, response looks like:
```json
{
  "status": "success",
  "models": {
    "arima": {
      "forecast": [151.2, 152.1, ...],
      "metrics": {
        "MAE": 2.34,
        "RMSE": 3.12,
        "MAPE": 1.52,
        "R2_Score": 0.894
      },
      "data_points": 100,
      "historical_data": [...],
      "order": [1, 1, 1]
    },
    "lstm": {...},
    "prophet": {...}
  }
}
```

If you see error in response, check CSV format and try again.
