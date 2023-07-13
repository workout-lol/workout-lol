import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  useMantineColorScheme,
  Text,
  Group,
  Menu,
  ActionIcon,
} from '@mantine/core'
import { Avatar } from '@mantine/core'
import {
  IconLogin,
  IconUserPlus,
  IconLogout,
  IconSun,
  IconMoonStars,
} from '@tabler/icons-react'
import { useSession, signIn, signOut } from 'next-auth/react'

import useAccount from '../../utils/useAccount'
import Calendar from '../Calendar/Calendar'
import ReleaseNotes from './ReleaseNotes'
import styles from './Header.module.css'

const Header = () => {
  const { data: session } = useSession()
  const [account = {}] = useAccount()
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const dark = colorScheme === 'dark'
  const { data: user = {} } = account
  const userAvatar =
    session &&
    session.user.email &&
    session.user.email.substring(0, 2).toUpperCase()

  return (
    <Group position='apart'>
      <Group>
        <Link href='/' className={styles.link}>
          <Group>
            <Image
              width={30}
              height={30}
              alt='happy dumbbell logo'
              src='/logo-small.png'
            />
            <Text
              weight={500}
              className={!dark ? styles.title : styles.titleDark}
            >
              Workout.lol
            </Text>
          </Group>
        </Link>
      </Group>
      <Group>
        <Calendar workouts={user.workouts || []} />
        <ReleaseNotes />
        <ActionIcon
          variant='outline'
          color={dark ? 'yellow' : 'blue'}
          onClick={() => toggleColorScheme()}
          title='Toggle color scheme'
        >
          {dark ? <IconSun size='1.1rem' /> : <IconMoonStars size='1.1rem' />}
        </ActionIcon>
        <Menu shadow='md' width={200} style={{ cursor: 'pointer' }}>
          <Menu.Target>
            <Avatar radius='xl' color={!!userAvatar ? 'blue' : undefined}>
              {userAvatar ? userAvatar : ''}
            </Avatar>
          </Menu.Target>
          <Menu.Dropdown>
            <Link href='/profile' className={styles.link}>
              <Menu.Item>Profile</Menu.Item>
            </Link>
            <Menu.Divider />
            {!session && (
              <>
                <Menu.Item
                  onClick={() => signIn()}
                  icon={<IconLogin size={14} />}
                >
                  Login
                </Menu.Item>
                <Link href='/sign-up' className={styles.link}>
                  <Menu.Item icon={<IconUserPlus size={14} />}>
                    Sign-Up
                  </Menu.Item>
                </Link>
              </>
            )}
            {session && (
              <>
                <Menu.Item
                  onClick={() => signOut()}
                  icon={<IconLogout size={14} />}
                >
                  Logout
                </Menu.Item>
              </>
            )}
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  )
}

export default Header
