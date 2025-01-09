import { EventForm } from '/components/EventForm'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import UpcomingEvents, { getUpcomingEvents } from './upcomingEvents'
import Container from '@mui/material/Container'

export default async function Events () {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['upcomingEvents'],
    queryFn: getUpcomingEvents,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container sx={{mt: 10, mb: 8}}>

        <UpcomingEvents/>

        <Divider className="font-sans" sx={{mt: 3}}>
          <Chip color="primary" label="Register an event"/>
        </Divider>

        <EventForm/>
      </Container>
    </HydrationBoundary>
  )
}
