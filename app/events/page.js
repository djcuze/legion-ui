import { EventForm } from '/components/EventForm'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import UpcomingEvents, { getUpcomingEvents } from './upcomingEvents'

export default async function Events () {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['upcomingEvents'],
    queryFn: getUpcomingEvents,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Divider className="font-sans">
        <Chip label="Upcoming events"/>
      </Divider>

      <UpcomingEvents/>

      <Divider className="font-sans">
        <Chip label="Register an event"/>
      </Divider>

      <EventForm/>
    </HydrationBoundary>
  )
}
