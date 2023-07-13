import React from 'react'
import { useMantineColorScheme, Text, Paper } from '@mantine/core'

const InfoCard = ({ children }) => {
  const { colorScheme } = useMantineColorScheme()
  const background = colorScheme === 'dark' ? '#101113' : '#f1f3f5'

  return (
    <Paper shadow='none' p='xs' mb='xl' bg={background}>
      <Text fs='italic'>{children}</Text>
    </Paper>
  )
}

export default InfoCard
