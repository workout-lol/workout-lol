import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Text, Badge, Group } from '@mantine/core'
import { Avatar } from '@mantine/core'

import Calendar from '../Calendar/Calendar'
import styles from './Header.module.css'

const ProfileWrapper = ({ user, children }) => user && user.workouts && Object.keys(user.workouts).length > 0
  ? <Link href="/profile">{children}</Link>
  : <>{children}</> // todo info on hover

const Header = ({ user }) => {
  return <Group position="apart">
    <Group>
      <Link href="/" className={styles.link}>
        <Group>
          <Image width={30} height={30} alt="happy dumbbell logo" src="/logo-small.png" />
          <Text weight={500} className={styles.title}>Workout.lol</Text>
        </Group>
      </Link>

      <Badge color="pink" variant="light">
        Beta
      </Badge>
    </Group>

    <Group>
      <Calendar user={user} />
      <ProfileWrapper user={user}>
        <Avatar radius="xl" />
      </ProfileWrapper>
    </Group>
  </Group>
}

export default Header
