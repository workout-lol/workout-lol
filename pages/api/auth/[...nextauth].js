import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import CryptoJS from 'crypto-js'
import { generateSlug } from "random-word-slugs"
import { getUserByQuery, createUser } from '../../../lib/db-helper'

const PASSWORD_HASH_SECRET = process.env.PASSWORD_HASH_SECRET

export const authOptions = {
  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === "google") {
        const [user] = await getUserByQuery({ email: profile.email })

        if (user) { // user exists
          return user.provider === 'google'
            ? user
            : '/sign-up?error=exists'
        }

        let slug = generateSlug()
        let [slugAlreadyExists] = await getUserByQuery({ slug })

        while (slugAlreadyExists) {
          slug = generateSlug()
          const [existingUsers] = await getUserByQuery({ slug })
          slugAlreadyExists = existingUsers.length > 0
        }

        // create user
        await createUser({ email: profile.email, provider: 'google', slug })
        const [newUser] = await getUserByQuery({ email: profile.email })
        return newUser
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
        username: { label: "E-Mail", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const { username, password } = credentials
        const passHash = CryptoJS.SHA256(password, PASSWORD_HASH_SECRET).toString(CryptoJS.enc.Hex);
        const [user] = await getUserByQuery({ email: username })

        if (user && user.password === passHash) {
          return user
        }
        // Return null if user data could not be retrieved
        return null
      }
    }),
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
    // ...add more providers here
  ].filter(Boolean),
}

export default NextAuth(authOptions)