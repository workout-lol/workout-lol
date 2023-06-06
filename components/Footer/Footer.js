import React from 'react'
import Link from 'next/link'
import { Text, Flex, ActionIcon } from '@mantine/core'
import { IconBrandGithub, IconMail, IconBrandTwitter } from '@tabler/icons-react'
import styles from './Footer.module.css'

const Footer = () => {
  return <>
    <Flex justify="space-between" align="center">
      <div>
        <Flex>
          <a href="https://github.com/Vincenius/workout-lol" target="_blank" rel="noopener noreferrer">
            <ActionIcon mr="md"><IconBrandGithub/></ActionIcon>
          </a>
          <a href="https://twitter.com/wweb_dev" target="_blank" rel="noopener noreferrer">
            <ActionIcon mr="md"><IconBrandTwitter/></ActionIcon>
          </a>
          <a href="mailto:info@wweb.dev">
            <ActionIcon><IconMail/></ActionIcon>
          </a>
        </Flex>
      </div>
      <Text className={styles.links}>
        <Flex gap={{ base: 0, xs: 'md' }} direction={{ base: 'column', xs: 'row' }}>
          <Link href="https://ko-fi.com/wweb_dev">Donate</Link>
          <Link href="/about">About</Link>
          <Link href="/privacy">Privacy Policy</Link>
        </Flex>
      </Text>
    </Flex>
  </>
}

export default Footer
