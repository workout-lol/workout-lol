import { render, screen, fireEvent, act } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'
import ResetPasswordPage, { REDIRECT_DELAY_MS } from '../../pages/reset-password'

const mockPush = jest.fn()
let mockRouterQuery = {}

jest.mock('next/router', () => ({
  useRouter: () => ({
    isReady: true,
    query: mockRouterQuery,
    pathname: '/reset-password',
    asPath: '/reset-password',
    push: mockPush,
  }),
}))

jest.mock('../../components/Layout/Layout', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}))

const renderComponent = () =>
  render(
    <MantineProvider>
      <ResetPasswordPage />
    </MantineProvider>
  )

describe('Reset Password Page UI', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('Form Routing / Conditional Rendering', () => {
    it('shows forgot-password email request form when token is absent', () => {
      mockRouterQuery = {}
      renderComponent()
      expect(screen.getByRole('heading', { name: /forgot your password/i })).toBeInTheDocument()
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument()
      expect(screen.queryByLabelText(/^new password/i)).not.toBeInTheDocument()
    })

    it('shows new-password form when token is present in router query', () => {
      mockRouterQuery = { token: 'sample-token-abc' }
      renderComponent()
      expect(screen.getByRole('heading', { name: /create new password/i })).toBeInTheDocument()
      expect(screen.getByLabelText(/^new password/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirm new password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /update password/i })).toBeInTheDocument()
      expect(screen.queryByLabelText(/email address/i)).not.toBeInTheDocument()
    })
  })

  describe('Phase 1: Request Reset Flow', () => {
    beforeEach(() => {
      mockRouterQuery = {}
    })

    it('submits invalid email and asserts inline error UI without navigating or calling fetch', async () => {
      renderComponent()

      fireEvent.change(screen.getByLabelText(/email address/i), {
        target: { value: 'notanemail' },
      })
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /send reset link/i }))
      })

      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
      expect(global.fetch).not.toHaveBeenCalled()
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('submits valid email and shows confirmation alert upon 200 response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Instructions sent' }),
      })

      renderComponent()

      fireEvent.change(screen.getByLabelText(/email address/i), {
        target: { value: 'athlete@workout.lol' },
      })
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /send reset link/i }))
      })

      expect(screen.getByText(/check your inbox/i)).toBeInTheDocument()
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  describe('Phase 2: Set New Password Flow', () => {
    beforeEach(() => {
      mockRouterQuery = { token: 'active-token-123' }
    })

    it('submits new password with invalid token and asserts error UI without navigating', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: 'This reset link has expired. Please request a new one.',
        }),
      })

      renderComponent()

      fireEvent.change(screen.getByLabelText(/^new password/i), {
        target: { value: 'securepassword123' },
      })
      fireEvent.change(screen.getByLabelText(/confirm new password/i), {
        target: { value: 'securepassword123' },
      })
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /update password/i }))
      })

      expect(screen.getByText(/this reset link has expired/i)).toBeInTheDocument()
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('asserts exact timing for redirect threshold before and after REDIRECT_DELAY_MS', async () => {
      jest.useFakeTimers()
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Password has been reset successfully' }),
      })

      renderComponent()

      fireEvent.change(screen.getByLabelText(/^new password/i), {
        target: { value: 'brandNewPassword123' },
      })
      fireEvent.change(screen.getByLabelText(/confirm new password/i), {
        target: { value: 'brandNewPassword123' },
      })

      // Flush microtasks from async fetch resolution and state update
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /update password/i }))
      })

      // Success alert rendered immediately
      expect(
        screen.getByText(/your password has been reset successfully/i)
      ).toBeInTheDocument()

      // Before threshold: exactly REDIRECT_DELAY_MS - 1
      act(() => {
        jest.advanceTimersByTime(REDIRECT_DELAY_MS - 1)
      })
      expect(mockPush).not.toHaveBeenCalled()

      // At/after threshold: advancing remaining 1 ms (reaching REDIRECT_DELAY_MS)
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(mockPush).toHaveBeenCalledTimes(1)
      expect(mockPush).toHaveBeenCalledWith('/sign-up')
    })
  })
})
