import React, { useEffect, useState } from 'react'
import { Text, TextInput, Button, Flex } from '@mantine/core'
import { IconUser } from '@tabler/icons-react'
import useAccount from '../../../utils/useAccount'
import slugify from 'slugify'
import Link from 'next/link'
import toast from 'react-hot-toast'

const SLUG_MIN_LENGTH = 3
const SLUG_MAX_LENGTH = 64
const slugifyOptions = {
  replacement: '-',
  lower: true,
  strict: true,
  trim: true,
  locale: 'en',
}
const Form = ({ user }) => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [slug, setSlug] = useState(user.slug || '')
  const [originalSlug, setOriginalSlug] = useState(user.slug || '')
  const slugified = slugify(slug, slugifyOptions)

  useEffect(() => {
    setOriginalSlug(user.slug)
    setSlug(user.slug)
  }, [user.slug])

  const submitForm = (e) => {
    e.preventDefault()
    setError(null)

    if (!slug || slug.length < SLUG_MIN_LENGTH) {
      setError({
        slug: `Slug must be at least ${SLUG_MIN_LENGTH} characters`,
      })
    } else {
      setIsLoading(true)

      const data = { slug }

      fetch(`/api/user/${originalSlug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then((r) =>
          r.json().then((data) => ({ status: r.status, body: data }))
        )
        .then((res) => {
          if (res.status === 200) {
            toast.success('The username has been updated.')
            setIsLoading(false)
            setError(null)
            setOriginalSlug(slug)
            return
          }
          if (res.status === 409) {
            toast.error('Oops ! The username is already taken.')
            setError({
              slug: `The username ${slug} is already taken.`,
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
    <form onSubmit={submitForm} style={{ marginBottom: 20 }}>
      <Flex align='center' mb='xs'>
        <TextInput
          name='slug'
          placeholder='i-love-workout'
          label='Username'
          disabled={isLoading}
          withAsterisk
          onChange={(event) => {
            setError(null)
            setSlug(event.currentTarget.value)
          }}
          value={slug}
          required
          icon={<IconUser size='0.8rem' />}
          minLength={SLUG_MIN_LENGTH}
          maxLength={SLUG_MAX_LENGTH}
          error={error && error.slug}
        />
        <Button
          ml='sm'
          type='submit'
          loading={isLoading}
          disabled={isLoading || slug === originalSlug}
          sx={{
            alignSelf: 'end',
          }}
        >
          Save
        </Button>
        <Link
          href={`/u/${originalSlug}`}
          style={{
            alignSelf: 'end',
            cursor: 'pointer',

            '&:hover': {
              textDecoration: 'underline',
              cursor: 'pointer',
            },
          }}
        >
          <Button
            ml='sm'
            variant='outline'
            sx={{
              alignSelf: 'end',
              cursor: 'pointer',
            }}
          >
            View my profile
          </Button>
        </Link>
      </Flex>

      {slug !== originalSlug && (
        <Flex>
          <Text size='sm' color='gray'>
            Your username will be <strong>{slugified}</strong>
          </Text>
        </Flex>
      )}
      {error && !error.slug && (
        <Text color='red' mb='lg'>
          An unexpected Error occured. Please try again or contact support.
        </Text>
      )}
    </form>
  )
}
const withDefinedUser = (Component) => {
  const MemoComponent = React.memo(Component)

  const Wrapper = (props) => {
    const [account] = useAccount()
    const { data: user = null, isLoading } = account

    if (isLoading) return null
    return <MemoComponent user={user} {...props} />
  }

  return React.memo(Wrapper)
}

export default withDefinedUser(Form)
