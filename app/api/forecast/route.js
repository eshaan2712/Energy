import { generateForecast } from '@/lib/forecasting';

// Mock historical data generator
function generateHistoricalData(sector, days = 30) {
  const data = [];
  let baseConsumption = {
    residential: 4000,
    commercial: 3200,
    industrial: 5800
  }[sector] || 4000;

  for (let i = days; i > 0; i--) {
    const trend = Math.sin(i / 7) * 300; // Weekly pattern
    const noise = (Math.random() - 0.5) * 400;
    const seasonal = Math.sin(i / 30) * 200; // Monthly pattern
    data.push(Math.max(1000, baseConsumption + trend + noise + seasonal));
  }

  return data;
}

export async function POST(request) {
  try {
    const { sector = 'residential', model = 'lstm', steps = 7 } = await request.json();

    // Generate historical data
    const historicalData = generateHistoricalData(sector, 30);

    // Generate forecast
    const forecast = generateForecast(historicalData, model, steps);

    // Format response
    const response = {
      sector,
      model,
      timestamp: new Date().toISOString(),
      historical: historicalData.slice(-14), // Last 14 days for display
      forecast: Array.isArray(forecast) ? forecast : forecast,
      metrics: {
        mae: Math.random() * 300 + 150,
        rmse: Math.random() * 400 + 200,
        mape: Math.random() * 10 + 3,
        r2Score: 0.85 + Math.random() * 0.1
      }
    };

    return Response.json(response);
  } catch (error) {
    console.error('Forecast error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sector = searchParams.get('sector') || 'residential';
  const model = searchParams.get('model') || 'lstm';
  const steps = parseInt(searchParams.get('steps') || '7');

  try {
    // Generate historical data
    const historicalData = generateHistoricalData(sector, 30);

    // Generate forecast
    const forecast = generateForecast(historicalData, model, steps);

    // Format response
    const response = {
      sector,
      model,
      timestamp: new Date().toISOString(),
      historical: historicalData.slice(-14), // Last 14 days for display
      forecast: Array.isArray(forecast) ? forecast : forecast,
      metrics: {
        mae: Math.random() * 300 + 150,
        rmse: Math.random() * 400 + 200,
        mape: Math.random() * 10 + 3,
        r2Score: 0.85 + Math.random() * 0.1
      }
    };

    return Response.json(response);
  } catch (error) {
    console.error('Forecast error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
