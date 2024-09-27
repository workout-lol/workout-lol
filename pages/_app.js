import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'
import { MantineProvider, ColorSchemeProvider } from '@mantine/core'
import { useLocalStorage } from '../utils/useAccount'
import { Toaster } from 'react-hot-toast'
import { SEO } from '@/constants/seo'

export default function App(props) {
  const [{ isLoading, data }, setColorScheme] = useLocalStorage('theme')
  const colorScheme =
    typeof data === 'object' // initial local storage value = {}
      ? 'light'
      : data || 'light'
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

  const {
    Component,
    pageProps: { session, ...pageProps },
  } = props
  const { description, imageLink, link, title } = SEO
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width'
        />
        <meta name='robots' content='index, follow'></meta>
        <meta charSet='utf-8'></meta>
        <link rel='icon' href='/favicon.ico' />
        <meta name='description' content={description}></meta>
        <link rel='canonical' href={link} />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:site' content={link} />
        <meta name='twitter:title' content={title} />
        <meta name='twitter:description' content={description} />
        <meta name='twitter:creator' content='@wweb_dev' />
        <meta name='twitter:image' content={imageLink} />
        <meta property='og:title' content={title} />
        <meta property='og:image' content={imageLink} />
        <meta property='og:site_name' content='workout.lol' />
        <meta property='og:description' content={description} />
        <meta property='og:url' content={link} />

        <meta name='application-name' content={title}></meta>
        <meta name='apple-mobile-web-app-capable' content='yes'></meta>
        <meta
          name='apple-mobile-web-app-status-bar-style'
          content='default'
        ></meta>
        <meta name='apple-mobile-web-app-title' content={title} />
        <meta name='format-detection' content='telephone=no' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='msapplication-config' content='/icons/browserconfig.xml' />
        <meta name='msapplication-TileColor' content='#efd36c' />
        <meta name='msapplication-tap-highlight' content='no' />
        <meta name='theme-color' content='#efd36c' />

        <link rel='apple-touch-icon' href='/icons/logo.png' />
        <link
          rel='apple-touch-icon'
          sizes='384x384'
          href='/icons/logo-384x384.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='192x192'
          href='/icons/logo-192x192.png'
        />
        <link rel='manifest' href='/manifest.json' />
        <link rel='mask-icon' href='/icons/logo.png' color='#efd36c' />
        <link rel='shortcut icon' href='/favicon.ico' />

        <script
          async
          src='https://www.googletagmanager.com/gtag/js?id=G-1D4ECEBPES'
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-1D4ECEBPES');
            `,
          }}
        />
      </Head>

      <SessionProvider session={session}>
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{ colorScheme }}
          >
            {isLoading && <></>}
            {!isLoading && <Component {...pageProps} />}
            <Toaster />
          </MantineProvider>
        </ColorSchemeProvider>
      </SessionProvider>
    </>
  )
}
