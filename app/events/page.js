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
import Box from '@mui/material/Box'

export default async function Events () {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['upcomingEvents'],
    queryFn: getUpcomingEvents,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Box sx={{mt: 2}}>
        <UpcomingEvents/>

        <Divider className="font-sans">
          <Chip label="Register an event"/>
        </Divider>

        <EventForm/>
      </Box>
    </HydrationBoundary>
  )
}
