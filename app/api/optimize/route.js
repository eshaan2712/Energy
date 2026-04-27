// import { generateOptimizationRecommendations } from '@/lib/optimization';

// export async function POST(req) {
// try {
// const { data } = await req.json();

 
// if (!data || data.length === 0) {
//   return Response.json({ error: 'No data provided' }, { status: 400 });
// }

// const sectorData = {
//   residential: { consumption: 0 },
//   commercial: { consumption: 0 },
//   industrial: { consumption: 0 }
// };

// data.forEach(row => {
//   const value = Number(row.value || 0);
//   const sector = row.sector?.toLowerCase() || 'residential';

//   if (sectorData[sector]) {
//     sectorData[sector].consumption += value;
//   }
// });

// const optimization = generateOptimizationRecommendations(sectorData);

// const totalCurrentConsumption = Object.values(sectorData)
//   .reduce((sum, d) => sum + d.consumption, 0);

// const totalOptimizedConsumption = Object.values(
//   optimization.demandOptimization.recommendations
// ).reduce((sum, rec) => sum + rec.recommended, 0);

// return Response.json({
//   summary: {
//     totalCurrentConsumption,
//     totalOptimizedConsumption,
//     totalSavingsPotential: optimization.demandOptimization.totalSavings,
//     savingsPercentage:
//       totalCurrentConsumption > 0
//         ? optimization.demandOptimization.totalSavingsPercentage
//         : 0
//   }
// });
 

// } catch (err) {
// return Response.json({ error: err.message }, { status: 500 });
// }
// }
import { generateOptimizationRecommendations } from '@/lib/optimization';

export async function POST(req) {
  try {
    console.log("✅ Optimize API called");

    const { data } = await req.json();

    // ✅ Fallback data (for homepage when no dataset is loaded)
    let inputData = data;

    if (!inputData || inputData.length === 0) {
      console.log("⚠️ No data received, using sample data");

      inputData = [
        { value: 120, sector: "residential" },
        { value: 200, sector: "commercial" },
        { value: 300, sector: "industrial" }
      ];
    }

    // ✅ Initialize sector data
    const sectorData = {
      residential: { consumption: 0 },
      commercial: { consumption: 0 },
      industrial: { consumption: 0 }
    };

    // ✅ Aggregate data
    inputData.forEach(row => {
      const value = Number(row.value || 0);
      const sector = row.sector?.toLowerCase() || 'residential';

      if (sectorData[sector]) {
        sectorData[sector].consumption += value;
      }
    });

    // ✅ Run optimization logic
    const optimization = generateOptimizationRecommendations(sectorData);

    // ✅ Safety check
    if (!optimization || !optimization.demandOptimization) {
      console.error("❌ Optimization failed internally");

      return Response.json({
        error: "Optimization failed internally"
      }, { status: 500 });
    }

    // ✅ Calculate totals
    const totalCurrentConsumption = Object.values(sectorData)
      .reduce((sum, d) => sum + d.consumption, 0);

    const totalOptimizedConsumption = Object.values(
      optimization.demandOptimization.recommendations
    ).reduce((sum, rec) => sum + rec.recommended, 0);

    // ✅ Final response
    return Response.json({
      success: true,
      summary: {
        totalCurrentConsumption,
        totalOptimizedConsumption,
        totalSavingsPotential: optimization.demandOptimization.totalSavings,
        savingsPercentage:
          totalCurrentConsumption > 0
            ? optimization.demandOptimization.totalSavingsPercentage
            : 0
      },
      recommendations: optimization.demandOptimization.recommendations
    });

  } catch (err) {
    console.error("❌ API ERROR:", err);

    return Response.json({
      success: false,
      error: err.message || "Something went wrong"
    }, { status: 500 });
  }
}