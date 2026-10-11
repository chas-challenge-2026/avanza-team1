import type { PortfolioApi } from "../portfolioApi";
import type { StoredTarget } from "../../lib/targetAllocation";
import { mockPortfolio } from "../../types/portfolio";
import { saveStoredTarget } from "../../lib/targetAllocation";
import type { HistoryRange, HistorySeries } from "../../types/history";

const rangeDays: Record<HistoryRange, number> = {
  "1M": 30,
  "6M": 180,
  "1Y": 365,
  ALL: 1825,
};

function seedFor(key: string): number {
  let seed = 2166136261;
  for (let index = 0; index < key.length; index += 1) {
    seed = Math.imul(seed ^ key.charCodeAt(index), 16777619);
  }
  return seed >>> 0;
}

function randomGenerator(seed: number): () => number {
  let state = seed;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function getCurrentValue(key: string): number {
  if (key === "TOTAL") return mockPortfolio.totalValueSek;
  return mockPortfolio.holdings.find((holding) => holding.ticker === key)?.valueSek ?? 0;
}

function createHistory({ key, range }: { key: string; range: HistoryRange }): HistorySeries {
  const days = rangeDays[range];
  const endDate = new Date();
  endDate.setUTCHours(0, 0, 0, 0);
  const startValue = getCurrentValue(key);
  const random = randomGenerator(seedFor(key));
  const values = [startValue];

  for (let index = 1; index < days; index += 1) {
    const change = (random() - 0.48) * 0.018;
    values.push(Math.max(0, values[index - 1] * (1 + change)));
  }

  const finalValue = values[values.length - 1];
  const scale = finalValue === 0 ? 0 : startValue / finalValue;
  const points = values.map((value, index) => {
    const date = new Date(endDate);
    date.setUTCDate(date.getUTCDate() - (days - index - 1));
    return {
      date: date.toISOString().slice(0, 10),
      value: Math.round(value * scale),
    };
  });

  return {
    key,
    label: key === "TOTAL" ? "Totalt" : key,
    points,
  };
}

export const mockPortfolioApi: PortfolioApi = {
  async getPortfolio() {
    return mockPortfolio;
  },

  async getHistory(params, signal) {
    if (signal?.aborted) throw new DOMException("Request aborted", "AbortError");
    return createHistory(params);
  },

  async saveAllocation(target: StoredTarget) {
    return saveStoredTarget(target);
  },
};
