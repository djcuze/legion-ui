import { EventForm } from '/components/EventForm'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import UpcomingEvents, { getUpcomingEvents } from './upcomingEvents'
import { Alert } from '@mui/material'

export default async function Events () {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['upcomingEvents'],
    queryFn: getUpcomingEvents,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Alert severity="warning">
        This page is under development. Please report all issues and feedback to the FB group
      </Alert>

      <UpcomingEvents/>

      <Divider className="font-sans">
        <Chip label="Register an event"/>
      </Divider>

      <EventForm/>
    </HydrationBoundary>
  )
}
