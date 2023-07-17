import React from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout/Layout'
import useGetUserBySlug from '@/utils/useGetUserBySlug'
import FullscreenLoader from '../../components/FullscreenLoader'
import ProfileBySlug from '@/containers/user/profile-by-slug'
import Header from '@/containers/user/profile-by-slug/Header'

export default function Page() {
  const router = useRouter()
  const { slug } = router.query

  const request = useGetUserBySlug(slug)
  const { isLoading, workouts } = request

  return (
    <Layout>
      <Header slug={slug} />
      <FullscreenLoader isVisible={isLoading} />
      <ProfileBySlug workouts={workouts} />
    </Layout>
  )
}
