import type { TimeseriesPoint } from "@/types";

// Session-generated trend visualization. The backend does not yet persist
// a time-series history of readings (see backend README, "Known
// limitations"), so these charts illustrate the expected shape of each
// signal rather than reflecting logged historical values. Wire this up to
// real history once the backend logs readings over time (e.g. via a
// database) instead of only ever returning the current snapshot.
function genSeries(base: number, variance: number, points = 24): TimeseriesPoint[] {
  const out: TimeseriesPoint[] = [];
  let val = base;
  for (let i = points - 1; i >= 0; i--) {
    val = Math.max(0, val + (Math.random() - 0.42) * variance);
    const hour = new Date();
    hour.setHours(hour.getHours() - i);
    out.push({
      time: `${hour.getHours().toString().padStart(2, "0")}:00`,
      value: Math.round(val * 10) / 10,
    });
  }
  return out;
}

export const rainfallSeries = genSeries(30, 12);
export const riverLevelSeries = genSeries(2.4, 0.35);
export const soilMoistureSeries = genSeries(55, 6);
export const temperatureSeries = genSeries(24, 2);
