import useSWR from 'swr'

export const createPublicWorkout = (newWorkout) =>
  fetch('/api/public-workout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newWorkout),
  })

const fetchPublicWorkouts = (filter) =>
  fetch(`/api/public-workout?${filter}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json())

const useWorkout = (filter = '') => {
  const { data, isLoading } = useSWR(`/public-workout-${filter}`, () =>
    fetchPublicWorkouts(filter)
  )

  return { data, isLoading }
}

export default useWorkout
