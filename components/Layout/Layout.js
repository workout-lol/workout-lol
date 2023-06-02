import React from 'react'
import { Card } from '@mantine/core'
import Header from '../Header/Header'
import Footer from '../Footer'
import styles from './Layout.module.css'

const Layout = ({ children, user }) => {
  return <main className={styles.main}>
    <Card shadow="sm" padding="lg" radius="md" withBorder className={styles.mainCard}>
      <Card.Section withBorder inheritPadding py="xs">
        <Header user={user} />
      </Card.Section>
      <Card.Section inheritPadding py="md">
        {...children}
      </Card.Section>

      <Card.Section withBorder inheritPadding py="lg" mt="lg">
        <Footer />
      </Card.Section>
    </Card>
  </main>
}

export default Layout
