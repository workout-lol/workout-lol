import React from 'react'
import useSWR from 'swr'
import { Text, MultiSelect } from '@mantine/core'
import Illustration from './Illustration'
import FullscreenLoader from '../../components/FullscreenLoader'
import styles from './Muscles.module.css'

const difficultyData = ['Beginner', 'Intermediate', 'Advanced']

const fetcher = (query) =>
  fetch(`/api/muscles${query}`).then((res) => res.json())

const Muscles = ({
  muscles,
  setMuscles,
  workout,
  setWorkout,
  equipment = [],
  setDifficulties,
  difficulties = [],
}) => {
  const sortedEquipments = equipment.sort().join(',')
  const query = `?equipment=${sortedEquipments}`
  const {
    data = [],
    error,
    isLoading,
  } = useSWR(`/muscles${query}`, () => fetcher(query))
  const muscleData = (
    difficulties.length
      ? data.map((d) => ({
          ...d,
          count: difficulties.reduce(
            (acc, curr) => acc + (d[curr.toLowerCase()] || 0),
            0
          ),
        }))
      : data
  ).filter((d) => d.count > 0)

  const toggleMuscle = (id) => {
    muscles.includes(id)
      ? setMuscles(muscles.filter((e) => e !== id))
      : setMuscles([...muscles, id])

    if (workout.length) {
      setWorkout([]) // reset on muscle change
    }
  }
  return (
    <div className={styles.svgContainer}>
      <FullscreenLoader isVisible={isLoading} />
      {/* hide difficulty levels
      <MultiSelect
        mb='md'
        data={difficultyData}
        label='Difficulty'
        placeholder='Pick all that you like (optional)'
        onChange={setDifficulties}
      />
      */}
      <Text fs='italic' ta='center' mb='lg'>
        Select the muscles you would like to train. (2-3 recommended)
      </Text>
      <Illustration
        toggleMuscle={toggleMuscle}
        muscles={muscles}
        exerciseCount={muscleData}
      />
      {/* list muscles ?? */}
    </div>
  )
}

export default Muscles
