import React, { useState } from 'react'
import {
  ActionIcon,
  AspectRatio,
  LoadingOverlay,
  Modal,
  Popover,
} from '@mantine/core'
import { IconVideo } from '@tabler/icons-react'

const VideoIcon = ({ url }) => {
  const [opened, setOpened] = useState(false)
  const [isReady, setIsReady] = useState(false)

  function handleVideoReady() {
    setIsReady(true)
  }

  return (
    <>
      <ActionIcon
        variant='outline'
        color='blue'
        size='sm'
        onClick={() => setOpened(true)}
      >
        <IconVideo size='1rem' />
      </ActionIcon>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        centered
        withCloseButton={false}
        size='lg'
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <LoadingOverlay visible={!isReady} />
        <AspectRatio ratio={16 / 9}>
          <video
            playsInline
            muted
            autoPlay
            loop
            src={url}
            onLoadedData={handleVideoReady}
          ></video>
        </AspectRatio>
      </Modal>
    </>
  )
}

export default VideoIcon
