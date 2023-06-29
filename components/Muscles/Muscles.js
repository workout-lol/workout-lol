import React from 'react'
import useSWR from 'swr'
import { Text } from '@mantine/core'
import Illustration from './Illustration'
import FullscreenLoader from '../../components/FullscreenLoader'
import styles from './Muscles.module.css'


const fetcher = query => fetch(`${process.env.NEXT_PUBLIC_API}/api/muscles${query}`)
  .then(res => res.json())

const Muscles = ({ muscles, setMuscles, workout, setWorkout, equipment = [] }) => {
  const sortedEquipments = equipment.sort().join(',')
  const query = `?equipment=${sortedEquipments}`
  const { data = [], error, isLoading } = useSWR(`/muscles${query}`, () => fetcher(query))

  const toggleMuscle = id => {
    muscles.includes(id)
      ? setMuscles(muscles.filter(e => e!== id))
      : setMuscles([...muscles, id])

    if (workout.length) {
      setWorkout([]) // reset on muscle change
    }
  }
  return <div className={styles.svgContainer}>
    <FullscreenLoader isVisible={isLoading} />
    <Text fs="italic" ta="center" mb="lg">
      Select the muscles you would like to train. (2-3 recommended)
    </Text>
    <Illustration toggleMuscle={toggleMuscle} muscles={muscles} exerciseCount={data} isLoading={isLoading} />
    {/* list muscles ?? */}
  </div>
}

export default Muscles
