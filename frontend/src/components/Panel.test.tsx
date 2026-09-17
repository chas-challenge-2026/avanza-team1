import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Panel from './Panel'

describe('Panel', () => {
  it('renders its title and children', () => {
    render(
      <Panel title="Testar panelen">
        <p>Här är panel-testet.</p>
      </Panel>
    )

    expect(screen.getByText('Testar panelen')).toBeInTheDocument()
    expect(screen.getByText('Här är panel-testet.')).toBeInTheDocument()
  })
})