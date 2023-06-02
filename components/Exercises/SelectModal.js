import React from 'react'
import { Button, Flex, Accordion } from '@mantine/core';
// import { muscleToColor } from './utils'
import VideoIcon from './VideoIcon'

// const difficulties = ['Beginner', 'Intermediate', 'Advanced']

const SelectModal = ({ exercises, workout, setWorkout, defaultMuscle, index, close }) => {
  const allMuscles = [...new Set(exercises.map(e => e.mainMuscle))].sort()

  const selectExercise = e => {
    if (index === 0 || !!index) {
      const newWorkout = [
        ...workout.slice(0, index), e, ...workout.slice(index + 1)
      ]
      setWorkout(newWorkout)
    } else {
      setWorkout([...workout, e])
    }
    close()
  }

  return <div>
    <Accordion defaultValue={defaultMuscle}>
      { allMuscles.map(muscle =>
        <Accordion.Item key={muscle} value={muscle}>
          <Accordion.Control>{muscle}</Accordion.Control>
          <Accordion.Panel>
            { exercises
              .filter(e => e.mainMuscle === muscle)
              .map((exercise) => <Flex key={`full-list-${exercise._id}`} mb="sm">
                <Button
                  mr="xs"
                  compact
                  variant="subtle"
                  // disabled={workout.some(w => w._id === exercise._id)}
                  onClick={() => selectExercise(exercise)}
                >
                  {exercise.title}
                </Button>
                <VideoIcon url={exercise.videos[0]}/>
              </Flex> )}
          </Accordion.Panel>
        </Accordion.Item>
      )}
    </Accordion>
  </div>
}

export default SelectModal
