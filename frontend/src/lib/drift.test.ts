import { describe, it, expect } from 'vitest'
import { computeDrift } from './drift'

describe('computeDrift', () => {
  it('is not over threshold when drift is small', () => {
    const result = computeDrift({
      actualAktierPct: 62,
      actualStabiltPct: 38,
      targetAktierPct: 60,
      targetStabiltPct: 40,
      thresholdPct: 5,
      overThreshold: false, // ignoreras av funktionen, den räknar själv
    })

    expect(result.overThreshold).toBe(false)
  })

  it('is over threshold when drift is large', () => {
    const result = computeDrift({
      actualAktierPct: 66,
      actualStabiltPct: 34,
      targetAktierPct: 60,
      targetStabiltPct: 40,
      thresholdPct: 5,
      overThreshold: true, // ignoreras av funktionen, den räknar själv
    })

    expect(result.overThreshold).toBe(true)
  })

  it('is not over threshold when drift equals the threshold', () => {
    const result = computeDrift({
      actualAktierPct: 65,
      actualStabiltPct: 35,
      targetAktierPct: 60,
      targetStabiltPct: 40,
      thresholdPct: 5,
      overThreshold: false, // ignoreras av funktionen, den räknar själv
    })

    expect(result.overThreshold).toBe(false)
  })
})
