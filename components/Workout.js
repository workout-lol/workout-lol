import React, { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Text, Timeline, Flex, Paper, Button, List, Input, Tooltip, Title } from '@mantine/core'
import { IconCheck, IconAlertCircle } from '@tabler/icons-react'
import party from "party-js"

const RepInput = ({ index, handleChange, sets, prevSet }) => <Input
  placeholder={`${index + 1}. Set`}
  maxLength={6}
  w={prevSet ? 90 : 70} mr="sm"
  onChange={e => handleChange(e.target.value, index)}
  disabled={index !== 0 && !sets[index - 1]} // enable if prev was filled
  rightSection={prevSet
    ? <Tooltip label={`Last time you did ${prevSet}`} position="top-end" withArrow>
      <div>
        <IconAlertCircle size="0.8rem" style={{ display: 'block', opacity: 0.5 }} />
      </div>
    </Tooltip>
    : null
  } />

const ActiveExercise = ({ exercise, goNext, handleChange, sets, user }) => {
  const workouts = user.workouts
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(1) // remove first (active) workout

  const allCompletetExercises = workouts
    .map(w => w.exercises).flat()
    .filter(e => e.completed)

  const prevExercise = allCompletetExercises.find(e => e._id === exercise._id) || {}
  const prevSets = prevExercise.sets || []

  return <>
      <Text mr="xs" fw={500}>{exercise.title}</Text>
      {/* idea - display clock button which triggers eine stop clock */}

      <Flex direction={{ base: 'column', xs: 'row' }}>
        { exercise.videos.map(video => <video
          src={video}
          key={video}
          playsInline
          muted
          autoPlay
          loop
          width="auto"
          height="130px"
          style={{ margin: '.5em 2em 1em 0', borderRadius: '0.25rem' }} />)}
      </Flex>

      <List type="ordered" mb="md">
        { exercise.steps.map(step => <List.Item key={step}>{step}</List.Item>)}
      </List>

      <Flex direction={{ base: 'column', xs: 'row' }}>
        <Flex mb={{ base: 'sm', xs: 0 }}>
          <RepInput index={0} handleChange={handleChange} sets={sets} prevSet={prevSets[0]} />
          <RepInput index={1} handleChange={handleChange} sets={sets} prevSet={prevSets[1]} />
          <RepInput index={2} handleChange={handleChange} sets={sets} prevSet={prevSets[2]} />
        </Flex>
        <Button onClick={goNext}>Next Exercise</Button>
      </Flex>
    </>
}

const Workout = ({ workout, updateProgress, user }) => {
  const confettiDom = useRef(null)
  const [active, setActive] = useState(0)
  const [sets, setSets] = useState([])

  const handleChange = (value, index) => {
    const newSets = [
      ...sets.slice(0, index),
      value,
      ...sets.slice(index + 1)
    ]
    setSets(newSets)
  }

  const goNext = () => {
    updateProgress({ index: active, sets })
    setActive(active + 1)
    setSets([])

    if (active === workout.length - 1) {
      party.confetti(confettiDom.current, { count: 40 })
    }
  }

  return <div>
    <Paper shadow="none" p="xs" mb="xl" bg="#f1f3f5">
      <Text fs="italic">Disclaimer: All exercises and videos are taken from <a href="https://musclewiki.com/" target="_blank" rel="noopener noreferrer">musclewiki.com</a></Text>
    </Paper>
    { active < workout.length && <Timeline bulletSize={24} lineWidth={2} active={active}>
      { workout.map((exercise, index) => index === active
        ? <Timeline.Item key={exercise._id}>
          <ActiveExercise exercise={exercise} handleChange={handleChange} sets={sets} goNext={goNext} user={user}/>
        </Timeline.Item>
        : <Timeline.Item key={exercise._id} bullet={active > index && <IconCheck />}>
          <Text mr="xs" fw={500}>{exercise.title}</Text>
        </Timeline.Item> )}
    </Timeline> }

    <Flex direction="column" align="center" style={{ display: active === workout.length ? 'flex' : 'none' }}>
      <Title mt="lg" ref={confettiDom}>Workout completed!</Title>
      <Image mb="md" src="/trophy.png" alt="illustration of a trophy" width={300} height={300} />
      <Text>Congrats, you completed your workout! 🎉</Text>
      <Text>Check your <Link href="/profile">profile</Link> to see your progress and to repeat workouts.</Text>
    </Flex>
  </div>
}

export default Workout
