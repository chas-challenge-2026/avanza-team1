import type { Allocation } from "../types/portfolio";

export interface Drift {
  driftPct: number;
  overThreshold: boolean;
  message: string;
}

export function computeDrift(allocation: Allocation): Drift {
  const driftPct = Math.abs(
    allocation.actualAktierPct - allocation.targetAktierPct,
  );

  const overThreshold = driftPct > allocation.thresholdPct;

  const message = `Portföljen har glidit från målet — aktier ${allocation.actualAktierPct}% mot mål ${allocation.targetAktierPct}% (gräns ${allocation.thresholdPct}%).`;

  return { driftPct, overThreshold, message };
}
