import React, { useState } from 'react'
import { Indicator, ActionIcon, Modal, Text } from '@mantine/core'
import { IconBell } from "@tabler/icons-react"
import { useLocalStorage } from '../../utils/useAccount'

const releaseNotesDate = "2023-06-30T05:53:47.260Z"
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
      <Text fw={700}>Communicate new features</Text>
      <Text mb="sm">The newest addition to workout.lol is this pop-up. Here we will display the latest additions to the website.</Text>
      <Text mb="sm">We have a lot of <a href="https://github.com/Vincenius/workout-lol/issues" target="_blank" rel="noopener noreferrer">things planned</a> and are open for contributions.</Text>
      <Text mb="sm">
        Is there anything you would like to see on workout.lol that would improve your experience?
        Let me know via <a href="mailto:info@workout.lol">Email</a>, <a href="https://twitter.com/wweb_dev" target="_blank" rel="noopener noreferrer">Twitter</a> or <a href="https://github.com/Vincenius/workout-lol/issues" target="_blank" rel="noopener noreferrer">GitHub</a>.
      </Text>
      <Text mb="sm">Enjoy your workout 💪!</Text>
      <Text>Cheers,</Text>
      <Text>Vincent</Text>
    </Modal>
  </>
}

export default ReleaseNotes
