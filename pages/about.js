import { Text } from '@mantine/core'
import Layout from '../components/Layout/Layout'

export default function Home() {
  return (
    <Layout>
      <Text fw='bold'>About</Text>
      <Text>
        <p>Welcome to Workout.lol!</p>
        <p>
          Workout.lol is a free and open-source platform designed to help you
          achieve your fitness goals. We are building a library of exercises and
          videos and also working on suggestion, tracking feedback and feature
          requests.
        </p>
        <p>
          Workout.lol is still in beta. Your feedback is highly valued, so
          please don&apos;t hesitate to reach out to me via{' '}
          <a href='mailto:info@workout.lol'>mail</a> if you encounter any bugs
          or have specific requests.
        </p>
        <p>
          If you enjoy using Workout.lol and would like to contribute to its
          development and maintenance, you can support us by making a{' '}
          <a href='https://ko-fi.com/workout_lol'>donation</a> to help cover the
          running costs.
        </p>
        <p>Thank you for joining me on this fitness journey!</p>
        <br />
        Cheers,
        <br />
        Workout.lol Crew
      </Text>
    </Layout>
  )
}
