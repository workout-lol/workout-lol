import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Group, Button, Stepper } from '@mantine/core'
import { v4 as uuidv4 } from 'uuid'

import Equipment from '../components/Equipment'
import Muscles from '../components/Muscles/Muscles'
import Exercises from '../components/Exercises/Exercises'
import Workout from '../components/Workout'
import Layout from '../components/Layout/Layout'
import useAccount from '../utils/useAccount'
import useWorkout from '../utils/useWorkout'

export default function Home() {
  const router = useRouter()
  const [account = {}, setAccount] = useAccount()
  const { data: user = {} } = account

  const equipment = user.equipment || []
  const repeatWorkoutId = router.query && router.query.repeat_id
  const repeatWorkout = (user.workouts || []).find(
    (w) => w.id === repeatWorkoutId
  )
  const shareWorkoutId = router.query && router.query.share_id
  const { data: shareWorkout, isLoading } = useWorkout(shareWorkoutId)

  const [active, setActive] = useState(0)
  const [difficulties, setDifficulties] = useState([])
  const [error, setError] = useState()
  const nextStep = () => {
    if (active === 2) {
      saveWorkout()
    }
    setActive((current) => (current < 3 ? current + 1 : current))
  }
  const jumpToStep = (step) => {
    const isFirstStep = active === 0
    const hasEquipment = equipment.length > 0
    const isSecondStep = active === 1
    const hasMuscles = muscles.length > 0

    if (isFirstStep && !hasEquipment) return
    if (isSecondStep && !hasMuscles && step === 2) return
    if ((active !== 2 || muscles.length > 0) && active !== 3) {
      setActive(step)
    }
  }
  const [muscles, setMuscles] = useState([])
  const [workout, setWorkout] = useState([])

  const initializeWorkout = (prevWorkout) => {
    setWorkout(
      prevWorkout.exercises.map((e) => ({
        ...e,
        completed: false,
        sets: [],
      }))
    )
    setMuscles([...new Set(prevWorkout.exercises.map((e) => e.mainMuscle))])
    setActive(2)
  }

  const clearUrl = () => {
    const { pathname, query } = router
    delete router.query.repeat_id
    delete router.query.share_id
    router.replace({ pathname, query }, undefined, { shallow: true })
  }

  useEffect(() => {
    if (repeatWorkout && !workout.length) {
      initializeWorkout(repeatWorkout)
      clearUrl()
    } else if (shareWorkout && !shareWorkout.error && !workout.length) {
      initializeWorkout(shareWorkout)
      clearUrl()
    } else if (shareWorkout && shareWorkout.error) {
      setError(shareWorkout.error)
      clearUrl()
    }
  }, [repeatWorkout, shareWorkout, workout, router])

  const updateEquipment = (update) => {
    setAccount({ ...user, equipment: update })
  }

  const saveWorkout = () => {
    const today = new Date().toISOString()
    const allWorkouts = user.workouts || []

    const newWorkouts = [
      ...allWorkouts,
      {
        id: uuidv4(),
        created_at: today,
        exercises: workout.map((e) => ({
          id: e._id,
          completed: false,
          sets: [],
        })),
      },
    ]

    setAccount({ ...user, workouts: newWorkouts })
  }

  const saveForLater = () => {
    saveWorkout()
    router.push('/profile')
  }

  const updateProgress = ({ index, sets, note }) => {
    const allWorkouts = (user.workouts || []).sort((a, b) =>
      a.created_at.localeCompare(b.created_at)
    )
    const latestWorkout = allWorkouts[allWorkouts.length - 1]
    latestWorkout.exercises[index].completed = true
    latestWorkout.exercises[index].sets = sets
    latestWorkout.exercises[index].note = note

    setAccount({ ...user, workouts: allWorkouts })
  }

  const nextDisabled =
    (active === 0 && equipment.length === 0) ||
    (active === 1 && muscles.length === 0) ||
    (active === 2 && workout.length === 0)

  return (
    <Layout isFetching={isLoading} error={error} setError={setError}>
      <Stepper active={active} onStepClick={jumpToStep} breakpoint='sm'>
        <Stepper.Step label='Equipment' description='Select your equipment'>
          <Equipment {...{ equipment, updateEquipment }} />
        </Stepper.Step>
        <Stepper.Step label='Muscles' description='Choose your training'>
          <Muscles
            {...{
              muscles,
              setMuscles,
              workout,
              setWorkout,
              equipment,
              setDifficulties,
              difficulties,
            }}
          />
        </Stepper.Step>
        <Stepper.Step label='Exercises' description='Customize your workout'>
          <Exercises
            {...{ equipment, muscles, workout, setWorkout, difficulties }}
          />
        </Stepper.Step>
        <Stepper.Completed>
          <Workout {...{ workout, updateProgress, user }} />
        </Stepper.Completed>
      </Stepper>

      {active !== 3 && (
        <Group position='center' mt='xl'>
          {active === 2 && (
            <Button
              variant='outline'
              onClick={saveForLater}
              disabled={nextDisabled}
            >
              Save for later
            </Button>
          )}
          <Button onClick={nextStep} disabled={nextDisabled}>
            {active === 2 ? 'Start Workout' : 'Continue'}
          </Button>
        </Group>
      )}
    </Layout>
  )
}
