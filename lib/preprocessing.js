export function differencing(data, order = 1) {
  let result = [...data];

  for (let i = 0; i < order; i++) {
    const diffed = [];

    for (let j = 1; j < result.length; j++) {
      diffed.push(result[j] - result[j - 1]);
    }

    result = diffed;
  }

  return result;
}

export function inverseDifferencing(forecast, originalData, order = 1) {
  let result = forecast;

  for (let i = 0; i < order; i++) {
    const base = originalData[originalData.length - 1];
    const recovered = [];

    for (let j = 0; j < result.length; j++) {
      const next = base + result[j]; // ✅ FIXED
      recovered.push(next);
    }

    result = recovered;
  }

  return result;
}

export function calculateConfidenceInterval(data, level = 0.95) {
  const mean = data.reduce((a, b) => a + b, 0) / data.length;

  const std = Math.sqrt(
    data.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / data.length
  );

  const zScore = 1.96;

  const margin = zScore * (std / Math.sqrt(data.length));

  return {
    lower: mean - margin,
    upper: mean + margin
  };
}