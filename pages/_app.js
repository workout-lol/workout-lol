import Head from 'next/head';
import { SessionProvider } from "next-auth/react"
import { MantineProvider, ColorSchemeProvider } from '@mantine/core'
import { useLocalStorage } from '../utils/useAccount'
import { Toaster } from 'react-hot-toast';

export default function App(props) {
  const [{ isLoading, data }, setColorScheme] = useLocalStorage('theme')
  const colorScheme = typeof data === 'object' // initial local storage value = {}
    ? 'light'
    : (data || 'light')
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  const { Component, pageProps: { session, ...pageProps }, } = props
  const description = "A small web application to create workouts based on your available equipment and the muscles you want to train."
  const link = "https://workout.lol"
  const title = "Workout.lol | The easiest way to create a workout routine"
  const imageLink = "https://workout.lol/og.png"
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <meta name="robots" content="index, follow"></meta>
        <meta charSet="utf-8"></meta>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={description}></meta>
        <link rel="canonical" href={link} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={link} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:creator" content="@wweb_dev" />
        <meta name="twitter:image" content={imageLink} />
        <meta property="og:title" content={title} />
        <meta property="og:image" content={imageLink} />
        <meta property="og:site_name" content="workout.lol" />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={link} />
        <meta property="og:type" content="article" />

        <script async defer data-website-id="8a475643-d28f-48c6-bed0-c4bd0833f87f" src="https://analytics.vincentwill.com/umami.js"></script>
      </Head>

      <SessionProvider session={session}>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{ colorScheme }}
          >
            { isLoading && <></> }
            { !isLoading && <Component {...pageProps} /> }
            <Toaster />
          </MantineProvider>
        </ColorSchemeProvider>
      </SessionProvider>
    </>
  );
}