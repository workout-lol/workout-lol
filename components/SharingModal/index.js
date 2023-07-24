import {
  Button,
  Center,
  Modal,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core'
import dayjs from 'dayjs'
import Image from 'next/image'
import * as htmlToImage from 'html-to-image'
import { toBlob } from 'html-to-image'
import { useRef } from 'react'

export const SharingModal = ({ numberOfExercise, ...rest }) => {
  const containerRef = useRef(null)
  const imageRef = useRef(null)
  const { colorScheme } = useMantineColorScheme()
  const theme = useMantineTheme()
  const background = colorScheme === 'dark' ? theme.colors.dark[7] : theme.white

  const share = async () => {
    try {
      const newFile2 = await toBlob(containerRef.current)
      // This is for reading svg image
      const newFile = await toBlob(imageRef.current)
      const data = {
        files: [
          new File([newFile, newFile2], 'image.png', {
            type: newFile.type,
          }),
        ],
        title: 'Image',
        text: 'image',
      }

      if (!navigator?.canShare(data)) {
        console.error("Can't share")
      }
      await navigator.share(data)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Modal centered withCloseButton={false} {...rest}>
      <Stack justify='center' align='center' spacing={8}>
        <Stack
          justify='center'
          align='center'
          spacing={8}
          bg={background}
          ref={containerRef}
        >
          <img
            ref={imageRef}
            src='/trophy.png'
            alt='illustration of a trophy'
            width={300}
            height={300}
          />
          <Title size={'h3'} ta='center'>
            Congrats, you completed your workout at{' '}
            {dayjs().format('DD/MM/YYYY')}!
          </Title>
          <Text>You&apos;ve done {numberOfExercise} exercises!</Text>
        </Stack>
        <Button onClick={share}>Share this</Button>
      </Stack>
    </Modal>
  )
}
