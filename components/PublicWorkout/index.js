import React from 'react'
import {
  Text,
  TextInput,
  Textarea,
  Flex,
  Badge,
  Timeline,
  Accordion,
} from '@mantine/core'
import { muscleToColor, equipmentLabels } from '../Exercises/utils'
import VideoIcon from '../Exercises/VideoIcon'

const PublicWorkout = ({
  workout,
  name = '',
  description = '',
  setName,
  setDescription,
}) => {
  const equipment = [...new Set(workout.map((e) => e.equipment).flat())]
  const muscles = [...new Set(workout.map((e) => e.mainMuscle))]
  const difficulties = [...new Set(workout.map((e) => e.difficulty))]

  return (
    <div>
      {setName && (
        <TextInput
          placeholder='Name'
          label='Name'
          required
          mb='md'
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
      )}
      {!setName && <Text>{name}</Text>}
      {setDescription && (
        <Textarea
          label='Description'
          placeholder='Description (optional)'
          mb='md'
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
        />
      )}
      {!setDescription && <Text>{description}</Text>}
      <Text fw='bold'>Equipment</Text>
      <Flex mb='md'>
        {equipment.map((e) => (
          <Text key={e} mr='md'>
            {equipmentLabels[e]}
          </Text>
        ))}
      </Flex>

      <Text fw='bold'>Difficulties</Text>
      <Flex mb='md'>
        {difficulties.map((e) => (
          <Text key={e} mr='md'>
            {e}
          </Text>
        ))}
      </Flex>

      <Text fw='bold'>Muscles</Text>
      <Flex mb='md'>
        {muscles.map((m) => (
          <Badge
            key={m}
            color={muscleToColor[m]}
            variant='outline'
            mr='xs'
            mb={4}
            mt={4}
          >
            {m}
          </Badge>
        ))}
      </Flex>

      <Accordion>
        <Accordion.Item value='workout'>
          <Accordion.Control>Exercises</Accordion.Control>
          <Accordion.Panel>
            <Timeline>
              {workout.map((e) => (
                <Timeline.Item key={e._id}>
                  <Flex>
                    <Text mr='sm'>{e.title}</Text>
                    <VideoIcon url={e.videos[0]} />
                  </Flex>
                </Timeline.Item>
              ))}
            </Timeline>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}

export default PublicWorkout
