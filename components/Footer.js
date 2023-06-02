import React from 'react'
import Link from 'next/link'
import { Text, Flex, ActionIcon } from '@mantine/core'
import { IconBrandGithub, IconMail, IconBrandTwitter } from '@tabler/icons-react'

const Footer = () => {
  return <>
    <Flex justify="space-between">
      <div>
        <Flex>
          <a href="https://github.com/Vincenius/simple-workout" target="_blank" rel="noopener noreferrer">
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
      <div>
        <Link href="/privacy">privacy policy</Link>
      </div>
    </Flex>
  </>
}

export default Footer
