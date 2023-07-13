import useSWR from 'swr'

const fetcher = (slug) =>
  slug
    ? fetch(`/api/user/${slug}`).then((res) => res.json())
    : Promise.resolve()

export default function useGetUserBySlug(slug) {
  const {
    data = null,
    error,
    isLoading,
  } = useSWR(`/user/${slug}`, () => fetcher(slug))

  return {
    isLoading,
    isError: error,
    workouts: data ? Object.values(data.workouts) : [],
  }
}
