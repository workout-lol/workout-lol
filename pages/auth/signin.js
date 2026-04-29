import { useState } from 'react'
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/react'
import { Text, TextInput, PasswordInput, Button, Divider } from '@mantine/core'
import {
  IconAt,
  IconLock,
  IconBrandGoogle,
  IconBrandTwitter,
} from '@tabler/icons-react'
import Layout from '../../components/Layout/Layout'
import useLocalStorage from '../../utils/useAccount'

const ERROR_MESSAGES = {
  CredentialsSignin: 'Invalid email or password.',
  OAuthSignin: 'Unable to start sign in. Please try again.',
  OAuthCallback: 'Unable to finish sign in. Please try again.',
  OAuthCreateAccount: 'Unable to create an account with this provider.',
  EmailCreateAccount: 'Unable to create an account with this email.',
  Callback: 'Unable to finish sign in. Please try again.',
  OAuthAccountNotLinked:
    'This email is already linked to another sign-in method. Please use that method instead.',
  SessionRequired: 'Please sign in to continue.',
}

export default function SignIn() {
  const router = useRouter()
  const [user] = useLocalStorage('user')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const submitForm = async (event) => {
    event.preventDefault()
    setError(null)
    setIsLoading(true)

    const { email, password } = event.target.elements
    const result = await signIn('credentials', {
      username: email.value,
      password: password.value,
      redirect: false,
    })

    setIsLoading(false)

    if (result?.error) {
      setError(ERROR_MESSAGES[result.error] || 'Unable to sign in.')
      return
    }

    router.push('/profile')
  }

  const queryError = router.query.error
  const displayedError = error || ERROR_MESSAGES[queryError] || queryError

  return (
    <Layout user={user}>
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
          mb='md'
        />

        {displayedError && (
          <Text color='red' mt='sm' mb='sm'>
            {displayedError}
          </Text>
        )}

        <Button type='submit' loading={isLoading} fullWidth>
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
