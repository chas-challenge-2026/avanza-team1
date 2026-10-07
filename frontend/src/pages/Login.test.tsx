import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import Login from './Login'
import { AuthProvider } from '../auth/AuthProvider'

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<div>TODO: dummy-sida för lyckad inloggning</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('Login', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('navigates to / on success', () => {
    renderLogin()
    const emailInput = screen.getByLabelText('E-post');
    const passwordInput = screen.getByLabelText('Lösenord');


    fireEvent.change(emailInput, { target: { value: 'anna@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Logga in' }))

    expect(screen.getByText('TODO: dummy-sida för lyckad inloggning')).toBeInTheDocument()
  })

  it('shows an error on invalid credentials', () => {
    renderLogin()
    const emailInput = screen.getByLabelText('E-post');
    const passwordInput = screen.getByLabelText('Lösenord');

    fireEvent.change(emailInput, { target: { value: 'anna@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'fel-losenord' } })
    fireEvent.click(screen.getByRole('button', { name: 'Logga in' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Fel e-post eller lösenord.')
  })
})