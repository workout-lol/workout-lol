import React from 'react'
import { Button, Flex, Text } from '@mantine/core'
import { IconShare } from '@tabler/icons-react'
import toast from 'react-hot-toast'
import { copyToClipboard } from '@/utils/clipboard'

const Header = ({ slug }) => {
  const handleShare = () => {
    const value = `${window.location.origin}/u/${slug}`
    copyToClipboard(value)
    toast.success('Copied to clipboard!')
  }

  return (
    <Flex
      sx={{
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 'sm',
      }}
    >
      <Text fw='bold' fz='xl'>
        About{' '}
        <Text
          span
          inherit
          variant='gradient'
          gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
          sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
          fz='xl'
          fw={700}
        >
          {slug}
        </Text>
      </Text>

      <Button
        ml='sm'
        variant='outline'
        sx={{
          alignSelf: 'end',
          cursor: 'pointer',
        }}
        onClick={handleShare}
        leftIcon={<IconShare size='0.8rem' />}
      >
        Share this profile
      </Button>
    </Flex>
  )
}

export default Header
