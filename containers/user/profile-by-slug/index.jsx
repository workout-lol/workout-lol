import React from 'react'
import { Text } from '@mantine/core'
import WorkoutTable from '../../../components/WorkoutTable/WorkoutTable'
import Calendar from '../../../components/Calendar/Calendar'

const ProfileBySlug = ({ workouts }) => {
  const hasWorkouts = workouts.length > 0

  return (
    <div>
      {workouts.length === 0 && (
        <Text mt='lg' mb='md' fw='bold'>
          No workouts yet...
        </Text>
      )}

      {hasWorkouts && (
        <>
          <Text mt='lg' mb='md' fw='bold'>
            💪 Workout History [{workouts.length}]
          </Text>
          <Calendar variant='full' workouts={workouts} />
          <WorkoutTable workouts={workouts} viewOnly />
        </>
      )}
    </div>
  )
}

export default ProfileBySlug
