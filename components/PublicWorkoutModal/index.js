import React, { useState, useEffect } from 'react'
import { Button, Image, Flex, Group } from '@mantine/core'
import toast from 'react-hot-toast'
import Equipment from '../Equipment'
import Muscles from '../Muscles/Muscles'
import Exercises from '../Exercises/Exercises'
import PublicWorkout from '../PublicWorkout'
import { createPublicWorkout } from '../../utils/usePublicWorkouts'

const PublicWorkoutModal = ({ account, close }) => {
  const [step, setStep] = useState(0)
  const [equipment, setEquipment] = useState([])
  const [muscles, setMuscles] = useState([])
  const [workout, setWorkout] = useState([])
  const [difficulties, setDifficulties] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (
      account &&
      !account.isLoading &&
      (account.data.workouts || []).length === 0 &&
      step === 0
    ) {
      // skip first step if user has no workouts
      setStep(1)
    }
  }, [account, step])

  const createWorkout = async () => {
    setIsLoading(true)
    try {
      const usedEquipment = [...new Set(workout.map((e) => e.equipment).flat())]
      const usedMuscles = [...new Set(workout.map((e) => e.mainMuscle))]
      const usedDifficulties = [...new Set(workout.map((e) => e.difficulty))]
      await createPublicWorkout({
        name,
        description,
        exercises: workout.map((w) => w._id),
        equipment: usedEquipment,
        muscles: usedMuscles,
        difficulty: usedDifficulties,
      })
    } catch (e) {
      toast.error('Something went wrong - please try again or contact support.')
    }

    toast.success('Public workout has been created.')
    setIsLoading(false)
    close()
    // todo re-fetch public workouts
  }

  if (step === 0) {
    return (
      <Flex justify='space-evenly' my='md'>
        <Button
          variant='light'
          onClick={() => {}}
          mx='md'
          styles={(theme) => ({
            root: {
              height: 150,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            },
          })}
        >
          <Image
            width={100}
            height={100}
            fit='contain'
            radius='md'
            src={`/list-illustration.png`}
            alt='Illustration'
            caption='Use existing'
          />
        </Button>

        <Button
          variant='light'
          onClick={() => setStep(1)}
          mx='md'
          styles={(theme) => ({
            root: {
              height: 150,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            },
          })}
        >
          <Image
            width={100}
            height={100}
            fit='contain'
            radius='md'
            src={`/create-illustration.png`}
            alt='Illustration'
            caption='Create new'
          />
        </Button>
      </Flex>
    )
  }

  if (step === 1) {
    return (
      <div style={{ maxWidth: '600px' }}>
        <Equipment equipment={equipment} updateEquipment={setEquipment} />
        <Group position='center' mt='xl'>
          {(account.data.workouts || []).length > 0 && (
            <Button variant='outline' onClick={() => setStep(0)}>
              Back
            </Button>
          )}
          <Button onClick={() => setStep(2)} disabled={equipment.length === 0}>
            Continue
          </Button>
        </Group>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div>
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
        <Group position='center' mt='xl'>
          <Button variant='outline' onClick={() => setStep(1)}>
            Back
          </Button>
          <Button onClick={() => setStep(3)} disabled={muscles.length === 0}>
            Continue
          </Button>
        </Group>
      </div>
    )
  }

  if (step === 3) {
    return (
      <div>
        <Exercises
          {...{ equipment, muscles, workout, setWorkout, difficulties }}
        />

        <Group position='center' mt='xl'>
          <Button variant='outline' onClick={() => setStep(2)}>
            Back
          </Button>
          <Button onClick={() => setStep(4)} disabled={workout.length === 0}>
            Continue
          </Button>
        </Group>
      </div>
    )
  }

  if (step === 4) {
    return (
      <div style={{ minWidth: '300px' }}>
        <PublicWorkout
          {...{ workout, name, setName, description, setDescription }}
        />
        <Group position='center' mt='xl'>
          <Button
            variant='outline'
            onClick={() => setStep(3)}
            disabled={isLoading}
          >
            Back
          </Button>
          <Button
            onClick={createWorkout}
            disabled={!name || isLoading}
            loading={isLoading}
          >
            Create Workout
          </Button>
        </Group>
      </div>
    )
  }

  return <></>
}

export default PublicWorkoutModal
