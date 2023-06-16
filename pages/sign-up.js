import { useState } from 'react'
import { useSession, signIn } from "next-auth/react"
import { Text, TextInput, PasswordInput, Button } from '@mantine/core'
import { IconAt, IconLock } from '@tabler/icons-react';
import Layout from '../components/Layout/Layout'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const submitForm = (e) => {
    e.preventDefault();
    const { email, password } = e.target.elements
    setError(null)

    // we can add more password requirements here
    if (!password.value || password.value.length < 6) {
      setError({ password: "Password must be at least 6 characters" })
    } else {
      setIsLoading(true)

      const data = {
        email: email.value,
        password: password.value,
        session_data: user,
      }
      fetch('/api/sign-up', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then(r =>  r.json().then(data => ({ status: r.status, body: data })))
        .then(res => {
          if (res.status === 201) {
            signIn('credentials', {
              username: email.value,
              password: password.value,
              callbackUrl: '/profile?created=true',
            })
          } else {
            setError(res.body)
          }
        }).catch(err => {
          setError(err)
        }).finally(() => setIsLoading(false))

    }
  }

  return <Layout>
    <Text fw="bold" mb="sm">Create an account</Text>
    <form onSubmit={submitForm}>
      <TextInput
        name="email"
        placeholder="you@example.com"
        label="E-Mail Address"
        withAsterisk
        required
        icon={<IconAt size="0.8rem" />}
        mb="xs"
        error={error && error.email}
      />
      <PasswordInput
        name="password"
        placeholder="Your password"
        label="Password"
        withAsterisk
        required
        icon={<IconLock size="0.8rem" />}
        mb="md"
        error={error && error.password}
      />

      { error && !error.email && !error.password &&
        <Text color="red" mt="sm" mb="sm">An unexpected Error occured. Please try again or contact support.</Text>
      }

      <Button variant="filled" type="submit" loading={isLoading}>
        Create account
      </Button>
    </form>
  </Layout>
}
