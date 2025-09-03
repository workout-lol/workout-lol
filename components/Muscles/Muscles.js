import React, { useMemo, useCallback } from 'react'
import useSWR from 'swr'
import { Text /*, MultiSelect */ } from '@mantine/core'
import Illustration from './Illustration'
import FullscreenLoader from '../../components/FullscreenLoader'
import styles from './Muscles.module.css'

const difficultyData = ['Beginner', 'Intermediate', 'Advanced']

// SWR fetcher expects full URL as key
const fetcher = (url) => fetch(url).then((res) => {
  if (!res.ok) throw new Error('Failed to load muscles')
  return res.json()
})

const Muscles = ({
  muscles = [],
  setMuscles,
  workout = [],
  setWorkout,
  equipment = [],
  setDifficulties,
  difficulties = [],
}) => {
  // Clone equipment to avoid mutating props
  const sortedEquipments = useMemo(
    () => (Array.isArray(equipment) ? [...equipment].sort().join(',') : ''),
    [equipment]
  )

  const query = useMemo(() => `/api/muscles?equipment=${encodeURIComponent(sortedEquipments)}`, [sortedEquipments])

  const { data = [], error, isLoading } = useSWR(query, fetcher, { revalidateOnFocus: false })

  // Derive counts optionally filtered by difficulty
  const muscleData = useMemo(() => {
    const base = Array.isArray(data) ? data : []
    const withCounts = (difficulties?.length
      ? base.map((d) => ({
          ...d,
          count: difficulties.reduce(
            (acc, curr) => acc + (d?.[String(curr).toLowerCase()] || 0),
            0
          ),
        }))
      : base)
    return withCounts.filter((d) => (d?.count ?? 0) > 0)
  }, [data, difficulties])

  const toggleMuscle = useCallback((id) => {
    if (!setMuscles) return
    if (muscles.includes(id)) {
      setMuscles(muscles.filter((e) => e !== id))
    } else {
      setMuscles([...muscles, id])
    }
    if (workout?.length && setWorkout) setWorkout([])
  }, [muscles, setMuscles, workout, setWorkout])

  return (
    <div className={styles.svgContainer}>
      <FullscreenLoader isVisible={isLoading} />

      {/* Keep difficulty selector hidden
      <MultiSelect
        mb="md"
        data={difficultyData}
        label="Difficulty"
        placeholder="Pick all that you like (optional)"
        onChange={setDifficulties}
      />
      */}

      <Text fs="italic" ta="center" mb="lg">
        Select the muscles you would like to train. (2–3 recommended)
      </Text>

      {error ? (
        <Text c="red" ta="center" role="alert">Failed to load muscles. Please check your API.</Text>
      ) : (
        <Illustration
          toggleMuscle={toggleMuscle}
          selectedMuscles={muscles}
          exerciseCount={muscleData}
        />
      )}
    </div>
  )
}

export default Muscles
