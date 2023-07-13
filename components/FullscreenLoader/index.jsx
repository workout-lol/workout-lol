import { Box } from '@mantine/core'
import { useState, useEffect } from 'react'
import { Text, LoadingOverlay } from '@mantine/core'

import QUOTES from 'constants/quotes.json'
import useWindowSize from '../../utils/useWindowSize'
import { getRandomNumberBetween } from '../../utils/random'

const LOADER_HEIGHT = 36
const MAX_TEXT_WIDTH = 500

function FullscreenLoader({ isVisible }) {
  const size = useWindowSize()
  const textWidth =
    size.width > MAX_TEXT_WIDTH ? MAX_TEXT_WIDTH : size.width - 100
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [fade, setFade] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true)
      setTimeout(() => {
        // avoid 2 times the same quote
        let newIndex
        do {
          newIndex = getRandomNumberBetween(0, QUOTES.length - 1)
        } while (newIndex === quoteIndex)
        setQuoteIndex(newIndex)
        setFade(false)
      }, 500)
    }, 2000)

    return () => clearInterval(interval)
  }, [quoteIndex])

  if (!isVisible) return null

  return (
    <>
      <LoadingOverlay visible={isVisible} overlayBlur={2.5} />
      <Box
        style={{
          ...textStyle(textWidth),
          opacity: fade ? 0 : 1,
          transition: 'opacity 0.5s',
        }}
      >
        <Text
          variant='gradient'
          gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
          sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
          ta='center'
          fz='xl'
          fw={700}
        >
          &quot;{QUOTES[quoteIndex].quote}&quot;
        </Text>

        <Text
          variant='gradient'
          gradient={{ from: 'cyan', to: 'indigo', deg: 10 }}
          sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
          ta='center'
          fz='xl'
          fs='italic'
          fw={500}
        >
          {QUOTES[quoteIndex].author}
        </Text>
      </Box>
    </>
  )
}

const textStyle = (textWidth) => ({
  position: 'absolute',
  maxWidth: `${textWidth}px`,
  width: '100%',
  zIndex: 401, // 401 bcs 400 is the z-index of the LoadingOverlay from mantine
  top: `calc(50% + ${LOADER_HEIGHT}px)`,
  right: `calc(50% - ${textWidth / 2}px)`,
  overflowWrap: 'break-word',
})

export default FullscreenLoader
