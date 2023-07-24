import { Text, Group, Button, Modal, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useSession } from 'next-auth/react'
import Layout from '../components/Layout/Layout'
import PublicWorkoutModal from '../components/PublicWorkoutModal'
import Table from '../components/PublicWorkout/Table'
import useAccount from '../utils/useAccount'
import usePublicWorkouts from '../utils/usePublicWorkouts'

const InfoTooltip = ({ session, children }) =>
  session ? (
    <>{children}</>
  ) : (
    <Tooltip label='Login to create a public workout'>{children}</Tooltip>
  )

export default function Home() {
  const { data: session } = useSession()
  const [account = {}] = useAccount()
  const [opened, { open, close }] = useDisclosure(false)
  const { data, isLoading } = usePublicWorkouts()
  console.log(data, isLoading)

  return (
    <Layout isFetching={isLoading}>
      <Group position='apart' mb='xl'>
        <Text fw='bold'>Public Workouts</Text>
        <InfoTooltip session={session}>
          <span>
            <Button size='xs' onClick={open} disabled={!session}>
              Create Public Workout
            </Button>
          </span>
        </InfoTooltip>
      </Group>

      {/* todo loading */}

      {!data ||
        (data.length === 0 && (
          <Text>
            There are no public workouts yet.
            <br />
            Be the first one to create a public workout.
          </Text>
        ))}

      {data && data.length > 0 && <Table workouts={data} />}

      <Modal
        opened={opened}
        onClose={close}
        title='Create Public Workout'
        size='auto'
      >
        <PublicWorkoutModal account={account} close={close} />
      </Modal>
    </Layout>
  )
}
