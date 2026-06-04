import { useState } from 'react'
import { useRouter } from 'next/router'
import { Alert, Button, PasswordInput, Text } from '@mantine/core'
import { IconLock } from '@tabler/icons-react'
import Layout from '../components/Layout/Layout'

export default function ResetPassword() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isDone, setIsDone] = useState(false)

  const submitForm = (e) => {
    e.preventDefault()
    const { password, confirmPassword } = e.target.elements
    setError(null)

    if (password.value !== confirmPassword.value) {
      setError({ confirmPassword: 'Passwords do not match' })
      return
    }

    setIsLoading(true)

    fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: router.query.token,
        password: password.value,
      }),
    })
      .then((r) => r.json().then((data) => ({ status: r.status, body: data })))
      .then((res) => {
        if (res.status === 200) {
          setIsDone(true)
        } else {
          setError(res.body)
        }
      })
      .catch(() => {
        setError({
          form: 'An unexpected Error occured. Please try again or contact support.',
        })
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <Layout>
      <Text fw='bold' mb='sm'>
        Choose a new password
      </Text>

      {isDone ? (
        <Alert color='green'>
          Your password has been updated. You can now log in with the new
          password.
        </Alert>
      ) : (
        <form onSubmit={submitForm}>
          <PasswordInput
            name='password'
            placeholder='Your new password'
            label='New password'
            withAsterisk
            required
            icon={<IconLock size='0.8rem' />}
            mb='xs'
            error={error && error.password}
          />
          <PasswordInput
            name='confirmPassword'
            placeholder='Repeat your new password'
            label='Confirm new password'
            withAsterisk
            required
            icon={<IconLock size='0.8rem' />}
            mb='md'
            error={error && error.confirmPassword}
          />

          {error && error.token && (
            <Text color='red' mt='sm' mb='sm'>
              {error.token}
            </Text>
          )}
          {error && error.form && (
            <Text color='red' mt='sm' mb='sm'>
              {error.form}
            </Text>
          )}

          <Button type='submit' loading={isLoading}>
            Update password
          </Button>
        </form>
      )}
    </Layout>
  )
}
