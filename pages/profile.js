import { useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import Link from 'next/link'
import { useMantineColorScheme, Paper, Text } from '@mantine/core'
import Layout from '../components/Layout/Layout'
import Calendar from '../components/Calendar/Calendar'
import WorkoutTable from '../components/WorkoutTable/WorkoutTable'
import Form from '../containers/user/profile/form'
import useAccount, { useLocalStorage } from '../utils/useAccount'

export default function Home() {
  const { colorScheme } = useMantineColorScheme()
  const { data: session } = useSession()
  const [account = {}, setAccount] = useAccount()
  const [localStorageUser, setLocalStorage] = useLocalStorage('user')
  const { data: user = {} } = account

  const workouts = (user.workouts || []).sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  )

  useEffect(() => {
    // after registering, initialize data
    if (
      session &&
      user.email &&
      !user.workouts &&
      !user.equipment &&
      !localStorageUser.isLoading
    ) {
      const { workouts = [], equipment = [] } = localStorageUser.data
      setAccount({ ...user, workouts, equipment })
      setLocalStorage({})
      // show success message ?
    }
  }, [session, user, localStorageUser, setLocalStorage, setAccount])

  const deleteWorkout = (id) => {
    const workouts = user.workouts.filter((w) => w.id !== id)
    setAccount({ ...user, workouts })
  }

  const toggleFavorite = (id) => {
    const workouts = (user.workouts || []).map((w) =>
      w.id === id ? { ...w, favorite: !w.favorite } : w
    )
    setAccount({ ...user, workouts })
  }

  const favoriteWorkouts = workouts.filter((w) => w.favorite)

  return (
    <Layout>
      {!session && (
        <Paper
          shadow='none'
          p='xs'
          mb='xl'
          bg={colorScheme === 'dark' ? '#0a2a48' : 'lightblue'}
        >
          <Text fs='italic'>
            Your progress is stored in your browser.
            <br />
            <Link href='/sign-up'>Create an account</Link> or{' '}
            <a href='#login' onClick={() => signIn()}>
              Log-in
            </a>{' '}
            to ensure it is not getting lost
          </Text>
        </Paper>
      )}

      {session && session.user && <Form />}
      <Calendar variant='full' workouts={workouts} />

      {workouts.length === 0 && (
        <Text mt='lg' mb='md' fw='bold'>
          No workouts yet...
        </Text>
      )}
      {favoriteWorkouts.length > 0 && (
        <>
          <Text mt='lg' mb='md' fw='bold'>
            ⭐ Favorite Workouts [{favoriteWorkouts.length}]
          </Text>
          <WorkoutTable
            workouts={favoriteWorkouts}
            deleteWorkout={deleteWorkout}
            toggleFavorite={toggleFavorite}
          />
        </>
      )}
      {workouts.length > 0 && (
        <Text mt='lg' mb='md' fw='bold'>
          Workout History [{workouts.length}]
        </Text>
      )}
      {workouts.length > 0 && (
        <WorkoutTable
          workouts={workouts}
          deleteWorkout={deleteWorkout}
          toggleFavorite={toggleFavorite}
        />
      )}
    </Layout>
  )
}
