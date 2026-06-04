import { useState } from 'react'
import { Alert, Button, Text, TextInput } from '@mantine/core'
import { IconAt } from '@tabler/icons-react'
import Layout from '../components/Layout/Layout'

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [resetUrl, setResetUrl] = useState(null)

  const submitForm = (e) => {
    e.preventDefault()
    const { email } = e.target.elements
    setError(null)
    setMessage(null)
    setResetUrl(null)
    setIsLoading(true)

    fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value }),
    })
      .then((r) => r.json().then((data) => ({ status: r.status, body: data })))
      .then((res) => {
        if (res.status === 200) {
          setMessage(res.body.message)
          setResetUrl(res.body.resetUrl)
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
        Reset your password
      </Text>

      <Text mb='md'>
        Enter the email address linked to your account and we will send you a
        reset link.
      </Text>

      <form onSubmit={submitForm}>
        <TextInput
          name='email'
          placeholder='you@example.com'
          label='E-Mail Address'
          withAsterisk
          required
          icon={<IconAt size='0.8rem' />}
          mb='md'
          error={error && error.email}
        />

        {error && error.form && (
          <Text color='red' mt='sm' mb='sm'>
            {error.form}
          </Text>
        )}

        <Button type='submit' loading={isLoading}>
          Send reset link
        </Button>
      </form>

      {message && (
        <Alert color='green' mt='md'>
          {message}
          {resetUrl && (
            <Text mt='sm'>
              Development reset link: <a href={resetUrl}>Open password reset</a>
            </Text>
          )}
        </Alert>
      )}
    </Layout>
  )
}
