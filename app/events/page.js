import { EventForm } from '/components/EventForm'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import dayjs from '/utils/dayjs'
import Grid from '@mui/material/Grid2'

const UpcomingEvents = async () => {
  const data = await fetch('https://legion-events-au-platform-03eeffdb069d.herokuapp.com/events', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  })
  const events = await data.json()

  const months = Object.keys(events.events)

  return (
    <div className="mt-5 p-5">
      <Grid container spacing={2}>
        {months.map((month, index) => (
          <Grid key={month}>
            <div key={month}>
              <Typography variant="h6">
                {month}
              </Typography>

              <List className="max-w-96 w-full" dense>
                {events.events[month].map(event => (
                  <ListItem key={event.id}>
                    <ListItemAvatar>
                      <div className={'mr-5'}>
                        <Typography variant="button">
                          {dayjs(event.start_time).format('ddd D')}
                        </Typography>
                      </div>
                    </ListItemAvatar>
                    <ListItemText primary={event.title} secondary={event.promoter}/>
                  </ListItem>
                ))}
              </List>
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default async function Events () {
  return (
    <div>
      <Divider className="font-sans">
        <Chip label="Upcoming events"/>
      </Divider>

      <UpcomingEvents/>

      <Divider className="font-sans">
        <Chip label="Register an event"/>
      </Divider>

      <EventForm/>
    </div>
  )
}
