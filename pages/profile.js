import Link from 'next/link'
import { Paper, Text, Accordion, Badge, Tooltip, Table, ActionIcon } from '@mantine/core'
import { IconTrash, IconRepeat } from '@tabler/icons-react'
import Layout from '../components/Layout/Layout'
import Calendar from '../components/Calendar/Calendar'
import useLocalStorage from '../utils/localStorage'
import { muscleToColor } from '../components/Exercises/utils'

export default function Home() {
  const [user, setUser] = useLocalStorage('user');

  if (!user) return <></>

  const workouts = (user.workouts || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  if (workouts.length === 0) return <></>

  const deleteWorkout = (id) => {
    const workouts = user.workouts.filter(w => w.id!== id)
    setUser({ ...user, workouts })
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
    <Table striped>
      <thead>
        <tr>
          <th></th>
          <th style={{ width: '110px' }}>Date</th>
          <th>Exercises</th>
        </tr>
      </thead>
      <tbody>
        {workouts.map((w, i) => <tr key={`history-${i}`} mb="sm">
          <td>
            { w.exercises.every(e => e.completed) && '✅' }
          </td>
          <td><Text>{w.created_at.slice(0,10)}</Text></td>

          <td>
            { w.exercises.map((e, j) =>
              <Tooltip key={`history-${i}-${j}`} label={e.mainMuscle}>
                <Badge color={muscleToColor[e.mainMuscle]} variant="outline" mr="xs" mb={4} mt={4}>
                  {e.title}
                </Badge>
              </Tooltip>
            )}
          </td>
          <td>
            <Link href={`/?w_id=${w.id}`}>
              <Tooltip label="Repeat workout">
                <ActionIcon color="blue" variant="subtle">
                  <IconRepeat />
                </ActionIcon>
              </Tooltip>
            </Link>
          </td>
          <td>
            <Tooltip label="Delete workout">
              <ActionIcon color="red" variant="subtle" onClick={() => deleteWorkout(w.id)}>
                <IconTrash />
              </ActionIcon>
            </Tooltip>
          </td>
        </tr> )}
      </tbody>
    </Table>
  </Layout>
}
