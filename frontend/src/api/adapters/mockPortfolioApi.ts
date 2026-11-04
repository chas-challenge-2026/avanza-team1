import type { PortfolioApi } from "../portfolioApi";
import type { StoredTarget } from "../../lib/targetAllocation";
import { mockPortfolio } from "../../types/portfolio";
import { saveStoredTarget } from "../../lib/targetAllocation";
import type { HistoryRange, HistorySeries } from "../../types/history";
import type { Currency } from "../../types/portfolio";

const rangeDays: Record<HistoryRange, number> = {
  "1M": 30,
  "6M": 180,
  "1Y": 365,
  "10Y": 3650,
};

const RAMP_TICKER = "INVE-B";
const RAMP_DAYS = 30;
const RAMP_START_FACTOR = 0.6;

function seedFor(ticker: string): number {
  let seed = 2166136261;
  for (let index = 0; index < ticker.length; index += 1) {
    seed = Math.imul(seed ^ ticker.charCodeAt(index), 16777619);
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

function getCurrentPrice(ticker: string): { value: number; currency: Currency } {
  if (ticker === "TOTAL") {
    return { value: mockPortfolio.totalValueSek, currency: "SEK" };
  }

  const holdings = mockPortfolio.holdings.filter((holding) => holding.ticker === ticker);
  const quantity = holdings.reduce((total, holding) => total + holding.quantity, 0);
  const valueSek = holdings.reduce((total, holding) => total + holding.valueSek, 0);
  const currency = holdings[0]?.currency ?? "SEK";
  const sekPerUnit = currency === "USD"
    ? mockPortfolio.fx.usdSek
    : currency === "EUR"
      ? mockPortfolio.fx.eurSek
      : 1;

  return {
    value: quantity > 0 ? valueSek / quantity / sekPerUnit : 0,
    currency,
  };
}

function createHistory({ ticker, range }: { ticker: string; range: HistoryRange }): HistorySeries {
  const days = rangeDays[range];
  const endDate = new Date();
  endDate.setUTCHours(0, 0, 0, 0);
  const currentPrice = getCurrentPrice(ticker);
  const startValue = currentPrice.value;
  const random = randomGenerator(seedFor(ticker));
  const values = [startValue];

  for (let index = 1; index < days; index += 1) {
    const change = (random() - 0.48) * 0.018;
    values.push(Math.max(0, values[index - 1] * (1 + change)));
  }

  const finalValue = values[values.length - 1];
  const scale = finalValue === 0 ? 0 : startValue / finalValue;
  const normalizedValues = values.map((value) => value * scale);

  if (ticker === RAMP_TICKER) {
    const rampStartIndex = Math.max(0, days - RAMP_DAYS);
    const rampStartValue = startValue * RAMP_START_FACTOR;
    const rampSpan = days - rampStartIndex - 1;
    const rampRandom = randomGenerator(seedFor(`${ticker}-ramp`));

    // Rebase the pre-ramp history so it reaches the lower pivot naturally.
    const pivotScale = normalizedValues[rampStartIndex] === 0
      ? 0
      : rampStartValue / normalizedValues[rampStartIndex];
    for (let index = 0; index <= rampStartIndex; index += 1) {
      normalizedValues[index] *= pivotScale;
    }

    for (let index = rampStartIndex; index < days; index += 1) {
      const progress = rampSpan === 0 ? 1 : (index - rampStartIndex) / rampSpan;
      const trendValue = rampStartValue + (startValue - rampStartValue) * progress;
      // Keep some of the seeded daily movement while pinning both ends of the ramp.
      const variation = (rampRandom() - 0.5) * startValue * 0.02 * Math.sin(Math.PI * progress);
      normalizedValues[index] = trendValue + variation;
    }

    normalizedValues[days - 1] = startValue;
  }

  const points = normalizedValues.map((value, index) => {
    const date = new Date(endDate);
    date.setUTCDate(date.getUTCDate() - (days - index - 1));
    return {
      date: date.toISOString().slice(0, 10),
      value: Math.round(value),
    };
  });

  return {
    ticker,
    range,
    label: ticker,
    currency: currentPrice.currency,
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
