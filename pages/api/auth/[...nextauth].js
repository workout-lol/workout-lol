import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import TwitterProvider from 'next-auth/providers/twitter'
import CryptoJS from 'crypto-js'
import { generateSlug } from 'random-word-slugs'
import { getUserByQuery, createUser } from '../../../lib/db-helper'

const PASSWORD_HASH_SECRET = process.env.PASSWORD_HASH_SECRET

const createOauthUser = async ({ email, provider, defaultSlug }) => {
  const [user] = await getUserByQuery({ email })

  if (user) {
    // user exists
    return user.provider === provider ? user : '/sign-up?error=exists'
  }

  let slug = defaultSlug || generateSlug()
  let [slugAlreadyExists] = await getUserByQuery({ slug })

  while (slugAlreadyExists) {
    slug = generateSlug()
    const [existingUsers] = await getUserByQuery({ slug })
    slugAlreadyExists = existingUsers.length > 0
  }

  // create user
  await createUser({ email, provider, slug })
  const [newUser] = await getUserByQuery({ email })
  return newUser
}

export const authOptions = {
  callbacks: {
    async signIn({ account, profile }) {
      console.log(account, profile)
      if (account.provider === 'google') {
        const user = await createOauthUser({
          email: profile.email,
          provider: account.provider,
        })
        return user
      } else if (account.provider === 'twitter') {
        const user = await createOauthUser({
          email: profile.email,
          provider: account.provider,
          defaultSlug: profile.screen_name,
        })
        return user
      }

      return true // Do different verification for other providers
    },
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/profile`
    },
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {
          label: 'E-Mail',
          type: 'text',
          placeholder: 'you@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const { username, password } = credentials
        const passHash = CryptoJS.SHA256(
          password,
          PASSWORD_HASH_SECRET
        ).toString(CryptoJS.enc.Hex)
        const [user] = await getUserByQuery({ email: username })

        if (user && user.password === passHash) {
          return user
        }
        // Return null if user data could not be retrieved
        return null
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    }),
    // ...add more providers here
  ].filter(Boolean),
}

export default NextAuth(authOptions)
