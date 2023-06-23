import Link from 'next/link'
import { Text, Badge, Tooltip, Table, ActionIcon, Box, Flex } from '@mantine/core'
import { IconTrash, IconRepeat } from '@tabler/icons-react'
import { muscleToColor } from '../Exercises/utils'
import styles from './WorkoutTable.module.css'

const WorkoutTable = ({ workouts, deleteWorkout, viewOnly = false}) => {
    return <>
      <Table striped className={styles.mobileHide}>
        <thead>
          <tr>
            <th style={{ width: '130px' }}>Date</th>
            <th>Exercises</th>
            {!viewOnly && <th />}
          </tr>
        </thead>
        <tbody>
          {workouts.map((w, i) => <tr key={`workout-history-${i}`} mb="sm">
            <td><Text fw="bold">{ w.exercises.every(e => e.completed) && '✅ ' }{w.created_at.slice(0,10)}</Text></td>
            <td>
              { w.exercises.map((e, j) =>
                <Tooltip key={`history-${i}-${j}`} label={e.mainMuscle}>
                  <Badge color={muscleToColor[e.mainMuscle]} variant="outline" mr="xs" mb={4} mt={4}>
                    {e.title}
                  </Badge>
                </Tooltip>
              )}
            </td>
            {!viewOnly && (
            <><td>
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
            </td></>)}
          </tr> )}
        </tbody>
      </Table>
      <Box className={styles.mobileShow}>
        {workouts.map((w, i) => <Box key={`workout-history-${i}`} p="sm" mb="sm" bg={i%2 === 0 ? '#f8f9fa' : '#fff'}>
          <Flex justify="space-between">
            <Text fw="bold" mb="sm">{ w.exercises.every(e => e.completed) && '✅ ' }{w.created_at.slice(0,10)}</Text>

            {!viewOnly && (
              <Flex>
                <Link href={`/?w_id=${w.id}`} style={{ marginRight: '1em' }}>
                  <Tooltip label="Repeat workout">
                    <ActionIcon color="blue" variant="subtle">
                      <IconRepeat />
                    </ActionIcon>
                  </Tooltip>
                </Link>
                <Tooltip label="Delete workout">
                  <ActionIcon color="red" variant="subtle" onClick={() => deleteWorkout(w.id)}>
                    <IconTrash />
                  </ActionIcon>
                </Tooltip>
              </Flex>
            )}
          </Flex>
          { w.exercises.map((e, j) =>
            <Tooltip key={`history-${i}-${j}`} label={e.mainMuscle}>
              <Badge color={muscleToColor[e.mainMuscle]} variant="outline" mr="xs" mb={4} mt={4}>
                {e.title}
              </Badge>
            </Tooltip>
          )}
        </Box> )}
      </Box>
    </>
}

export default WorkoutTable
