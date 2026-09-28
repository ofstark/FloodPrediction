import type { HistoricalEvent } from "@/types";

// Two entries here are REAL, well-documented disasters — factual event
// descriptions only, no invented statistics (no fabricated rainfall
// totals, discharge figures, or casualty numbers). The rest are clearly
// marked illustrative placeholders, not claims about real recorded events.
export const historicalEvents: HistoricalEvent[] = [
  {
    id: "hist-kedarnath-2013",
    year: "2013",
    date: "June 2013",
    title: "Kedarnath Flash Floods",
    location: "Kedarnath",
    rainfall: "UNKNOWN",
    riverStatus: "UNKNOWN",
    impact:
      "Real, widely documented disaster — intense monsoon rainfall combined with glacial lake dynamics triggered catastrophic flash flooding in the Mandakini valley. One of the most significant flood events in the region's recent history.",
    verified: true,
  },
  {
    id: "hist-chamoli-2021",
    year: "2021",
    date: "February 2021",
    title: "Chamoli Glacial Flood",
    location: "Chamoli",
    rainfall: "UNKNOWN",
    riverStatus: "UNKNOWN",
    impact:
      "Real, widely documented disaster — a glacier/rock-ice avalanche triggered a sudden flash flood down the Rishiganga and Dhauliganga rivers in the Alaknanda system.",
    verified: true,
  },
  {
    id: "hist-illustrative-1",
    year: "2024",
    date: "Illustrative — not a real recorded date",
    title: "Illustrative Reference Point",
    location: "Rudraprayag",
    rainfall: "HIGH",
    riverStatus: "HIGH",
    impact: "Placeholder for demonstration — not an actual recorded event.",
    verified: false,
  },
  {
    id: "hist-illustrative-2",
    year: "2023",
    date: "Illustrative — not a real recorded date",
    title: "Illustrative Reference Point",
    location: "Uttarkashi",
    rainfall: "MODERATE",
    riverStatus: "MODERATE",
    impact: "Placeholder for demonstration — not an actual recorded event.",
    verified: false,
  },
];

// Illustrative only — not sourced from a real rainfall record.
export const rainfallComparison = [
  { year: "2021", rainfall: 240 },
  { year: "2022", rainfall: 210 },
  { year: "2023", rainfall: 180 },
  { year: "2024", rainfall: 260 },
];
