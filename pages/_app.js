import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core'

export default function App(props) {
  const { Component, pageProps } = props

  return (
    <>
      <Head>
        <title>Workout.lol | The easiest way to create a workout routine</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
        {/* TODO Meta tags */}
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: 'light',
        }}
      >
        <Component {...pageProps} />
      </MantineProvider>
    </>
  );
}