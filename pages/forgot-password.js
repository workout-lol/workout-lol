import { useState } from 'react'
import Link from 'next/link'
import { Text, TextInput, Button, Alert } from '@mantine/core'
import { IconAt, IconCheck, IconAlertCircle } from '@tabler/icons-react'
import Layout from '../components/Layout/Layout'
import useLocalStorage from '../utils/useAccount'

export default function ForgotPassword() {
  const [user] = useLocalStorage('user')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccessMessage(
          data.message || 'Password reset instructions have been sent to your email.'
        )
      } else {
        setErrorMessage(data.error || 'Failed to process password reset request.')
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
        Forgot Password
      </Text>
      <Text color='dimmed' size='sm' mb='md'>
        Enter your email address and we will send you instructions to reset your password.
      </Text>

      {successMessage && (
        <Alert
          icon={<IconCheck size='1rem' />}
          title='Check your inbox'
          color='green'
          mb='md'
        >
          {successMessage}
        </Alert>
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

      {!successMessage && (
        <form onSubmit={handleSubmit}>
          <TextInput
            name='email'
            placeholder='you@example.com'
            label='E-Mail Address'
            withAsterisk
            required
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<IconAt size='0.8rem' />}
            mb='md'
          />

          <Button type='submit' loading={isLoading} fullWidth mb='md'>
            Send Reset Instructions
          </Button>
        </form>
      )}

      <Text size='sm' align='center' mt='md'>
        Remember your password?{' '}
        <Link href='/sign-up' style={{ color: '#228be6', textDecoration: 'none' }}>
          Back to login / sign up
        </Link>
      </Text>
    </Layout>
  )
}
