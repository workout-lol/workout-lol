import React from 'react'
import { useMantineColorScheme, Card } from '@mantine/core'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import styles from './Layout.module.css'
import useAccount from '../../utils/useAccount'
import FullscreenLoader from '../FullscreenLoader'

const Layout = ({ children }) => {
  const [account = {}] = useAccount()
  const { colorScheme } = useMantineColorScheme()
  const dark = colorScheme === 'dark'
  const { isLoading } = account

  return (
    <main className={!dark ? styles.main : styles.mainDark}>
      <Card
        shadow='sm'
        padding='lg'
        radius='md'
        withBorder
        className={styles.mainCard}
      >
        <Card.Section withBorder inheritPadding py='xs'>
          <Header />
        </Card.Section>
        <Card.Section inheritPadding py='md'>
          <FullscreenLoader isVisible={isLoading} />
          {...children}
        </Card.Section>

        <Card.Section withBorder inheritPadding py='lg' mt='lg'>
          <Footer />
        </Card.Section>
      </Card>
    </main>
  )
}

export default Layout
