import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import GoalAllocation from './GoalAllocation'

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

const renderWithQueryClient = (component: React.ReactElement) => {
  const testQueryClient = createTestQueryClient()
  return render(
    <QueryClientProvider client={testQueryClient}>
      {component}
    </QueryClientProvider>
  )
}

beforeEach(() => {
  localStorage.clear()
})

describe('GoalAllocation', () => {
  it('saves when the initial sum is valid (100%)', () => {
    const onTargetSaved = vi.fn()
    renderWithQueryClient(
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
    renderWithQueryClient(
      <GoalAllocation
        targetAktierPct={70}
        targetStabiltPct={50}
        onTargetSaved={onTargetSaved}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /spara/i }))

    expect(onTargetSaved).not.toHaveBeenCalled()
  })

  it('shows "Spara mål" and is enabled before saving', () => {
    renderWithQueryClient(
      <GoalAllocation
        targetAktierPct={60}
        targetStabiltPct={40}
        onTargetSaved={vi.fn()}
      />
    )

    const button = screen.getByRole('button', { name: 'Spara mål' })
    expect(button).toBeEnabled()
  })

  it('shows "Mål sparat" and is disabled after saving', () => {
    renderWithQueryClient(
      <GoalAllocation
        targetAktierPct={60}
        targetStabiltPct={40}
        onTargetSaved={vi.fn()}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Spara mål' }))

    const button = screen.getByRole('button', { name: 'Mål sparat' })
    expect(button).toBeDisabled()
  })

  it('re-enables "Spara mål" after editing a field again', () => {
    renderWithQueryClient(
      <GoalAllocation
        targetAktierPct={60}
        targetStabiltPct={40}
        onTargetSaved={vi.fn()}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Spara mål' }))
    fireEvent.change(screen.getByDisplayValue('60'), { target: { value: '70' } })

    const button = screen.getByRole('button', { name: 'Spara mål' })
    expect(button).toBeEnabled()
  })
})
