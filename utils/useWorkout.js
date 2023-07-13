import useSWR from "swr";

const fetchWorkout = id => id
  ? fetch('/api/workout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids }),
  }).then((res) => res.json())
  : Promise.resolve(null)

const useWorkout = (id) => {
  const { data, isLoading, } = useSWR(`/workout-${id}`, () => fetchWorkout(id))

  return { data, isLoading }
}

export default useWorkout