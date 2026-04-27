import numpy as np


def optimize_energy(forecast):
    try:
        forecast = np.array(forecast)

        peak = np.max(forecast)
        avg = np.mean(forecast)

        excess = peak - avg

        # Optimization strategies
        shift_units = excess * 0.6
        reduction_units = peak * 0.1

        total_saved = shift_units + reduction_units

        cost_per_unit = 8  # ₹

        monthly_savings = total_saved * cost_per_unit
        annual_savings = monthly_savings * 12
        reduction_percent = (total_saved / peak) * 100 if peak != 0 else 0

        return {
            "status": "success",
            "peak": float(peak),
            "average": float(avg),
            "strategies": [
                {
                    "name": "Peak Load Shifting",
                    "units": float(round(shift_units, 2)),
                    "savings": float(round(shift_units * cost_per_unit, 2))
                },
                {
                    "name": "Peak Demand Reduction",
                    "units": float(round(reduction_units, 2)),
                    "savings": float(round(reduction_units * cost_per_unit, 2))
                }
            ],
            "monthly_savings": float(round(monthly_savings, 2)),
            "annual_savings": float(round(annual_savings, 2)),
            "reduction_percent": float(round(reduction_percent, 2))
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }