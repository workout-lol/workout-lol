import React from 'react'
import { ActionIcon, Popover } from '@mantine/core'
import { IconVideo } from '@tabler/icons-react'

const VideoIcon = ({ url }) => {
  return <Popover position="bottom" shadow="md">
    <Popover.Target>
      <ActionIcon variant="outline" color="blue" size="sm">
        <IconVideo size="1rem" />
      </ActionIcon>
    </Popover.Target>
    <Popover.Dropdown p={0}>
      <video
        playsInline
        muted
        autoPlay
        loop
        width="auto"
        height="130px"
        style={{ margin: '0', borderRadius: '0.25rem', marginBottom: '-5px' }}
        src={url}>
      </video>
    </Popover.Dropdown>
  </Popover>
}

export default VideoIcon
