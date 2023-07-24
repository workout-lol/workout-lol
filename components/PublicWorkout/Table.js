import React from 'react'
import { Flex, Text } from '@mantine/core'

const PublicWorkoutTable = ({ workouts }) => {
  return (
    <div>
      {workouts.map((workout, index) => (
        <Flex mb='xs' key={`wo-${index}`} justify='space-between'>
          <Flex mr='sm'>
            <div>
              <Text>{workout.name}</Text>
              <Text>muscles</Text>
            </div>
            <div>
              <Text>by @someone</Text>
              <Text>Equipment</Text>
            </div>
          </Flex>
          <Flex>up and downvote</Flex>
        </Flex>
      ))}
    </div>
  )
}

export default PublicWorkoutTable
