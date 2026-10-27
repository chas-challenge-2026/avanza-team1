
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import GoalAllocation from './GoalAllocation'

// Skapar en ny React Query-klient för varje test
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

// Renderar komponenten med React Query
const renderWithQueryClient = (component: React.ReactElement) => {
  const testQueryClient = createTestQueryClient()

  return render(
    <QueryClientProvider client={testQueryClient}>
      {component}
    </QueryClientProvider>
  )
}

// Rensar sparad data före varje test
beforeEach(() => {
  localStorage.clear()
})

describe('GoalAllocation', () => {

  it('saves when the initial sum is valid (100%)', async () => {
    const onTargetSaved = vi.fn()

    renderWithQueryClient(
      <GoalAllocation
        targetAktierPct={60}
        targetStabiltPct={40}
        onTargetSaved={onTargetSaved}
      />
    )

    fireEvent.click(
      screen.getByRole('button', { name: 'Spara mål' })
    )

    await waitFor(() => {
      expect(onTargetSaved).toHaveBeenCalledWith(60, 40)
    })
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

    const button = screen.getByRole('button', {
      name: 'Spara mål',
    })

    expect(button).toBeDisabled()

    fireEvent.click(button)

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

    const button = screen.getByRole('button', {
      name: 'Spara mål',
    })

    expect(button).toBeEnabled()
  })


  it('shows "Mål sparat" and resets to "Spara mål" after 3 seconds', async () => {
    renderWithQueryClient(
      <GoalAllocation
        targetAktierPct={60}
        targetStabiltPct={40}
        onTargetSaved={vi.fn()}
      />
    )

    fireEvent.click(
      screen.getByRole('button', { name: 'Spara mål' })
    )

    // Vänta tills sparningen är klar
    expect(
      await screen.findByRole('button', { name: 'Mål sparat' })
    ).toBeInTheDocument()

    // Vänta tills knappen återställs efter 3 sekunder
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Spara mål' })
      ).toBeInTheDocument()
    }, { timeout: 4000 })
  })

  it('re-enables "Spara mål" after editing a field again', async () => {
    renderWithQueryClient(
      <GoalAllocation
        targetAktierPct={60}
        targetStabiltPct={40}
        onTargetSaved={vi.fn()}
      />
    )

    // Spara den ursprungliga fördelningen
    fireEvent.click(
      screen.getByRole('button', { name: 'Spara mål' })
    )

    // Vänta tills sparningen är klar
    expect(
      await screen.findByRole('button', { name: 'Mål sparat' })
    ).toBeInTheDocument()

    // Ändra aktier från 60 till 70
    fireEvent.change(
      screen.getByDisplayValue('60'),
      { target: { value: '70' } }
    )

    // Kontrollera att fonder automatiskt blir 30 %
    expect(screen.getByDisplayValue('70')).toBeInTheDocument()
    expect(screen.getByDisplayValue('30')).toBeInTheDocument()

    // Kontrollera att knappen är aktiv igen
    const button = screen.getByRole('button', {
      name: 'Spara mål',
    })

    expect(button).toBeEnabled()
  })
})
