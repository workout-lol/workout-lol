import { useRouter } from 'next/router';
import { Paper, Text } from '@mantine/core'
import Layout from '../components/Layout/Layout'
import Calendar from '../components/Calendar/Calendar'
import WorkoutTable from '../components/WorkoutTable/WorkoutTable'
import useLocalStorage from '../utils/localStorage'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useLocalStorage('user');

  if (!user) return <></>

  const workouts = (user.workouts || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  // todo empty profile state
  if (workouts.length === 0) return <></>

  const deleteWorkout = (id) => {
    const workouts = user.workouts.filter(w => w.id!== id)
    setUser({ ...user, workouts })

    if (workouts.length === 0) {
      router.push('/') // remove this if empty profile state done
    }
  }

  return <Layout user={user}>
    <Paper shadow="none" p="xs" mb="xl" bg="lightblue">
      <Text fs="italic">
        Your progress is stored in your browser.<br/>
        Accounts are coming soon...
      </Text>
      {/* <Link href="/sign-up">Create an account</Link> to ensure it is not getting lost</Text> */}
    </Paper>

    <Calendar variant="full" user={user} />


    <Text mt="lg" mb="md" fw="bold">Workout History [{workouts.length}]</Text>
    <WorkoutTable workouts={workouts} deleteWorkout={deleteWorkout} />
  </Layout>
}
