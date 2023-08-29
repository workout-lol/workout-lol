import React, { useState } from 'react'
import { Indicator, ActionIcon, Modal, Text } from '@mantine/core'
import { IconBell } from '@tabler/icons-react'
import { useLocalStorage } from '../../utils/useAccount'

const releaseNotesDate = '2023-08-27T10:03:20.415Z'
const dateString = new Date(releaseNotesDate).toLocaleDateString()

const IconContainer = ({ children, lastVisit }) =>
  !lastVisit || releaseNotesDate > lastVisit ? (
    <Indicator>{children}</Indicator>
  ) : (
    <>{children}</>
  )

const ReleaseNotes = () => {
  const [opened, setOpened] = useState(false)
  const [localStorage, setLocalStorage] = useLocalStorage('lastVisit')

  const lastVisit = localStorage.data && localStorage.data.lastVisit

  const showNotes = () => {
    setOpened(true)
    setLocalStorage({ lastVisit: new Date().toISOString() })
  }

  return (
    <>
      <IconContainer lastVisit={lastVisit}>
        <ActionIcon variant='subtle' onClick={showNotes}>
          <IconBell size='1rem' />
        </ActionIcon>
      </IconContainer>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={`What's New: ${dateString}`}
      >
        <Text fw={700}>Announcement About Videos & Instructions</Text>
        <Text mb='sm'>
          As our agreement with MuscleWiki has come to an end, we have
          removed/replaced the videos and instructions for our exercise. Some
          exercises will not have videos and instructions and for now - we are
          working on replacing them. All instructions will be live by 29th
          August. Videos will take a few weeks.
        </Text>
        {/* <Text mb="sm">
        Is there anything you would like to see on workout.lol that would improve your experience?
        Let me know via <a href="mailto:info@workout.lol">Email</a>, <a href="https://twitter.com/wweb_dev" target="_blank" rel="noopener noreferrer">Twitter</a> or <a href="https://github.com/Vincenius/workout-lol/issues" target="_blank" rel="noopener noreferrer">GitHub</a>.
      </Text> */}
        <Text mb='sm'>Thank you for your patience. Enjoy your workout 💪!</Text>
        <Text>Cheers,</Text>
        <Text>The Workout.lol Crew</Text>
      </Modal>
    </>
  )
}

export default ReleaseNotes
