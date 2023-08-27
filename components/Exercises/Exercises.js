import React, { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import {
  useMantineColorScheme,
  Text,
  Flex,
  Skeleton,
  Button,
  ActionIcon,
  Tooltip,
  ThemeIcon,
  Modal,
  Box,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  IconArrowsShuffle,
  IconClick,
  IconTrash,
  IconPlus,
  IconArrowsMoveVertical,
} from '@tabler/icons-react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import {
  sortByPropertyWithHighDistribution,
  muscleToColor,
  shuffle,
} from './utils'
import SelectModal from './SelectModal'
import VideoIcon from './VideoIcon'
import InfoCard from '../InfoCard'

const fetcher = (query) =>
  fetch(`/api/exercises${query}`).then((res) => res.json())

const Exercises = ({
  equipment,
  muscles,
  workout,
  setWorkout,
  difficulties,
}) => {
  const { colorScheme } = useMantineColorScheme()
  const defaultCount = Math.round(6 / muscles.length) || 1 // default around 6 exercises
  const sortedEquipments = equipment.sort().join(',')
  const sortedMuscles = muscles.sort().join(',')
  const query = `?equipment=${sortedEquipments}&muscles=${sortedMuscles}`
  const {
    data = [],
    error,
    isLoading,
  } = useSWR(`/exercises${query}`, () => fetcher(query))
  const [opened, { open, close }] = useDisclosure(false)
  const [defaultSelected, setDefaultSelected] = useState()
  const [exerciseIndex, setExerciseIndex] = useState()
  const exerciseData = difficulties.length
    ? data.filter((d) => difficulties.includes(d.difficulty))
    : data

  useEffect(() => {
    // first load
    if (exerciseData.length && !workout.length) {
      const exercises = shuffle(exerciseData).reduce((acc, curr) => {
        if (
          acc.filter((e) => e.mainMuscle === curr.mainMuscle).length <
          defaultCount
        ) {
          return [...acc, curr]
        } else {
          return acc
        }
      }, [])
      const sortedArray = sortByPropertyWithHighDistribution(
        exercises,
        'mainMuscle'
      )

      setWorkout(sortedArray)
    }
  }, [exerciseData, defaultCount, workout, setWorkout])

  const shuffleExercise = (exercise) => {
    const newExercise = shuffle(exerciseData)
      .filter((e) => e.mainMuscle === exercise.mainMuscle)
      .find((e) => !workout.find((w) => w._id === e._id))

    const newWorkout = [...workout]
    newWorkout[workout.findIndex((w) => w._id === exercise._id)] = newExercise

    setWorkout(newWorkout)
  }

  const selectExercise = (exercise) => {
    const index = workout.findIndex((w) => w._id === exercise._id)

    setDefaultSelected(exercise.mainMuscle)
    setExerciseIndex(index)

    open()
  }

  const removeExercise = (exercise) => {
    const newWorkout = workout.filter((w) => w._id !== exercise._id)

    setWorkout(newWorkout)
  }

  const addNewExercise = () => {
    setDefaultSelected(null)
    setExerciseIndex(null)

    open()
  }

  const onDragEnd = (result) => {
    if (!result.destination) return

    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index

    const newList = Array.from(workout)
    const [movedExercise] = newList.splice(sourceIndex, 1)

    newList.splice(destinationIndex, 0, movedExercise)

    const updatedList = newList.map((exercise, index) => ({
      ...exercise,
      sort: index + 1,
    }))

    setWorkout(updatedList)
  }

  return (
    <div>
      <InfoCard>
        Keep Workout.lol free. Support us by making a{' '}
        <a
          href='https://ko-fi.com/workout_lol'
          target='_blank'
          rel='noopener noreferrer'
        >
          donation.
        </a>
      </InfoCard>
      <Flex justify='space-between' mt='xl' direction='column'>
        {(isLoading || !workout.length) && (
          <Box
            sx={{
              paddingLeft: 10,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              justifyItems: 'center',
              borderLeft: '2px solid lightgrey',
            }}
          >
            {[...Array(6)].map((_, i) => (
              <Flex
                key={i}
                mb={20}
                align={{ base: 'flex-start', xs: 'center' }}
                direction={{ base: 'column', xs: 'row' }}
              >
                <Flex
                  sx={{ width: '100%' }}
                  align='center'
                  mb={{ base: 10, sm: 0 }}
                >
                  <Skeleton height={27} width={35} mr={5} />
                  <Skeleton
                    height={20}
                    width={i % 2 === 0 ? '50%' : '60%'}
                    mr={10}
                  />
                  <Skeleton height={20} width={20} mr={5} />
                </Flex>
                <Flex justify=''>
                  <Skeleton height={20} width={80} mr='xs' />
                  <Skeleton height={20} width={80} mr='xs' />
                  <Skeleton height={22} width={22} />
                </Flex>
              </Flex>
            ))}
          </Box>
        )}
        {!isLoading && !!workout.length && (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId='exercises'>
              {(provided) => (
                <div style={{ width: '100%' }}>
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {workout.map((exercise, index) => (
                      <Flex align='center' key={exercise._id}>
                        <Draggable
                          draggableId={exercise._id}
                          index={index}
                          key={exercise._id}
                        >
                          {(draggableProvided, snapshot) => {
                            return (
                              <Flex
                                sx={{
                                  flex: 1,
                                  ...draggingStyle(
                                    snapshot.isDragging,
                                    colorScheme === 'dark'
                                  ),
                                  paddingLeft: 10,
                                }}
                                align={{ base: 'flex-start', xs: 'center' }}
                                direction={{ base: 'column', xs: 'row' }}
                                ref={draggableProvided.innerRef}
                                {...draggableProvided.dragHandleProps}
                                {...draggableProvided.draggableProps}
                              >
                                <Flex
                                  align='center'
                                  py={{
                                    base: 15,
                                  }}
                                  justify='space-between'
                                >
                                  <Flex justify='center' mr={2}>
                                    <IconArrowsMoveVertical size='1rem' />
                                  </Flex>
                                  <Tooltip label={exercise.mainMuscle}>
                                    <ThemeIcon
                                      sx={{ cursor: 'pointer' }}
                                      size={22}
                                      variant='light'
                                      color={muscleToColor[exercise.mainMuscle]}
                                      radius='xl'
                                    >
                                      {exercise.mainMuscle.slice(0, 1)}
                                    </ThemeIcon>
                                  </Tooltip>
                                  <Flex
                                    sx={{ cursor: 'default' }}
                                    align='center'
                                  >
                                    <Text ml={5} mr='xs' fw={500}>
                                      {exercise.title}
                                    </Text>
                                    <VideoIcon url={exercise.videos[0]} />
                                  </Flex>
                                </Flex>

                                <Flex
                                  justify='flex-end'
                                  pb={{
                                    base: 15,
                                    sm: 0,
                                  }}
                                  sx={{
                                    flex: 1,
                                  }}
                                >
                                  <Button
                                    compact
                                    variant='light'
                                    color='blue'
                                    mr='xs'
                                    onClick={() => shuffleExercise(exercise)}
                                    leftIcon={<IconArrowsShuffle size='1rem' />}
                                    disabled={
                                      workout.filter(
                                        (e) =>
                                          e.mainMuscle === exercise.mainMuscle
                                      ).length ===
                                      exerciseData.filter(
                                        (e) =>
                                          e.mainMuscle === exercise.mainMuscle
                                      ).length
                                    }
                                  >
                                    Shuffle
                                  </Button>
                                  <Button
                                    compact
                                    variant='light'
                                    color='blue'
                                    mr='xs'
                                    onClick={() => selectExercise(exercise)}
                                    leftIcon={<IconClick size='1rem' />}
                                  >
                                    Pick
                                  </Button>
                                  <ActionIcon
                                    variant='outline'
                                    color='red'
                                    size='sm'
                                    onClick={() => removeExercise(exercise)}
                                  >
                                    <IconTrash size='1rem' />
                                  </ActionIcon>
                                </Flex>
                              </Flex>
                            )
                          }}
                        </Draggable>
                      </Flex>
                    ))}
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}

        <Flex>
          <Button
            compact
            variant='light'
            color='blue'
            leftIcon={
              <ThemeIcon
                color='blue'
                radius='xl'
                size={22}
                onClick={addNewExercise}
                style={{ cursor: 'pointer' }}
              >
                <IconPlus size='0.8rem' />
              </ThemeIcon>
            }
            onClick={addNewExercise}
          >
            Add
          </Button>
        </Flex>
      </Flex>
      <Modal opened={opened} onClose={close} title='Choose Exercise'>
        <SelectModal
          exercises={exerciseData}
          workout={workout}
          setWorkout={setWorkout}
          close={close}
          defaultMuscle={defaultSelected}
          index={exerciseIndex}
        />
      </Modal>
    </div>
  )
}

// todo
const draggingStyle = (isDragging, isDarkMode) => ({
  background: isDragging ? (isDarkMode ? '#1A1B1E' : '#f1f3f5') : 'transparent',
  border: isDragging ? '1px dashed #ddd' : 'none',
  boxShadow: isDragging ? '0px 4px 8px rgba(0, 0, 0, 0.1)' : 'none',
  transition:
    'background-color 0.2s ease, border 0.2s ease, box-shadow 0.2s ease',
  borderLeft: isDragging
    ? isDarkMode
      ? '2px solid #373A40'
      : '2px solid #d0ebff'
    : isDarkMode
    ? '2px solid #1A1B1E'
    : '2px solid #e7f5ff',
})
export default Exercises
