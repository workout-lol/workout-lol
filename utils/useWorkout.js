import useSWR from 'swr'

const fetchWorkout = (id) =>
  id
    ? fetch(`/api/workout?id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => res.json())
    : Promise.resolve(null)

const useWorkout = (id) => {
  const { data, isLoading } = useSWR(`/workout-${id}`, () => fetchWorkout(id))

  return { data, isLoading }
}

export default useWorkout
