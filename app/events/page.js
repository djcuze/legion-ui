import dayjs from '/utils/dayjs'

export default async function Events () {
  const data = await fetch('http://localhost:3000/events')
  const events = await data.json()

  return (
    <div>
      <h1>Upcoming events</h1>

      <ul className="max-w-96 w-full">
        {events.map((event) => (
          <li key={event.id}>
            <div className={'grid grid-cols-2 gap-4'}>
              <div>{dayjs(event.start_time).format('Do MMM')}</div>
              <div>{event.title}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )

}
