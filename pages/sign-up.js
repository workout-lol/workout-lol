import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/react'
import { Text, TextInput, PasswordInput, Button, Divider } from '@mantine/core'
import {
  IconAt,
  IconLock,
  IconBrandGoogle,
  IconBrandTwitter,
} from '@tabler/icons-react'
import Layout from '../components/Layout/Layout'
import useLocalStorage from '../utils/useAccount'

export default function Home() {
  const router = useRouter()
  const [user] = useLocalStorage('user')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (router.query && router.query.error && router.query.error === 'exists') {
      setError({
        social:
          'Error: You already signed-up with a different method using this email address.',
      })
    }
  }, [router.query])

  const submitForm = (e) => {
    e.preventDefault()
    const { email, password } = e.target.elements
    setError(null)

    // we can add more password requirements here
    if (!password.value || password.value.length < 6) {
      setError({ password: 'Password must be at least 6 characters' })
    } else {
      setIsLoading(true)

      const data = {
        email: email.value,
        password: password.value,
      }
      fetch('/api/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then((r) =>
          r.json().then((data) => ({ status: r.status, body: data }))
        )
        .then((res) => {
          if (res.status === 201) {
            signIn('credentials', {
              username: email.value,
              password: password.value,
            })
          } else {
            setError(res.body)
          }
        })
        .catch((err) => {
          setError(err)
        })
        .finally(() => setIsLoading(false))
    }
  }

  return (
    <Layout user={user}>
      <Text fw='bold' mb='sm'>
        Create an account
      </Text>
      <form onSubmit={submitForm}>
        <TextInput
          name='email'
          placeholder='you@example.com'
          label='E-Mail Address'
          withAsterisk
          required
          icon={<IconAt size='0.8rem' />}
          mb='xs'
          error={error && error.email}
        />
        <PasswordInput
          name='password'
          placeholder='Your password'
          label='Password'
          withAsterisk
          required
          icon={<IconLock size='0.8rem' />}
          mb='md'
          error={error && error.password}
        />

        {error && !error.email && !error.password && !error.social && (
          <Text color='red' mt='sm' mb='sm'>
            An unexpected Error occured. Please try again or contact support.
          </Text>
        )}

        <Button type='submit' loading={isLoading}>
          Create account
        </Button>
      </form>

      <Divider my='md' label='or' labelPosition='center' />

      {error && error.social && (
        <Text color='red' mt='sm' mb='sm'>
          {error.social}
        </Text>
      )}

      <Button
        variant='outline'
        fullWidth
        leftIcon={<IconBrandGoogle size='1rem' />}
        onClick={() => signIn('google')}
        mb='md'
      >
        Sign-up with Google
      </Button>

      <Button
        variant='outline'
        fullWidth
        leftIcon={<IconBrandTwitter size='1rem' />}
        onClick={() => signIn('twitter')}
      >
        Sign-up with Twitter
      </Button>
    </Layout>
  )
}
