import React, { useState } from 'react'
import { Indicator, ActionIcon, Modal, Text } from '@mantine/core'
import { IconBell } from "@tabler/icons-react"
import { useLocalStorage } from '../../utils/useAccount'

const releaseNotesDate = "2023-07-06T06:32:47.260Z"
const dateString = new Date(releaseNotesDate).toLocaleDateString()

const IconContainer = ({ children, lastVisit }) => !lastVisit || (releaseNotesDate > lastVisit)
  ? <Indicator>{children}</Indicator>
  : <>{children}</>

const ReleaseNotes = () => {
  const [opened, setOpened] = useState(false)
  const [localStorage, setLocalStorage] = useLocalStorage('lastVisit')

  const lastVisit = localStorage.data && localStorage.data.lastVisit

  const showNotes = () => {
    setOpened(true)
    setLocalStorage({ lastVisit: new Date().toISOString() })
  }

  return <>
    <IconContainer lastVisit={lastVisit}>
      <ActionIcon variant="subtle" onClick={showNotes}><IconBell size="1rem" /></ActionIcon>
    </IconContainer>
    <Modal opened={opened} onClose={() => setOpened(false)} title={`What's New: ${dateString}`}>
      <Text fw={700}>Difficulty Selection</Text>
      <Text mb="sm">You can now select the difficulty of the exercises for your workout on the muscle selecetion screen.</Text>

      {/* <Text mb="sm">
        Is there anything you would like to see on workout.lol that would improve your experience?
        Let me know via <a href="mailto:info@workout.lol">Email</a>, <a href="https://twitter.com/wweb_dev" target="_blank" rel="noopener noreferrer">Twitter</a> or <a href="https://github.com/Vincenius/workout-lol/issues" target="_blank" rel="noopener noreferrer">GitHub</a>.
      </Text> */}
      <Text mb="sm">Enjoy your workout 💪!</Text>
      <Text>Cheers,</Text>
      <Text>Vincent</Text>
    </Modal>
  </>
}

export default ReleaseNotes
