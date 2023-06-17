import { useSession, signIn } from "next-auth/react"
import Link from 'next/link';
import { Paper, Text } from '@mantine/core'
import Layout from '../components/Layout/Layout'
import Calendar from '../components/Calendar/Calendar'
import WorkoutTable from '../components/WorkoutTable/WorkoutTable'
import useAccount from '../utils/useAccount'

// show success if query param "created === true"
export default function Home() {
  const { data: session } = useSession()
  const [account = {}, setAccount] = useAccount()
  const { data: user = {} } = account

  const workouts = (user.workouts || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  const deleteWorkout = (id) => {
    const workouts = user.workouts.filter(w => w.id!== id)
    setAccount({ ...user, workouts })
  }

  return <Layout>
    { !session && <Paper shadow="none" p="xs" mb="xl" bg="lightblue">
      <Text fs="italic">
        Your progress is stored in your browser.<br/>
        <Link href="/sign-up">Create an account</Link> or <a href="#login" onClick={() => signIn()}>Log-in</a> to ensure it is not getting lost
      </Text>
    </Paper> }

    <Calendar variant="full" user={user} />

    {workouts.length === 0 && <Text mt="lg" mb="md" fw="bold">No workouts yet...</Text> }
    {workouts.length > 0 && <Text mt="lg" mb="md" fw="bold">Workout History [{workouts.length}]</Text>}
    {workouts.length > 0 && <WorkoutTable workouts={workouts} deleteWorkout={deleteWorkout} /> }
  </Layout>
}
