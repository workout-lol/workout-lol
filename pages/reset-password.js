import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Text, PasswordInput, Button, Alert } from '@mantine/core'
import { IconLock, IconCheck, IconAlertCircle } from '@tabler/icons-react'
import Layout from '../components/Layout/Layout'
import useLocalStorage from '../utils/useAccount'

export default function ResetPassword() {
  const router = useRouter()
  const [user] = useLocalStorage('user')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState('')

  useEffect(() => {
    if (router.query && router.query.token) {
      setToken(router.query.token)
    }
  }, [router.query])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!token) {
      setErrorMessage('Missing or invalid reset token. Please request a new link.')
      return
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (res.ok) {
        setIsSuccess(true)
      } else {
        setErrorMessage(data.error || 'Failed to reset password.')
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout user={user}>
      <Text fw='bold' mb='sm' size='xl'>
        Reset Your Password
      </Text>
      <Text color='dimmed' size='sm' mb='md'>
        Please enter a new password for your account.
      </Text>

      {isSuccess && (
        <>
          <Alert
            icon={<IconCheck size='1rem' />}
            title='Password Reset Successful'
            color='green'
            mb='md'
          >
            Your password has been reset successfully. You can now log in with your new password.
          </Alert>
          <Button
            component={Link}
            href='/sign-up'
            fullWidth
            mt='md'
          >
            Go to Login
          </Button>
        </>
      )}

      {errorMessage && (
        <Alert
          icon={<IconAlertCircle size='1rem' />}
          title='Error'
          color='red'
          mb='md'
        >
          {errorMessage}
        </Alert>
      )}

      {!isSuccess && (
        <form onSubmit={handleSubmit}>
          <PasswordInput
            name='password'
            placeholder='New password'
            label='New Password'
            withAsterisk
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<IconLock size='0.8rem' />}
            mb='sm'
          />

          <PasswordInput
            name='confirmPassword'
            placeholder='Confirm new password'
            label='Confirm New Password'
            withAsterisk
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={<IconLock size='0.8rem' />}
            mb='md'
          />

          <Button type='submit' loading={isLoading} fullWidth mb='md'>
            Update Password
          </Button>
        </form>
      )}

      <Text size='sm' align='center' mt='md'>
        <Link href='/sign-up' style={{ color: '#228be6', textDecoration: 'none' }}>
          Back to login / sign up
        </Link>
      </Text>
    </Layout>
  )
}
