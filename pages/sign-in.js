import { useState } from 'react'
import Link from 'next/link'
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

export default function SignIn() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const submitForm = (e) => {
    e.preventDefault()
    const { email, password } = e.target.elements
    setError(null)
    setIsLoading(true)

    signIn('credentials', {
      redirect: false,
      username: email.value,
      password: password.value,
    })
      .then((res) => {
        if (res.ok) {
          router.push('/profile')
        } else {
          setError('Invalid email address or password')
        }
      })
      .catch(() => {
        setError(
          'An unexpected Error occured. Please try again or contact support.'
        )
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <Layout>
      <Text fw='bold' mb='sm'>
        Login
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
        />
        <PasswordInput
          name='password'
          placeholder='Your password'
          label='Password'
          withAsterisk
          required
          icon={<IconLock size='0.8rem' />}
          mb='xs'
        />

        <Text size='sm' mb='md'>
          <Link href='/forgot-password'>Forgot password?</Link>
        </Text>

        {error && (
          <Text color='red' mt='sm' mb='sm'>
            {error}
          </Text>
        )}

        <Button type='submit' loading={isLoading}>
          Login
        </Button>
      </form>

      <Divider my='md' label='or' labelPosition='center' />

      <Button
        variant='outline'
        fullWidth
        leftIcon={<IconBrandGoogle size='1rem' />}
        onClick={() => signIn('google')}
        mb='md'
      >
        Login with Google
      </Button>

      <Button
        variant='outline'
        fullWidth
        leftIcon={<IconBrandTwitter size='1rem' />}
        onClick={() => signIn('twitter')}
      >
        Login with Twitter
      </Button>
    </Layout>
  )
}
