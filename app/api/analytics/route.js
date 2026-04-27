export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const timeRange = searchParams.get('range') || '30d';
  const sector = searchParams.get('sector');

  // Generate mock analytics data
  const generateAnalytics = () => {
    const sectors = ['residential', 'commercial', 'industrial'];
    const analytics = {};

    sectors.forEach(s => {
      const baseValue = { residential: 4000, commercial: 3200, industrial: 5800 }[s];
      const data = [];

      for (let i = 0; i < 30; i++) {
        data.push({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          actual: baseValue + (Math.random() - 0.5) * 800,
          forecast: baseValue + (Math.random() - 0.5) * 600,
          optimized: baseValue * 0.9 + (Math.random() - 0.5) * 400
        });
      }

      analytics[s] = {
        sector: s,
        averageConsumption: baseValue,
        peakConsumption: baseValue * 1.3,
        minConsumption: baseValue * 0.6,
        trend: Math.random() > 0.5 ? 'increasing' : 'decreasing',
        trendPercentage: (Math.random() - 0.5) * 10,
        data: data.reverse(),
        accuracy: {
          arima: 85 + Math.random() * 10,
          lstm: 88 + Math.random() * 10,
          prophet: 86 + Math.random() * 10
        },
        efficiency: 82 + Math.random() * 15,
        savings: baseValue * 0.15 + Math.random() * 200
      };
    });

    return analytics;
  };

  try {
    const analytics = generateAnalytics();

    if (sector && analytics[sector]) {
      return Response.json({
        sector,
        timeRange,
        ...analytics[sector]
      });
    }

    return Response.json({
      timeRange,
      sectors: analytics,
      summary: {
        totalConsumption: Object.values(analytics).reduce((sum, s) => sum + s.averageConsumption, 0),
        averageAccuracy: Object.values(analytics).reduce((sum, s) => {
          const avg = (s.accuracy.arima + s.accuracy.lstm + s.accuracy.prophet) / 3;
          return sum + avg;
        }, 0) / Object.keys(analytics).length,
        totalSavingsPotential: Object.values(analytics).reduce((sum, s) => sum + s.savings, 0)
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { sector, startDate, endDate } = body;

    // Generate data for requested period
    const startTime = new Date(startDate).getTime();
    const endTime = new Date(endDate).getTime();
    const daysDiff = Math.floor((endTime - startTime) / (24 * 60 * 60 * 1000));

    const baseValue = { residential: 4000, commercial: 3200, industrial: 5800 }[sector] || 4000;
    const data = [];

    for (let i = 0; i <= daysDiff; i++) {
      const date = new Date(startTime + i * 24 * 60 * 60 * 1000);
      data.push({
        date: date.toISOString().split('T')[0],
        actual: baseValue + (Math.random() - 0.5) * 800,
        forecast: baseValue + (Math.random() - 0.5) * 600
      });
    }

    return Response.json({
      sector,
      startDate,
      endDate,
      data,
      statistics: {
        meanConsumption: baseValue,
        stdDeviation: baseValue * 0.15,
        min: baseValue * 0.5,
        max: baseValue * 1.5
      }
    });
  } catch (error) {
    console.error('Analytics POST error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
