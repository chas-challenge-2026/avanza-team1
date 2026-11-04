import type { Allocation, DriftStatus } from "../types/portfolio";

export function getDriftStatus(allocation: Allocation): DriftStatus {
  const aktierDrift = allocation.actualAktierPct - allocation.targetAktierPct;
  const stabiltDrift = allocation.actualStabiltPct - allocation.targetStabiltPct;

  if (
    Math.abs(aktierDrift) <= allocation.thresholdPct &&
    Math.abs(stabiltDrift) <= allocation.thresholdPct
  ) {
    return "withinThreshold";
  }

  // Choose the larger positive deviation if inconsistent or rounded values
  // put both asset classes above their targets.
  return aktierDrift >= stabiltDrift ? "aktierAbove" : "stabiltAbove";
}

export interface Drift {
  driftPct: number;
  overThreshold: boolean;
  message: string;
}

export function computeDrift(allocation: Allocation): Drift {
  const aktierDrift = allocation.actualAktierPct - allocation.targetAktierPct;
  const stabiltDrift = allocation.actualStabiltPct - allocation.targetStabiltPct;
  const driftPct = Math.max(Math.abs(aktierDrift), Math.abs(stabiltDrift));
  const overThreshold = getDriftStatus(allocation) !== "withinThreshold";

  const message = getDriftStatus(allocation) === "aktierAbove"
    ? `Portföljen har glidit från målet — Aktieandelen är ${allocation.actualAktierPct}% mot målet ${allocation.targetAktierPct}% (gräns ${allocation.thresholdPct}%).`
    : `Portföljen har glidit från målet — Den stabila andelen är ${allocation.actualStabiltPct}% mot målet ${allocation.targetStabiltPct}% (gräns ${allocation.thresholdPct}%).`;

  return { driftPct, overThreshold, message };
}
