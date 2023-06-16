import React from 'react'
import { Card } from '@mantine/core'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import styles from './Layout.module.css'
import useAccount from '../../utils/useAccount'

const Layout = ({ children }) => {
  const [account = {}] = useAccount()
  const { isLoading } = account

  return <main className={styles.main}>
    <Card shadow="sm" padding="lg" radius="md" withBorder className={styles.mainCard}>
      <Card.Section withBorder inheritPadding py="xs">
        <Header />
      </Card.Section>
      { isLoading && <Card.Section inheritPadding py="md">
        Loading...
      </Card.Section> }
      { !isLoading && <Card.Section inheritPadding py="md">
        {...children}
      </Card.Section> }

      <Card.Section withBorder inheritPadding py="lg" mt="lg">
        <Footer />
      </Card.Section>
    </Card>
  </main>
}

export default Layout
