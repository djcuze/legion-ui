import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { getUpcomingEvents } from './upcomingEvents'
import Container from '@mui/material/Container'
import * as React from 'react'
import Events from './Events'

export default async function EventsPage () {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['upcomingEvents'],
    queryFn: getUpcomingEvents,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container sx={{mt: 10, mb: 8}}>

       <Events/>

      </Container>
    </HydrationBoundary>
  )
}
