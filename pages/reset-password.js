import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Anchor,
  Alert,
  Group,
} from '@mantine/core'
import {
  IconAt,
  IconLock,
  IconAlertCircle,
  IconCheck,
  IconArrowLeft,
} from '@tabler/icons-react'
import Layout from '../components/Layout/Layout'

export const REDIRECT_DELAY_MS = 2500

export default function ResetPassword() {
  const router = useRouter()
  const [token, setToken] = useState(null)

  // Request Reset State
  const [email, setEmail] = useState('')
  const [requestLoading, setRequestLoading] = useState(false)
  const [requestSubmitted, setRequestSubmitted] = useState(false)
  const [requestError, setRequestError] = useState(null)

  // Set New Password State
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const [resetError, setResetError] = useState(null)

  useEffect(() => {
    if (router.isReady && router.query.token) {
      setToken(router.query.token)
    }
  }, [router.isReady, router.query.token])

  const handleRequestReset = async (e) => {
    e.preventDefault()
    setRequestError(null)

    if (!email || !email.includes('@')) {
      setRequestError('Please enter a valid email address')
      return
    }

    setRequestLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to request password reset')

      setRequestSubmitted(true)
    } catch (err) {
      setRequestError(err.message)
    } finally {
      setRequestLoading(false)
    }
  }

  const handleSetNewPassword = async (e) => {
    e.preventDefault()
    setResetError(null)

    if (password.length < 6) {
      setResetError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setResetError('Passwords do not match')
      return
    }

    setResetLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to reset password')

      setResetSuccess(true)
      setTimeout(() => {
        router.push('/sign-up')
      }, REDIRECT_DELAY_MS)
    } catch (err) {
      setResetError(err.message)
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <Layout title="Reset Password | Workout.lol">
      <Container size={420} my={40}>
        <Title align="center" order={2} sx={(theme) => ({ fontFamily: theme.fontFamily, fontWeight: 900 })}>
          {token ? 'Create new password' : 'Forgot your password?'}
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          {token
            ? 'Enter and confirm your new password below'
            : 'Enter your email to receive a password reset link'}
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          {token ? (
            resetSuccess ? (
              <div>
                <Alert icon={<IconCheck size={16} />} title="Password Updated" color="teal" radius="md">
                  Your password has been reset successfully. Redirecting to login...
                </Alert>
                <Group position="center" mt="xl">
                  <Anchor component={Link} href="/sign-up" size="sm">
                    Go to login now
                  </Anchor>
                </Group>
              </div>
            ) : (
              <form onSubmit={handleSetNewPassword}>
                {resetError && (
                  <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md" radius="md">
                    {resetError}
                  </Alert>
                )}

                <PasswordInput
                  label="New password"
                  placeholder="At least 6 characters"
                  required
                  icon={<IconLock size={16} />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <PasswordInput
                  label="Confirm new password"
                  placeholder="Repeat your new password"
                  required
                  mt="md"
                  icon={<IconLock size={16} />}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <Button fullWidth mt="xl" type="submit" loading={resetLoading}>
                  Update password
                </Button>

                <Group position="center" mt="md">
                  <Anchor component={Link} href="/reset-password" size="sm" color="dimmed">
                    Request a new reset link
                  </Anchor>
                </Group>
              </form>
            )
          ) : (
            requestSubmitted ? (
              <div>
                <Alert icon={<IconCheck size={16} />} title="Check your inbox" color="teal" radius="md">
                  If an account exists for {email}, a link to reset your password has been sent. It expires in 2 hours.
                </Alert>
                <Group position="center" mt="xl">
                  <Anchor component={Link} href="/sign-up" size="sm">
                    <Group spacing={4}>
                      <IconArrowLeft size={14} />
                      <span>Back to login</span>
                    </Group>
                  </Anchor>
                </Group>
              </div>
            ) : (
              <form onSubmit={handleRequestReset}>
                {requestError && (
                  <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md" radius="md">
                    {requestError}
                  </Alert>
                )}

                <TextInput
                  label="Email address"
                  placeholder="you@example.com"
                  required
                  icon={<IconAt size={16} />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Button fullWidth mt="xl" type="submit" loading={requestLoading}>
                  Send reset link
                </Button>

                <Group position="center" mt="md">
                  <Anchor component={Link} href="/sign-up" size="sm" color="dimmed">
                    <Group spacing={4}>
                      <IconArrowLeft size={14} />
                      <span>Back to login</span>
                    </Group>
                  </Anchor>
                </Group>
              </form>
            )
          )}
        </Paper>
      </Container>
    </Layout>
  )
}
