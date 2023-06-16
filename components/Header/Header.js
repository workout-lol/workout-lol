import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Text, Badge, Group, Menu } from '@mantine/core'
import { Avatar } from '@mantine/core'
import {
  IconLogin,
  IconUserPlus,
  IconLogout
} from "@tabler/icons-react";
import { useSession, signIn, signOut } from "next-auth/react"

import useAccount from '../../utils/useAccount'
import Calendar from '../Calendar/Calendar'
import styles from './Header.module.css'

const Header = () => {
  const { data: session } = useSession()
  const [account = {}] = useAccount()
  const { data: user = {} } = account
  const hasWorkouts = user && user.workouts && Object.keys(user.workouts).length > 0
  const profileDisabled = !hasWorkouts && !session

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
      <Menu shadow="md" width={200} style={{ cursor: 'pointer' }}>
        <Menu.Target>
          <Avatar radius="xl" />
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item disabled={profileDisabled}>
            { profileDisabled && "Profile" }
            { !profileDisabled && <Link href="/profile" className={styles.link}>Profile</Link> }
          </Menu.Item>
          <Menu.Divider />
          { !session && <>
            <Menu.Item onClick={() => signIn()} icon={<IconLogin size={14} />}>Login</Menu.Item>
            <Menu.Item icon={<IconUserPlus size={14} />}>
              <Link href="/sign-up" className={styles.link}>Sign-Up</Link>
            </Menu.Item>
          </> }
          { session && <>
            <Menu.Item onClick={() => signOut()} icon={<IconLogout size={14} />}>Logout</Menu.Item>
          </> }
        </Menu.Dropdown>
      </Menu>
    </Group>
  </Group>
}

export default Header
