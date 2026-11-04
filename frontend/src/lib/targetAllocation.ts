export const TARGET_ALLOCATION_KEY = "ph_target_allocation";

export interface StoredTarget {
  targetAktierPct: number;
  targetStabiltPct: number;
}

export function readStoredTarget(): StoredTarget | null {
  try {
    const raw = localStorage.getItem(TARGET_ALLOCATION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<StoredTarget>;

    if (
      typeof parsed.targetAktierPct === "number" &&
      typeof parsed.targetStabiltPct === "number"
    ) {
      return {
        targetAktierPct: parsed.targetAktierPct,
        targetStabiltPct: parsed.targetStabiltPct,
      };
    }
  } catch {
    // ignore broken JSON
  }

  return null;
}

export function saveStoredTarget(target: StoredTarget): void {
  localStorage.setItem(TARGET_ALLOCATION_KEY, JSON.stringify(target));
}
