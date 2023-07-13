import { useState, useEffect } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import { useSession } from 'next-auth/react'

export const useLocalStorage = (key) => {
  const [value, setValue] = useState()

  // Initial fetch from storage
  useEffect(() => {
    const initValue = localStorage.getItem(key)
    setValue(initValue ? JSON.parse(initValue) : {})
  }, [key])

  // Persist to storage
  useEffect(() => {
    // first render, don't override/destroy existing item value
    if (value !== undefined) {
      localStorage.setItem(key, JSON.stringify(value))
    }
  }, [key, value])

  return [{ isLoading: !value, data: value }, setValue]
}

const fetcher = (email) =>
  email ? fetch('/api/user').then((res) => res.json()) : Promise.resolve()

const fetchExercises = (ids) =>
  ids && ids.length
    ? fetch('/api/exercises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
      }).then((res) => res.json())
    : Promise.resolve()

const updateUser = (user) =>
  fetch('/api/user', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  }).then((res) => res.json())

const useUserStorage = (session) => {
  const email = session && session.user && session.user.email
  const {
    data = {},
    error,
    isLoading,
  } = useSWR(`/user-${email}`, () => fetcher(email))
  const { mutate } = useSWRConfig()

  const setUser = (newUser) => {
    return mutate(`/user-${email}`, updateUser(newUser), {
      optimisticData: newUser,
    })
  }

  return [{ isLoading, data }, setUser]
}

export default function useAccount() {
  const { data: session } = useSession()
  const [localStorageUser, setLocalStorage] = useLocalStorage('user')
  const [databaseUser, setDatabaseUser] = useUserStorage(session)
  const user = session === null ? localStorageUser : databaseUser
  const setUser = session === null ? setLocalStorage : setDatabaseUser

  const exerciseIds = (user?.data?.workouts || [])
    .map((w) => w.exercises.map((e) => e.id))
    .flat()
  const uniqueIds = [...new Set(exerciseIds)]

  const { data = {}, isLoading } = useSWR(`/exercises-${uniqueIds}`, () =>
    fetchExercises(uniqueIds)
  )

  // inject database exercises into user workouts
  if (uniqueIds && uniqueIds.length && data && data.length) {
    user.data.workouts = (user.data.workouts || []).map((w) => ({
      ...w,
      exercises: w.exercises.map((e) => ({
        ...e,
        ...data.find((ex) => ex._id === e.id),
      })),
    }))
  }

  if (session === undefined || isLoading) {
    return [{ isLoading: true }, setUser]
  }

  return [user, setUser]
}
