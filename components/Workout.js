import React, { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import {
  useMantineColorScheme,
  Text,
  Timeline,
  Flex,
  Button,
  List,
  Input,
  Tooltip,
  Title,
  Box,
  AspectRatio,
  LoadingOverlay,
  Modal,
} from '@mantine/core'
import { IconCheck, IconAlertCircle } from '@tabler/icons-react'
import party from 'party-js'
import InfoCard from './InfoCard'
import { randomId } from '@mantine/hooks'

const NOTE_NOT_SET = {}

const RepInput = ({ index, handleChange, sets, prevSet }) => (
  <Input
    placeholder={`${index + 1}. Set`}
    maxLength={6}
    w={prevSet ? 90 : 70}
    mr='sm'
    onChange={(e) => handleChange(e.target.value, index)}
    value={sets[index] || ''}
    disabled={index !== 0 && !sets[index - 1]} // enable if prev was filled
    rightSection={
      prevSet ? (
        <Tooltip
          label={`Last time you did ${prevSet}`}
          position='top-end'
          withArrow
        >
          <div>
            <IconAlertCircle
              size='0.8rem'
              style={{ display: 'block', opacity: 0.5 }}
            />
          </div>
        </Tooltip>
      ) : null
    }
  />
)

const ExerciseVideo = ({ video, sx, ...rest }) => {
  const [isReady, setIsReady] = useState(false)

  function handleVideoReady() {
    setIsReady(true)
  }

  return (
    <>
      <AspectRatio
        ratio={16 / 9}
        // w={250}
        sx={{
          margin: '.5em 2em 1em 0',
          borderRadius: '0.25rem',
          overflow: 'hidden',
          cursor: 'pointer',
          width: '100%',
          ...sx,
        }}
        {...rest}
      >
        <LoadingOverlay visible={!isReady} />
        <video
          src={video}
          key={video}
          playsInline
          muted
          autoPlay
          loop
          onLoadedData={handleVideoReady}
        />
      </AspectRatio>
    </>
  )
}

const ActiveExercise = ({
  exercise,
  changeStep,
  handleChange,
  setNote,
  sets,
  note,
  user,
  active,
}) => {
  const workouts =
    user &&
    (user.workouts || [])
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(1) // remove first (active) workout

  const allCompletetExercises = workouts
    .map((w) => w.exercises)
    .flat()
    .filter((e) => e.completed)

  const prevExercise =
    allCompletetExercises.find((e) => e._id === exercise._id) || {}
  const prevSets = prevExercise.sets || []
  if (note == NOTE_NOT_SET) {
    note = prevExercise.note || ''
    setNote(note)
  }
  const [opened, setOpened] = useState(false)

  return (
    <>
      <Text mr='xs' fw={500}>
        {exercise.title}
      </Text>
      {/* idea - display clock button which triggers eine stop clock */}

      {active !== 0 && (
        <Button
          onClick={() => changeStep(-1)}
          variant='outline'
          size='xs'
          my='xs'
        >
          Prev Exercise
        </Button>
      )}

      <Flex direction={{ base: 'column', xs: 'row' }}>
        {exercise.videos.map((video) => (
          <ExerciseVideo
            key={randomId()}
            video={video}
            onClick={() => setOpened(true)}
          />
        ))}
      </Flex>
      <Modal
        withOverlay
        withinPortal
        opened={opened}
        onClose={() => setOpened(false)}
        centered
        withCloseButton={false}
        size='100%'
      >
        <Flex direction={{ base: 'column', xs: 'row' }} w='100%' gap='md'>
          {exercise.videos.map((video) => (
            <ExerciseVideo
              key={randomId()}
              video={video}
              sx={{ margin: 0, width: '100%' }}
              w={'100%'}
            />
          ))}
        </Flex>
      </Modal>
      <List type='ordered' mb='md'>
        {exercise.steps.map((step) => (
          <List.Item key={step}>{step}</List.Item>
        ))}
      </List>

      <Flex direction={{ base: 'column', xs: 'row' }}>
        <Flex mb={{ base: 'sm', xs: 0 }}>
          <RepInput
            index={0}
            handleChange={handleChange}
            sets={sets}
            prevSet={prevSets[0]}
          />
          <RepInput
            index={1}
            handleChange={handleChange}
            sets={sets}
            prevSet={prevSets[1]}
          />
          <RepInput
            index={2}
            handleChange={handleChange}
            sets={sets}
            prevSet={prevSets[2]}
          />
        </Flex>
        <Input
          placeholder='your notes, like weights'
          value={note}
          onChange={(e) => setNote(e.target.value)}
          mr='sm'
        />
        <Button onClick={() => changeStep(1)}>Next Exercise</Button>
      </Flex>
    </>
  )
}

const Workout = ({ workout, updateProgress, user }) => {
  const { colorScheme } = useMantineColorScheme()
  const confettiDom = useRef(null)
  const [active, setActive] = useState(0)
  const [sets, setSets] = useState([])
  const [note, setNote] = useState(NOTE_NOT_SET)

  const handleChange = (value, index) => {
    const newSets = [...sets.slice(0, index), value, ...sets.slice(index + 1)]
    setSets(newSets)
  }

  const changeStep = (update) => {
    const userWorkout = (user.workouts || []).sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    )[0]
    const newIndex = active + update

    updateProgress({ index: active, sets, note })
    setSets((userWorkout.exercises[newIndex] || {}).sets || [])
    setNote((userWorkout.exercises[newIndex] || {}).note || NOTE_NOT_SET)
    setActive(newIndex)

    if (active === workout.length - 1 && update > 0) {
      party.confetti(confettiDom.current, { count: 40 })
    }
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
      {active < workout.length && (
        <Timeline bulletSize={24} lineWidth={2} active={active}>
          {workout.map((exercise, index) =>
            index === active ? (
              <Timeline.Item
                key={exercise._id}
                bullet={
                  colorScheme === 'dark' && (
                    <div
                      style={{
                        background: '#1A1B1E',
                        width: '20px',
                        height: '20px',
                        borderRadius: ' 50%',
                      }}
                    ></div>
                  )
                }
              >
                <ActiveExercise
                  exercise={exercise}
                  handleChange={handleChange}
                  setNote={setNote}
                  sets={sets}
                  note={note}
                  changeStep={changeStep}
                  user={user}
                  active={active}
                />
              </Timeline.Item>
            ) : (
              <Timeline.Item
                key={exercise._id}
                bullet={active > index && <IconCheck />}
              >
                <Text mr='xs' fw={500}>
                  {exercise.title}
                </Text>
              </Timeline.Item>
            )
          )}
        </Timeline>
      )}

      <Flex
        direction='column'
        align='center'
        style={{ display: active === workout.length ? 'flex' : 'none' }}
      >
        <Title mt='lg' ref={confettiDom}>
          Workout completed!
        </Title>
        <Image
          mb='md'
          src='/trophy.png'
          alt='illustration of a trophy'
          width={300}
          height={300}
        />
        <Text>Congrats, you completed your workout! 🎉</Text>
        <Text>
          Check your <Link href='/profile'>profile</Link> to see your progress
          and to repeat workouts.
        </Text>
      </Flex>
    </div>
  )
}

export default Workout
