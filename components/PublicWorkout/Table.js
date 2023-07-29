import React from 'react'
import Link from 'next/link'
import {
  Box,
  Flex,
  Text,
  Badge,
  Image,
  Tooltip,
  ActionIcon,
  useMantineColorScheme,
  Spoiler,
} from '@mantine/core'
import { IconArrowDown, IconArrowUp } from '@tabler/icons-react'
import { useSession } from 'next-auth/react'
import { muscleToColor, equipmentLabels } from '../Exercises/utils'

const PublicWorkoutTable = ({ workouts }) => {
  const { data: session } = useSession()
  const { colorScheme } = useMantineColorScheme()
  const isLoggedIn = session && session.user && session.user.email

  return (
    <div>
      {workouts.map((workout, i) => (
        <Box
          key={`wo-${i}`}
          style={{
            width: 'calc(100% + 2.5rem)',
            marginLeft: '-1.25rem',
          }}
          bg={
            colorScheme === 'dark'
              ? i % 2 === 0
                ? '#1A1B1E'
                : 'transparent'
              : i % 2 === 0
              ? '#f8f9fa'
              : '#fff'
          }
        >
          <Flex px='lg' py='xs' justify='space-between' align='center'>
            <Flex>
              <Box mr='sm'>
                <Text fw='bold'>{workout.name}</Text>
                <Spoiler maxHeight={24} showLabel='Show more' hideLabel='Hide'>
                  <Text size='sm'>{workout.description}</Text>
                  <Text size='xs' mb='sm'>
                    by&nbsp;
                    <Link href={`/u/${workout.created_by}`}>
                      @{workout.created_by}
                    </Link>
                  </Text>
                  <Box>
                    {workout.muscles.map((m) => (
                      <Badge
                        key={m}
                        color={muscleToColor[m]}
                        variant='outline'
                        mr='xs'
                        mb='xs'
                      >
                        {m}
                      </Badge>
                    ))}
                    <Flex>
                      {workout.equipment.map((eq) => (
                        <Tooltip key={eq} label={equipmentLabels[eq]} withArrow>
                          <Image
                            width={26}
                            height={24}
                            fit='contain'
                            radius='md'
                            src={`/equipment/${eq}.png`}
                            alt={`${equipmentLabels[eq]} Illustration`}
                            mr='sm'
                            mb='sm'
                          />
                        </Tooltip>
                      ))}
                    </Flex>
                  </Box>
                </Spoiler>
              </Box>
            </Flex>
            <Flex direction='column' ml='md'>
              <ActionIcon variant='subtle' size='xs' disabled={!isLoggedIn}>
                <IconArrowUp size='1rem' />
              </ActionIcon>
              <Text size='xs' align='center'>
                {Object.values(workout.votes).filter((v) => v === 'upvote')
                  .length -
                  Object.values(workout.votes).filter((v) => v === 'downvote')}
              </Text>
              <ActionIcon variant='subtle' size='xs' disabled={!isLoggedIn}>
                <IconArrowDown size='1rem' />
              </ActionIcon>
            </Flex>
          </Flex>
        </Box>
      ))}
    </div>
  )
}

export default PublicWorkoutTable
