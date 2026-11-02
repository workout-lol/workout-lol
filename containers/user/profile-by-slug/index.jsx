import React from 'react'
import { Text } from '@mantine/core'
import WorkoutTable from '../../../components/WorkoutTable/WorkoutTable'
import Calendar from '../../../components/Calendar/Calendar'

const ProfileBySlug = ({ workouts }) => {
  const hasWorkouts = workouts.length > 0
  const favoriteWorkouts = workouts.filter((w) => w.favorite)

  return (
    <div>
      {workouts.length === 0 && (
        <Text mt='lg' mb='md' fw='bold'>
          No workouts yet...
        </Text>
      )}

      {hasWorkouts && (
        <>
          <Calendar variant='full' workouts={workouts} />
          {favoriteWorkouts.length > 0 && (
            <>
              <Text mt='lg' mb='md' fw='bold'>
                ⭐ Favorite Workouts [{favoriteWorkouts.length}]
              </Text>
              <WorkoutTable workouts={favoriteWorkouts} viewOnly />
            </>
          )}
          <Text mt='lg' mb='md' fw='bold'>
            💪 Workout History [{workouts.length}]
          </Text>
          <WorkoutTable workouts={workouts} viewOnly />
        </>
      )}
    </div>
  )
}

export default ProfileBySlug
