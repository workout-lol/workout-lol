import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { Text, Timeline, Flex, Paper, Skeleton, Button, ActionIcon, Tooltip, ThemeIcon, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconArrowsShuffle, IconClick, IconTrash, IconPlus } from '@tabler/icons-react'
import { sortByPropertyWithHighDistribution, muscleToColor, shuffle } from './utils'
import SelectModal from './SelectModal'
import VideoIcon from './VideoIcon'

const fetcher = query => fetch(`/api/exercises${query}`)
  .then(res => res.json())

const Exercises = ({ equipment, muscles, workout, setWorkout }) => {
  const defaultCount = Math.round(6 / muscles.length) // default around 6 exercises
  const sortedEquipments = equipment.sort().join(',')
  const sortedMuscles = muscles.sort().join(',')
  const query = `?equipment=${sortedEquipments}&muscles=${sortedMuscles}`
  const { data = [], error, isLoading } = useSWR(`/exercises${query}`, () => fetcher(query))
  const [opened, { open, close }] = useDisclosure(false);
  const [defaultSelected, setDefaultSelected] = useState()
  const [exerciseIndex, setExerciseIndex] = useState()

  useEffect(() => {
    if (data.length && !workout.length) {
      const exercises = shuffle(data)
        .reduce((acc, curr) => {
          if (acc.filter(e => e.mainMuscle === curr.mainMuscle).length < defaultCount) {
            return [...acc, curr]
          } else {
            return acc
          }
        }, [])
      const sortedArray = sortByPropertyWithHighDistribution(exercises, 'mainMuscle')

      setWorkout(sortedArray)
    }
  }, [data, defaultCount, workout, setWorkout])

  const shuffleExercise = exercise => {
    const newExercise = shuffle(data)
      .filter(e => e.mainMuscle === exercise.mainMuscle)
      .find(e => !workout.find(w => w._id === e._id))

    const newWorkout = [...workout]
    newWorkout[workout.findIndex(w => w._id === exercise._id)] = newExercise

    setWorkout(newWorkout)
  }

  const selectExercise = exercise => {
    const index = workout.findIndex(w => w._id === exercise._id)

    setDefaultSelected(exercise.mainMuscle)
    setExerciseIndex(index)

    open()
  }

  const removeExercise = exercise => {
    const newWorkout = workout.filter(w => w._id !== exercise._id)

    setWorkout(newWorkout)
  }

  const addNewExercise = () => {
    setDefaultSelected(null)
    setExerciseIndex(null)

    open()
  }

  return <div>
    <Paper shadow="none" p="xs" bg="#f1f3f5">
      <Text fs="italic">Disclaimer: All exercises and videos are taken from <a href="https://musclewiki.com/" target="_blank" rel="noopener noreferrer">musclewiki.com</a></Text>
    </Paper>
    <Flex justify="space-between" mt="xl">
      {(isLoading || !workout.length) && <Timeline bulletSize={24} lineWidth={2} style={{ width: '100% '}}>
        {
          [...Array(6)].map((x, i) =>
            <Timeline.Item key={`loading-${i}`}>
              <Flex
                direction={{ base: 'column', xs: 'row' }}
                align={{ base: 'flex-start', xs: 'center' }}
                justify="space-between"
              >
                <Flex mr="xl" mb={{ base: 'sm', xs: 0 }}>
                  <Skeleton height={16} width={160} radius="sm" mr="xs" />
                  <Skeleton height={16} width={16} radius="sm" />
                </Flex>

                <Flex>
                  <Button disabled compact variant="light" color="blue" mr="xs" leftIcon={<IconArrowsShuffle size="1rem" />}>
                    Shuffle
                  </Button>
                  <Button disabled compact variant="light" color="blue" mr="xs" leftIcon={<IconClick size="1rem" />}>
                    Pick
                  </Button>
                  <ActionIcon variant="outline" color="red" size="sm" disabled>
                    <IconTrash size="1rem" />
                  </ActionIcon>
                </Flex>
              </Flex>
            </Timeline.Item>
          )}
          <Timeline.Item
            bullet={
              <ThemeIcon
                color="grey"
                radius="xl"
                style={{ cursor: 'pointer' }}
              >
                <IconPlus size="0.8rem" />
              </ThemeIcon>
            }>
            <Button compact variant="light" color="blue" mr="xs" disabled>
              Add
            </Button>
          </Timeline.Item>
      </Timeline>}
      {!isLoading && !!workout.length && <Timeline bulletSize={24} lineWidth={2} style={{ width: '100% '}}>
        { workout.map(exercise => <Timeline.Item key={exercise._id} bullet={
          <Tooltip label={exercise.mainMuscle}>
            <ThemeIcon
              size={22}
              variant="light"
              color={muscleToColor[exercise.mainMuscle]}
              radius="xl"
            >
              {exercise.mainMuscle.slice(0,1)}
            </ThemeIcon>
          </Tooltip>
        }>
          <Flex
            direction={{ base: 'column', xs: 'row' }}
            align={{ base: 'flex-start', xs: 'center' }}
            justify="space-between"
          >
            <Flex mr="xl" mb={{ base: 'sm', xs: 0 }}>
              <Text mr="xs" fw={500}>{exercise.title}</Text>
              <VideoIcon url={exercise.videos[0]}/>
            </Flex>

            <Flex>
              <Button compact variant="light" color="blue" mr="xs"
                onClick={() => shuffleExercise(exercise)}
                leftIcon={<IconArrowsShuffle size="1rem" />}>
                Shuffle
              </Button>
              <Button compact variant="light" color="blue" mr="xs"
                onClick={() => selectExercise(exercise)}
                leftIcon={<IconClick size="1rem" />}>
                Pick
              </Button>
              <ActionIcon variant="outline" color="red" size="sm" onClick={() => removeExercise(exercise)}>
                <IconTrash size="1rem" />
              </ActionIcon>
            </Flex>
          </Flex>
        </Timeline.Item> )}
        <Timeline.Item
          bullet={
            <ThemeIcon
              color="blue"
              radius="xl"
              onClick={addNewExercise}
              style={{ cursor: 'pointer' }}
            >
              <IconPlus size="0.8rem" />
            </ThemeIcon>
          }>
          <Button compact variant="light" color="blue" mr="xs" onClick={addNewExercise}>
            Add
          </Button>
        </Timeline.Item>
      </Timeline>}
    </Flex>
    <Modal opened={opened} onClose={close} title="Choose Exercise">
      <SelectModal
        exercises={data}
        workout={workout}
        setWorkout={setWorkout}
        close={close}
        defaultMuscle={defaultSelected}
        index={exerciseIndex}
      />
    </Modal>
  </div>
}

export default Exercises
