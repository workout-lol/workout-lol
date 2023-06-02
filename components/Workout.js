import React, { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Text, Timeline, Flex, Paper, Button, List, Input, Popover, Badge, Title } from '@mantine/core'
import { IconCheck } from '@tabler/icons-react'
import party from "party-js"

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
      console.log('done')
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

          <Flex>
            <Input placeholder="1. Set" maxLength={6} w={70} mr="sm" onChange={e => handleChange(e.target.value, 0)} />
            <Input placeholder="2. Set" maxLength={6} w={70} mr="sm" onChange={e => handleChange(e.target.value, 1)} disabled={!sets[0]}/>
            <Input placeholder="3. Set" maxLength={6} w={70} mr="sm" onChange={e => handleChange(e.target.value, 2)} disabled={!sets[1]}/>
            <Button onClick={goNext}>Next Exercise</Button>
          </Flex>
          <Popover width={300} withArrow shadow="md">
            <Popover.Target>
              <Badge mb="md" mt="sm">
                What is this?
              </Badge>
            </Popover.Target>

            <Popover.Dropdown>
              <Text size="sm">(Optional) Track your repititions or times. ... more description text TODO</Text>
            </Popover.Dropdown>
          </Popover>
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
