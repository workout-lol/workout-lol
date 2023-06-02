import React from 'react'
import { Text } from '@mantine/core'
import Illustration from './Illustration'
import styles from './Muscles.module.css'

const Muscles = ({ muscles, setMuscles, workout, setWorkout }) => {
  const toggleMuscle = id => {
    muscles.includes(id)
      ? setMuscles(muscles.filter(e => e!== id))
      : setMuscles([...muscles, id])

    if (workout.length) {
      setWorkout([]) // reset on muscle change
    }
  }
  return <div className={styles.svgContainer}>
    <Text fs="italic" ta="center" mb="lg">
      Select the muscles you would like to train. (2-3 recommended)
    </Text>
    <Illustration toggleMuscle={toggleMuscle} muscles={muscles} />
    {/* list muscles ?? */}
  </div>
}

export default Muscles
