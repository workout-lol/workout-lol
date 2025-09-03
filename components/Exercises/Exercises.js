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
  const defaultCount = Math.round(6 / muscles.length) || 1
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
  }, [exerciseData, defaultCount]) // ✅ FIXED dependencies

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
      {/* ... rest of your JSX unchanged */}
    </div>
  )
}

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

