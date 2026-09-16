import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import GoalAllocation from './GoalAllocation'

beforeEach(() => {
  localStorage.clear()
})

describe('GoalAllocation', () => {
  it('saves when the initial sum is valid (100%)', () => {
    const onTargetSaved = vi.fn()
    render(
      <GoalAllocation
        targetAktierPct={60}
        targetStabiltPct={40}
        onTargetSaved={onTargetSaved}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /spara/i }))

    expect(onTargetSaved).toHaveBeenCalledWith(60, 40)
  })

  it('does not save when the initial sum is invalid (not 100%)', () => {
    const onTargetSaved = vi.fn()
    render(
      <GoalAllocation
        targetAktierPct={70}
        targetStabiltPct={50}
        onTargetSaved={onTargetSaved}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /spara/i }))

    expect(onTargetSaved).not.toHaveBeenCalled()
  })
})
